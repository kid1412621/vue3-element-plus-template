<template>
  <!-- 筛选 -->
  <el-form :inline="true" :model="query">
    <el-form-item label="标题">
      <el-input v-model="query.title" clearable></el-input>
    </el-form-item>
    <el-form-item label="来源">
      <el-input v-model="query.origin" clearable></el-input>
    </el-form-item>
    <el-form-item label="类别">
      <el-cascader
        :props="{
          label: 'title',
          isLeaf: 'leaf',
          value: 'key',
          checkStrictly: true,
        }"
        v-model="cat"
        :options="categories"
        clearable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="query.isValid" placeholder="请选择状态" clearable>
        <el-option label="显示" value="true"></el-option>
        <el-option label="隐藏" value="false"></el-option>
      </el-select>
    </el-form-item>
    <div class="btns">
      <el-button @click="reset">重置</el-button>
      <el-button @click="handleAdd" type="primary">新增</el-button>
      <el-button
        type="danger"
        @click="handleDelete(true)"
        :disabled="!selectedIds.length"
        >删除</el-button
      >
      <el-button
        @click="showCatDialog = true"
        type="primary"
        plain
        v-if="this.query.kind != InfoKind.RANKING"
        >分类</el-button
      >
    </div>
  </el-form>

  <!-- 表格 -->
  <el-table ref="table" :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column prop="id" label="ID" width="80"> </el-table-column>
    <el-table-column prop="title" label="标题" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="origin" label="来源"> </el-table-column>
    <template v-if="this.query.kind != InfoKind.RANKING">
      <el-table-column prop="typeText" label="类别"> </el-table-column>
      <el-table-column prop="subtypeText" label="子类别"> </el-table-column>
    </template>
    <el-table-column label="状态">
      <template #default="scope"
        >{{ scope.row.isValid ? "显示" : "隐藏" }}
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
    <el-table-column label="操作" fixed="right" width="150">
      <template #default="scope">
        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(false, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    class="page"
    :total="total"
    v-model:currentPage="query.pageNo"
    v-model:page-size="query.pageSize"
  >
  </el-pagination>

  <!-- 新增/编辑 -->
  <el-dialog
    :title="info.id ? '编辑' : '新增'"
    v-model="showDialog"
    center
    destroy-on-close
    @close="closeDialog"
  >
    <InfoDetail :info="info" ref="detail"></InfoDetail>
    <template #footer>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>

  <!-- 分类 -->
  <el-dialog title="分类" v-model="showCatDialog" center destroy-on-close>
    <Category :kind="kind"></Category>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { getList, addInfo, editInfo, deleteInfo } from "@/api/info";
import { getAllByCode } from "@/api/category";
import { INFO_KIND } from "@/types/const";
import InfoDetail from "@/components/InfoDetail.vue";
import Category from "@/components/Category.vue";
import { PropType } from "vue";

@Options({
  name: "Info",
  props: {
    kind: { type: Number as PropType<INFO_KIND>, required: true },
  },
  components: { InfoDetail, Category },
  data() {
    return {
      InfoKind: INFO_KIND,
      query: {
        // 类别：1-文章；2-课程；3-报告；4-榜单
        kind: this.kind,
        pageNo: 1,
        pageSize: 8,
      },
      list: [],
      selectedIds: [],
      total: 0,
      showDialog: false,
      showCatDialog: false,
      // 新增或修改的数据
      info: {
        kind: this.kind,
      },
      categories: [],
      // 选择的分类，暂时没有更好的办法
      cat: [],
    };
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.loadList();
      },
    },
    cat(val) {
      this.query.type = val && val[0];
      this.query.subtype = val && val[1];
    },
  },
  created() {
    this.loadList();
    this.loadCategory();
  },
  methods: {
    async loadList() {
      const res = await getList(this.query);

      this.list = res.records;
      this.total = res.total;
    },
    async loadCategory() {
      this.categories = await getAllByCode({ pcode: INFO_KIND[this.kind] });
    },
    reset() {
      this.query = {
        // 类别：1-文章；2-课程；3-报告；4-榜单
        kind: this.kind,
        pageNo: 1,
        pageSize: 8,
      };
    },
    handleAdd() {
      this.showDialog = true;
    },
    submit() {
      this.$refs.detail.$refs.form.validate((valid: boolean) => {
        if (!valid) return false;

        (this.info.id ? editInfo(this.info) : addInfo(this.info))
          .then(() => {
            this.$notify({ message: "操作成功" });
            this.loadList();
          })
          .catch((err: Error) => this.$notify.error({ message: err }))
          .finally(() => {
            this.closeDialog();
          });
      });
    },
    closeDialog() {
      this.info = { kind: this.kind };
      this.showDialog = false;
    },
    handleDelete(isBatch: boolean, row: any) {
      if (isBatch && !this.selectedIds.length) return;
      const ids = isBatch ? this.selectedIds : [row.id];
      deleteInfo(ids)
        .then(() => {
          this.$notify({ message: "操作成功" });
          this.loadList();
        })
        .catch((err: Error) => this.$notify.error({ message: err }));
    },
    handleEdit(row: any) {
      this.info = row;
      this.showDialog = true;
    },
    handleSelectionChange(val: any[]) {
      this.selectedIds = val.map((i: any) => i.id);
    },
  },
})
export default class Info extends Vue {}
</script>

<style lang="scss" scoped>
.page {
  bottom: 30px;
  position: absolute;
  right: 50px;
}
.btns {
  align-items: flex-end;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}
</style>
