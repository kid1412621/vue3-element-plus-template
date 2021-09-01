<template>
  <el-tabs v-model="query.location" @tab-click="handleClick">
    <el-tab-pane
      :label="tab.name"
      :name="tab.id"
      v-for="tab in tabs"
      :key="tab.id"
    >
      <!-- 操作按钮 -->
      <div class="btns">
        <el-button
          v-if="tab.id !== 1 && tab.id !== 7"
          @click="openQrDialog"
          plain
          >二维码</el-button
        >
        <el-button @click="showDialog = true" type="primary">新增</el-button>
        <el-button
          type="danger"
          @click="handleDelete(true)"
          :disabled="!selectedIds.length"
          >删除</el-button
        >
      </div>

      <!-- 表格 -->
      <el-table
        ref="table"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="sequence" label="排序"> </el-table-column>
        <el-table-column label="图片">
          <template #default="scope">
            <img :src="scope.row.url" class="list-img" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="link" label="链接"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column
          v-if="query.location === 7"
          prop="publishTime"
          label="发布时间"
        >
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="270">
          <template #default="scope">
            <el-switch
              v-model="scope.row.rowStatus"
              active-text="启用"
              inactive-text="禁用"
              @change="toggleStatus(scope.row)"
              style="margin-right: 10px"
            ></el-switch>
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(false, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

  <!-- 新增/编辑 -->
  <el-dialog
    :title="dialogTitle"
    v-model="showDialog"
    center
    destroy-on-close
    @close="closeDialog"
  >
    <el-form :model="pic" :rules="rules" label-width="70px" ref="form">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="pic.remark" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sequence" v-if="!isQr">
        <el-input v-model="pic.sequence" type="number" clearable></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link" v-if="!isQr">
        <el-input v-model="pic.link" clearable type="url"></el-input>
        <div style="color: #999">以 http:// 或 https:// 格式开头</div>
      </el-form-item>
      <el-form-item
        v-if="query.location === 7"
        label="发布时间"
        prop="publishTime"
      >
        <el-date-picker
          v-model="pic.publishTime"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="图片" prop="url">
        <el-upload
          :action="picUploadApi"
          :headers="headers"
          :data="{ biz: uploadPath }"
          list-type="picture-card"
          :limit="1"
          :on-success="handleImageUpload"
          :on-remove="handleImageRemove"
          :on-preview="handlePictureCardPreview"
          :file-list="picList"
        >
          <i v-if="!pic.url" class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="showPreviewDialog">
          <img style="width: 300px" :src="previewImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="状态" prop="rowStatus" v-if="!isQr">
        <el-select v-model="pic.rowStatus" placeholder="请选择状态" clearable>
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
import { add, deleteBatch, edit, getAllList } from "@/api/pic";
import store from "@/store";
import { ref } from "@vue/reactivity";

@Options({
  name: "Pic",
  setup() {
    const list = ref([]);
    return {};
  },
  data() {
    return {
      query: {
        location: 1,
        isQr: false,
      },
      list: [],
      selectedIds: [],
      pic: {},
      rules: {
        url: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
      showDialog: false,
      showPreviewDialog: false,
      previewImageUrl: null,
      picUploadApi: `${process.env.VUE_APP_BASE_API}/sys/common/upload`,
      headers: {
        "x-access-token": store.state.token,
        "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Content-Type",
      },
      uploadPath: "youfang/pics",
      tabs: [
        { id: 1, name: "首页轮播", value: "BANNER" },
        { id: 2, name: "资配服务", value: "RESOURCE" },
        { id: 3, name: "付费社群", value: "COMMUNITY" },
        { id: 4, name: "关于我们", value: "ABOUT" },
        { id: 5, name: "商务合作", value: "BUSSINESS" },
        { id: 6, name: "联系我们", value: "CONTACT" },
        { id: 7, name: "有房日历", value: "CALENDAR" },
      ],
      isQr: false,
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
    picList() {
      return this.pic!.url ? [{ url: this.pic!.url }] : [];
    },
    dialogTitle() {
      if (this.isQr) return "二维码";
      return this.pic.id ? "编辑" : "新增";
    },
  },
  created() {
    this.loadList();
  },
  methods: {
    async loadList() {
      this.list = await getAllList(this.query);
    },
    handleDelete(isBatch: boolean, row: any) {
      if (isBatch && !this.selectedIds.length) return;
      const ids = isBatch ? this.selectedIds : [row.id];
      deleteBatch(ids)
        .then(() => {
          this.$notify({ message: "操作成功" });
          this.loadList();
        })
        .catch((err: Error) => this.$notify.error({ message: err }));
    },
    handleSelectionChange(val: any[]) {
      this.selectedIds = val.map((i: any) => i.id);
    },
    submit() {
      if (!this.pic.url) {
        this.$notify.warning({ message: "请上传图片" });
        return;
      }
      if (this.pic.link && !/^https?:\/\//.test(this.pic.link)) {
        this.$notify.warning({ message: "链接格式不正确·" });
        return;
      }
      this.pic.location = this.query.location;
      this.pic.isQr = this.isQr;
      (this.pic.id ? edit(this.pic) : add(this.pic))
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
      this.pic = {};
      this.showDialog = false;
      this.isQr = false;
    },
    handleEdit(row: any) {
      this.pic = row;
      this.showDialog = true;
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
      this.pic.url = val.message;
    },
    handleImageRemove(file: any) {
      this.pic.url = null;
    },
    openQrDialog() {
      this.isQr = true;

      getAllList({ ...this.query, isQr: true }).then((res: any) => {
        this.pic = res.length ? res[0] : { url: null, remark: null };
        this.showDialog = true;
      });
    },
  },
})
export default class News extends Vue {}
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}
.list-img {
  width: 50px;
}
</style>
