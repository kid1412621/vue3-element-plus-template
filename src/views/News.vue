<template>
  <!-- 筛选 -->
  <el-form :inline="true" :model="query">
    <el-form-item label="内容">
      <el-input v-model="query.words" clearable></el-input>
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
    <el-table-column prop="words" label="内容" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
    <el-table-column label="操作" fixed="right" width="270">
      <template #default="scope">
        <el-switch
          v-model="scope.row.rowStatus"
          active-text="启用"
          inactive-text="禁用"
          @change="toggleStatus(scope.row)"
          style="margin-right: 10px"
        ></el-switch>
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
    :title="news.id ? '编辑' : '新增'"
    v-model="showDialog"
    center
    destroy-on-close
    @close="closeDialog"
  >
    <el-form :model="news" :rules="rules" label-width="55px">
      <el-form-item label="内容" prop="words">
        <el-input v-model="news.words" clearable type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pics">
        <el-upload
          :action="picUploadApi"
          :headers="headers"
          :data="{ biz: uploadPath }"
          list-type="picture-card"
          :limit="9"
          :on-success="handleImageUpload"
          :on-remove="handleImageRemove"
          :on-preview="handlePictureCardPreview"
          :file-list="pics"
        >
          <i v-if="pics.length < 10" class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="showPreviewDialog">
          <img style="width: 300px" :src="previewImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="状态" prop="rowStatus">
        <el-select v-model="news.rowStatus" placeholder="请选择状态" clearable>
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { getList, add, edit, deleteBatch } from "@/api/news";
import store from "@/store";

@Options({
  name: "news",
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 8,
      },
      list: [],
      selectedIds: [],
      total: 0,
      news: {},
      rules: {
        words: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      showDialog: false,
      showPreviewDialog: false,
      previewImageUrl: null,
      pics: [],
      picUploadApi: `${process.env.VUE_APP_BASE_API}/sys/common/upload`,
      headers: {
        "x-access-token": store.state.token,
        "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Content-Type",
      },
      uploadPath: "youfang/news",
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
        pageNo: 1,
        pageSize: 8,
      };
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
    handleSelectionChange(val: any[]) {
      this.selectedIds = val.map((i: any) => i.id);
    },
    submit() {
      this.news.pics = JSON.stringify(this.pics);
      (this.news.id ? edit(this.news) : add(this.news))
        .then(() => {
          this.$notify({ message: "操作成功" });
          this.loadList();
        })
        .catch((err: Error) => this.$notify.error({ message: err }))
        .finally(() => {
          this.closeDialog();
        });
    },
    closeDialog() {
      this.news = {};
      this.showDialog = false;
      this.pics = [];
    },
    handleEdit(row: any) {
      this.news = row;
      this.showDialog = true;
      this.pics = JSON.parse(row.pics);
    },
    toggleStatus(data: any) {
      edit(data)
        .then(() => this.$notify({ message: "操作成功" }))
        .catch((err: Error) => this.$notify.error({ message: err }));
    },
    handlePictureCardPreview(file: any) {
      this.previewImageUrl = file.url;
      this.showPreviewDialog = true;
    },
    handleImageUpload(val: any) {
      console.log(val);
      this.pics.push({ url: val.message });
    },
    handleImageRemove(file: any) {
      this.pics = this.pics.filter((i: any) => i.url !== file.url);
    },
  },
})
export default class News extends Vue {}
</script>

<style lang="scss" scoped>
.page {
  bottom: 30px;
  position: absolute;
  right: 50px;
}
</style>
