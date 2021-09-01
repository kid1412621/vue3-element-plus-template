import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import router from "./router";
import ElementPlus from "./plugins/element";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import "element-plus/dist/index.css";

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");
