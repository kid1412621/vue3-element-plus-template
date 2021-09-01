<template>
  <el-container>
    <el-header class="header">
      <span class="logo">
        <img src="@/assets/images/logo.png" alt="" />
        有房后台管理系统
      </span>
      <el-button
        @click="handleLogout"
        icon="el-icon-switch-button"
        size="mini"
        circle
      ></el-button>
    </el-header>

    <el-container class="main">
      <Menu class="navs"></Menu>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logout } from "@/api/user";
import { mapMutations } from "vuex";
import Menu from "@/components/Menu.vue";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "Layout",
  components: { Menu },
  methods: {
    ...mapMutations(["updateToken"]),
    async handleLogout() {
      try {
        await logout();
        (ElNotification as any).success("登出成功");
      } catch (error) {
        (ElNotification as any).error("登出失败");
      } finally {
        this.updateToken("");
        this.$router.push({ name: "Login" });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  background: #409eff;
  display: flex;
  height: 8vh;
  justify-content: space-between;
  width: 100%;
  .logo {
    align-items: center;
    color: #fff;
    display: inline-flex;
    font-size: 25px;
    font-weight: bold;
    &:hover {
      text-shadow: #f2f2f2 1px 0 10px;
    }
    img {
      height: 30px;
      margin-right: 15px;
    }
  }
  button {
    padding: 10px !important;
  }
}
.main {
  height: 92vh;
}
.navs {
  height: 100%;
  max-width: 200px !important;
  min-width: 66px;
}
</style>
