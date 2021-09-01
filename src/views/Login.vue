<template>
  <div class="wrapper">
    <img src="@/assets/images/logo-cn.png" class="logo" alt="" />
    <el-form class="form">
      <el-form-item>
        <el-input
          type="text"
          required
          placeholder="帐号"
          suffix-icon="el-icon-user"
          v-model="form.username"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          type="password"
          required
          autocomplete="false"
          placeholder="密码"
          suffix-icon="el-icon-lock"
          v-model="form.password"
        >
        </el-input>
      </el-form-item>

      <el-form-item class="captcha">
        <el-input
          class="captcha-word"
          type="text"
          maxlength="4"
          required
          autocomplete="false"
          placeholder="验证码"
          v-model="form.captcha"
          suffix-icon="el-icon-picture-outline"
          @keydown.enter="submit"
        >
        </el-input>
        <img :src="captchaImage" @click="handleChangeCaptch" />
      </el-form-item>

      <el-button type="primary" @click="submit">登 录</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { login, getCaptcha } from "@/api/user";
import { mapMutations } from "vuex";

@Options({
  name: "Login",
  data() {
    return {
      form: {},
      captchaImage: null,
      timestamp: null,
    };
  },
  created() {
    this.timestamp = new Date().getTime();
    this.handleChangeCaptch(this.timestamp);
  },
  methods: {
    ...mapMutations(["updateToken"]),
    submit() {
      this.form.checkKey = this.timestamp;
      login(this.form)
        .then((res: any) => {
          this.updateToken(res.token);
          this.$router.push("/");
        })
        .catch((err: Error) => this.$notify.error(err || "登录失败"));
    },
    async handleChangeCaptch() {
      this.timestamp = new Date().getTime();
      this.captchaImage = await getCaptcha(this.timestamp);
    },
  },
})
export default class Login extends Vue {}
</script>

<style scoped lang="scss">
.wrapper {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  height: 80vh;
  justify-content: space-around;
  .logo {
    width: 120px;
  }
  .form {
    width: 50%;
    /* stylelint-disable */
    :deep(.el-form-item__content) {
      /* stylelint-enable */
      align-content: center;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
    .captcha-word {
      width: 70%;
    }
    button {
      width: 100%;
    }
  }
}
</style>
