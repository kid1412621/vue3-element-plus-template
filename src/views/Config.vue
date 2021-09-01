<template>
  <el-tabs v-model="configType" @tab-click="handleClick">
    <el-tab-pane
      :label="tab.name"
      :name="tab.value"
      v-for="tab in tabs"
      :key="tab.id"
    >
      <!-- 操作按钮 -->
      <div class="btns">
        <el-button @click="handleEdit">编辑</el-button>
      </div>

      <!-- 浏览 -->
      <div class="preview">
        <img :src="detail.cover?.title" alt="cover" class="cover" />
        <div class="words">
          <span class="name">{{ detail.name?.title }}</span>
          <img :src="detail.avatar?.title" alt="avatar" class="avatar" />
        </div>
        <div class="desc">{{ detail.desc?.title }}</div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- 新增/编辑 -->
  <el-dialog
    title="编辑"
    v-model="showDialog"
    center
    destroy-on-close
    @close="closeDialog"
  >
    <el-form :model="detail" label-width="55px" ref="form">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="detail.name.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="简述" prop="desc">
        <el-input v-model="detail.desc.title" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          :action="picUploadApi"
          :headers="headers"
          :data="{ biz: uploadPath }"
          list-type="picture-card"
          :limit="1"
          :on-success="handleAvatarUpload"
          :on-remove="handleAvatarRemove"
          :on-preview="handlePictureCardPreview"
          :file-list="avatarList"
        >
          <i v-if="!detail.avatar.title" class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景图" prop="cover">
        <el-upload
          :action="picUploadApi"
          :headers="headers"
          :data="{ biz: uploadPath }"
          list-type="picture-card"
          :limit="1"
          :on-success="handleCoverUpload"
          :on-remove="handleCoverRemove"
          :on-preview="handlePictureCardPreview"
          :file-list="coverList"
        >
          <i v-if="!detail.cover.title" class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-dialog v-model="showPreviewDialog">
        <img style="width: 300px" :src="previewImageUrl" alt="" />
      </el-dialog>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { getAllByCode, batchEdit } from "@/api/category";
import store from "@/store";

@Options({
  name: "Config",
  components: {},
  data() {
    return {
      configType: "COURSE_CONFIG",
      detail: {},
      showDialog: false,
      showPreviewDialog: false,
      previewImageUrl: null,
      picUploadApi: `${process.env.VUE_APP_BASE_API}/sys/common/upload`,
      headers: {
        "x-access-token": store.state.token,
        "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Content-Type",
      },
      uploadPath: "youfang/config",
      tabs: [
        { id: 10, name: "地产快评", value: "NEWS_CONFIG" },
        { id: 20, name: "课程", value: "COURSE_CONFIG" },
      ],
    };
  },
  watch: {
    configType() {
      this.loadDetail();
    },
  },
  computed: {
    avatarList() {
      return this.detail.avatar?.title
        ? [{ url: this.detail.avatar.title }]
        : [];
    },
    coverList() {
      return this.detail.cover?.title ? [{ url: this.detail.cover.title }] : [];
    },
  },
  created() {
    this.loadDetail();
  },
  methods: {
    loadDetail() {
      getAllByCode({ pcode: this.configType }).then((res: any) => {
        this.detail.name = res.find(
          (i: any) => i.code === `${this.configType}.NAME`
        );
        this.detail.desc = res.find(
          (i: any) => i.code === `${this.configType}.DESC`
        );
        this.detail.avatar = res.find(
          (i: any) => i.code === `${this.configType}.AVATAR`
        );
        this.detail.cover = res.find(
          (i: any) => i.code === `${this.configType}.COVER`
        );
      });
    },

    submit() {
      if (!this.detail.avatar) {
        this.$notify.warning({ message: "请上传头像" });
        return;
      }
      if (!this.detail.cover) {
        this.$notify.warning({ message: "请上传背景图" });
        return;
      }
      const detail = Object.values(this.detail).map((i: any) => ({
        id: i.key,
        name: i.title,
      }));

      batchEdit(detail)
        .then(() => {
          this.$notify({ message: "操作成功" });
        })
        .catch((err: Error) => this.$notify.error({ message: err }))
        .finally(() => {
          this.closeDialog();
        });
    },
    closeDialog() {
      this.loadDetail();
      this.showDialog = false;
    },
    handleEdit() {
      this.showDialog = true;
    },

    handlePictureCardPreview(file: any) {
      this.previewImageUrl = file.url;
      this.showPreviewDialog = true;
    },
    handleAvatarUpload(val: any) {
      this.detail.avatar.title = val.message;
    },
    handleAvatarRemove(file: any) {
      this.detail.avatar.title = null;
    },
    handleCoverUpload(val: any) {
      this.detail.cover.title = val.message;
    },
    handleCoverRemove(file: any) {
      this.detail.cover.title = null;
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
.preview {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin-left: 10%;
  min-height: 500px;
  width: 80%;
  .words {
    align-self: flex-end;
    margin-right: 70px;
    margin-top: -70px;
    position: relative;
    .name {
      color: #fff;
      font-size: 1.25rem;
      left: -100px;
      margin-top: -30px;
      position: absolute;
      top: 60px;
      width: 100px;
    }

    .avatar {
      width: 120px;
    }
  }
  .cover {
    width: 100%;
  }
  .desc {
    color: #999;
    margin-top: 20px;
  }
}
</style>
