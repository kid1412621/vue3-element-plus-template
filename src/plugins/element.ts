import makeInstaller from "element-plus/lib/make-installer";

import {
  ElForm,
  ElTree,
  ElSelect,
  ElInput,
  ElTable,
  ElPagination,
  ElSwitch,
  ElUpload,
  ElButton,
  ElMenu,
  ElContainer,
  ElLoading,
  ElDialog,
  ElNotification,
  ElMessageBox,
  ElPopconfirm,
  ElCascader,
  ElTransfer,
  ElTabs,
  ElDatePicker,
} from "element-plus";

const components = [
  ElButton,
  ElSwitch,
  ElUpload,
  ElMenu,
  ElContainer,
  ElForm,
  ElTree,
  ElCascader,
  ElTransfer,
  ElSelect,
  ElInput,
  ElTable,
  ElMenu,
  ElPagination,
  ElTabs,
  ElDialog,
  ElPopconfirm,
  ElDatePicker,
];

const plugins = [ElLoading, ElNotification, ElMessageBox];

export default makeInstaller([...components, ...plugins]);
