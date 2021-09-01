<template>
  <!-- 筛选 -->
  <el-form :inline="true" :model="query" label-width="80px" class="filter">
    <el-form-item label="标题">
      <el-input v-model="query.name" clearable></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="query.isValid" placeholder="请选择状态" clearable>
        <el-option label="显示" value="true"></el-option>
        <el-option label="隐藏" value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-button @click="reset">重置</el-button>
    <el-button @click="showDialog = true" type="primary">新增</el-button>
    <el-button
      type="danger"
      @click="handleDelete(true)"
      :disabled="!selectedIds.length"
      >删除</el-button
    >
  </el-form>

  <!-- 表格 -->
  <el-table ref="table" :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column prop="id" label="ID" width="80"> </el-table-column>
    <el-table-column prop="name" label="名称" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="subtitle" label="备注" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="状态">
      <template #default="scope"
        >{{ scope.row.isValid ? "显示" : "隐藏" }}
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
    <el-table-column label="操作" fixed="right" width="250">
      <template #default="scope">
        <el-button
          size="mini"
          @click="
            showCollItemDialog = true;
            collectionId = scope.row.id;
          "
          plain
          type="primary"
          >管理{{ kind == 1 ? "文章" : "课程" }}</el-button
        >
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
    :title="collection.id ? '编辑' : '新增'"
    v-model="showDialog"
    center
    destroy-on-close
    @close="closeDialog"
  >
    <el-form :model="collection" :rules="rules" label-width="55px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="collection.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="subtitle">
        <el-input v-model="collection.subtitle" clearable></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="description">
        <el-input
          type="textarea"
          :rows="2"
          v-model="collection.description"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
          :action="picUploadApi"
          :headers="headers"
          :data="{ biz: uploadPath }"
          list-type="picture-card"
          :limit="1"
          :on-success="handleCoverUpload"
          :on-remove="handleCoverRemove"
          :file-list="coverList"
        >
          <i v-if="!collection.cover" class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="isValid">
        <el-select
          v-model="collection.isValid"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>

  <!-- 合集内容 -->

  <el-dialog
    :title="`合集${kind == 1 ? '文章' : '课程'}`"
    v-model="showCollItemDialog"
    center
    destroy-on-close
    @close="showCollItemDialog = false"
    width="1200px"
  >
    <CollectionItem :kind="kind" :id="collectionId"></CollectionItem>
  </el-dialog>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Options, Vue } from "vue-class-component";
import { getList, addOne, editOne, deleteBatch } from "@/api/collection";

import CollectionItem from "@/components/CollectionItem.vue";
import store from "@/store";
import { INFO_KIND } from "@/types/const";

@Options({
  name: "Collection",
  props: {
    kind: { type: Number as PropType<INFO_KIND>, required: true },
  },
  components: { CollectionItem },
  data() {
    return {
      query: {
        kind: this.kind,
        pageNo: 1,
        pageSize: 8,
      },
      list: [],
      selectedIds: [],
      total: 0,
      showDialog: false,
      showCollItemDialog: false,
      // 新增或修改的数据
      collection: {
        kind: this.kind,
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        description: [{ max: 255, message: "字数最多255个", trigger: "blur" }],
      },
      // 当前合集id
      collectionId: null,
      picUploadApi: `${process.env.VUE_APP_BASE_API}/sys/common/upload`,
      headers: {
        "x-access-token": store.state.token,
        "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Content-Type",
      },
      uploadPath: "youfang/collection",
    };
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.loadList();
      },
    },
  },
  computed: {
    coverList() {
      return this.collection!.cover ? [{ url: this.collection!.cover }] : [];
    },
  },
  created() {
    this.loadList();
  },
  methods: {
    async loadList() {
      const res = await getList(this.query);

      this.list = res.records;
      this.total = res.total;
    },
    reset() {
      this.query = {
        kind: this.kind,
        pageNo: 1,
        pageSize: 8,
      };
    },
    submit() {
      (this.collection.id ? editOne(this.collection) : addOne(this.collection))
        .then(() => {
          this.$notify.success({ message: "操作成功" });
          this.loadList();
        })
        .catch((err: Error) => this.$notify.error({ message: err }))
        .finally(() => {
          this.closeDialog();
        });
    },
    closeDialog() {
      this.collection = { kind: this.kind };
      this.showDialog = false;
    },
    handleDelete(isBatch: boolean, row: any) {
      if (isBatch && !this.selectedIds.length) return;
      const ids = isBatch ? this.selectedIds : [row.id];
      deleteBatch(ids)
        .then((res: any) => {
          this.$notify({ message: "操作成功" });
          this.loadList();
        })
        .catch((err: Error) => this.$notify.error({ message: err }));
    },
    handleEdit(row: any) {
      this.collection = row;
      this.showDialog = true;
    },
    handleSelectionChange(val: any[]) {
      this.selectedIds = val.map((i: any) => i.id);
    },
    handleCoverUpload(response: any, file: any, fileList: any) {
      this.collection.cover = response.message;
    },
    handleCoverRemove() {
      this.collection.cover = null;
    },
  },
})
export default class Collection extends Vue {}
</script>

<style lang="scss" scoped>
.page {
  bottom: 30px;
  position: absolute;
  right: 50px;
}
</style>
