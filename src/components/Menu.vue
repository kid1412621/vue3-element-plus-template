<template>
  <el-menu default-active="1" class="menu-wrapper" :collapse="!isExpanse">
    <el-switch v-model="isExpanse" class="toggle"></el-switch>
    <template v-for="menu in menus" :key="menu.id">
      <el-sub-menu :index="menu.id" v-if="menu.sub">
        <template #title>
          <i :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
        </template>

        <el-menu-item
          :index="submenu.id"
          v-for="submenu in menu.sub"
          :key="submenu.id"
          @click="$router.push(submenu.path)"
        >
          <template #title>{{ submenu.name }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item
        v-else
        :index="menu.id"
        :key="menu.id"
        @click="$router.push(menu.path)"
      >
        <i :class="menu.icon"></i>
        <template #title>
          <span>{{ menu.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Menu",
  setup() {
    const isExpanse = ref(true);
    return {
      isExpanse,
    };
  },
  data() {
    return {
      menus: [
        {
          id: 1,
          name: "地产快评",
          path: "/news",
          icon: "el-icon-discover",
        },
        {
          id: 2,
          name: "文章",
          icon: "el-icon-tickets",
          sub: [
            {
              id: 21,
              name: "列表",
              path: "/article",
              icon: "el-icon-collection",
            },
            {
              id: 22,
              name: "合集",
              path: "/article-collection",
              icon: "el-icon-files",
            },
          ],
        },

        {
          id: 3,
          name: "课程",
          icon: "el-icon-video-play",
          sub: [
            {
              id: 31,
              name: "列表",
              path: "/course",
              icon: "el-icon-collection",
            },
            {
              id: 32,
              name: "合集",
              path: "/course-collection",
              icon: "el-icon-files",
            },
          ],
        },
        {
          id: 4,
          name: "行业报告",
          path: "/report",
          icon: "el-icon-document",
        },
        {
          id: 5,
          name: "榜单",
          path: "/ranking",
          icon: "el-icon-data-line",
        },
        {
          id: 6,
          name: "设置",
          path: "/settings",
          icon: "el-icon-setting",
          sub: [
            { id: 61, name: "图片管理", path: "pic", icon: "" },
            { id: 62, name: "模块信息", path: "config", icon: "" },
            { id: 63, name: "用户反馈", path: "feedback", icon: "" },
          ],
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-wrapper {
  height: 100%;
  overflow: hidden;
  padding-top: 40px;
}
.menu-wrapper:not(.el-menu--collapse) {
  width: 100%;
}

.toggle {
  left: 20px;
  position: absolute;
  top: 15px;
  width: 30px;
}

/* stylelint-disable */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  /* stylelint-enable */
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
}
</style>
