<template>
  <el-form :model="infoValue" :rules="rules" label-width="55px" ref="form">
    <el-form-item label="标题" prop="title">
      <el-input v-model="infoValue.title" clearable></el-input>
    </el-form-item>
    <el-form-item label="来源" prop="origin">
      <el-input v-model="infoValue.origin" clearable></el-input>
    </el-form-item>
    <el-form-item label="类别" prop="type" v-if="this.kind != InfoKind.RANKING">
      <el-cascader
        :props="catProps"
        v-model="cat"
        :options="categories"
        clearable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="资源" prop="url">
      <el-input
        v-model="infoValue.url"
        clearable
        type="url"
        v-if="kind === InfoKind.ARTICLE"
      ></el-input>
      <el-upload
        v-else
        :action="picUploadApi"
        :headers="headers"
        :data="{ biz: uploadPath }"
        :limit="1"
        :on-success="handleUrlResUpload"
        :on-remove="handleUrlResUpload"
        :file-list="urlResourceList"
        :accept="resAcceptType"
      >
        <i v-if="!info.url" class="el-icon-plus"></i>
      </el-upload>
      <div style="color: #999">{{ resTip }}</div>
      <video
        class="res"
        controls
        :src="infoValue.url"
        v-if="kind === InfoKind.COURSE && infoValue.url"
      ></video>
      <img
        class="res"
        v-else-if="kind === InfoKind.RANKING && infoValue.url"
        :src="infoValue.url"
        alt=""
      />
    </el-form-item>
    <el-form-item label="封面" prop="cover" v-if="kind !== InfoKind.REPORT">
      <el-upload
        :action="picUploadApi"
        :headers="headers"
        :data="{ biz: uploadPath }"
        list-type="picture-card"
        :limit="1"
        :on-success="handleCoverUpload"
        :on-remove="handleCoverRemove"
        :file-list="coverList"
        accept="image/*"
      >
        <i v-if="!info.cover" class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="置顶" prop="isValid">
      <el-switch v-model="infoValue.isTop"></el-switch>
    </el-form-item>
    <el-form-item label="状态" prop="isValid">
      <el-select v-model="infoValue.isValid" placeholder="请选择状态" clearable>
        <el-option label="显示" :value="true"></el-option>
        <el-option label="隐藏" :value="false"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Info } from "@/types";
import { getAllByCode } from "@/api/category";
import { INFO_KIND } from "@/types/const";
import store from "@/store";

export default defineComponent({
  name: "InfoDetail",
  props: {
    info: { type: Object as PropType<Info>, reuqired: true },
  },
  emits: ["update:info"],
  data() {
    return {
      InfoKind: INFO_KIND,
      // 选择的分类，暂时没有更好的办法
      cat: [this.info!.type, this.info!.subtype].filter(
        (i) => i != null
      ) as any[],
      catProps: {
        label: "title",
        isLeaf: "leaf",
        value: "key",
        checkStrictly: true,
      },
      categories: [],
      rules: {
        url: [
          {
            required: true,
            validator: (rule: any, value: string) => /^https?:\/\//.test(value),
            message: "资源链接未提供或格式不正确",
            trigger: "blur",
          },
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        type: [
          {
            required: this.info!.kind != INFO_KIND.RANKING,
            message: "请选择类别",
            trigger: "blur",
          },
        ],
        cover: [
          {
            required: this.info!.kind != INFO_KIND.REPORT,
            message: "请上传封面",
            trigger: "blur",
          },
        ],
      },
      picUploadApi: `${process.env.VUE_APP_BASE_API}/sys/common/upload`,
      headers: {
        "x-access-token": store.state.token,
        "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
        "Access-Control-Allow-Headers": "x-access-token, Content-Type",
      },
      uploadPath: "youfang/info",
    };
  },
  watch: {
    cat(val) {
      this.infoValue!.type = val && val[0];
      this.infoValue!.subtype = val && val[1];
    },
  },
  computed: {
    infoValue: {
      get() {
        return this.info;
      },
      set(value: Info) {
        this.$emit("update:info", value);
      },
    },
    kind(): number {
      return this.info!.kind;
    },
    coverList() {
      return this.info!.cover ? [{ url: this.info!.cover }] : [];
    },
    urlResourceList() {
      return this.info!.url ? [{ url: this.info!.url }] : [];
    },
    resAcceptType() {
      if (this.kind === INFO_KIND.COURSE) return "video/*";
      else if (this.kind === INFO_KIND.RANKING) return "image/*";
      else if (this.kind === INFO_KIND.REPORT) return ".pdf";
      return "";
    },
    resTip() {
      if (this.kind === INFO_KIND.COURSE) return "课程视频";
      else if (this.kind === INFO_KIND.RANKING) return "榜单详情图";
      else if (this.kind === INFO_KIND.REPORT) return "报告，仅能上传 pdf 文件";
      return "文章链接，以 http:// 或 https:// 格式开头";
    },
  },
  created() {
    getAllByCode({ pcode: INFO_KIND[this.kind] }).then((res: any) => {
      this.categories = res;
    });
  },
  methods: {
    handleCoverUpload(response: any, file: any, fileList: any) {
      this.infoValue!.cover = response.message;
    },
    handleCoverRemove() {
      this.infoValue!.cover = null;
    },
    handleUrlResUpload(response: any, file: any, fileList: any) {
      if (this.kind === INFO_KIND.COURSE) {
        var audio = new Audio(response.message);
        audio.addEventListener("loadedmetadata", () => {
          let duration = ~~audio.duration;
          this.infoValue!.duration = duration;
        });
      }
      this.infoValue!.url = response.message;
    },
    handleUrlResRemove() {
      this.infoValue!.url = null;
    },
  },
});
</script>

<style scoped lang="scss">
.res {
  object-fit: cover;
  width: 100%;
}
</style>
