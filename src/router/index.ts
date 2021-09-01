import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    component: () => import("@/components/Layout.vue"),
    meta: { requireAuth: true },
    redirect: "news",
    children: [
      {
        path: "news",
        name: "News",
        component: () => import("@/views/News.vue"),
      },
      {
        path: "report",
        name: "Report",
        component: () => import("@/views/Report.vue"),
      },
      {
        path: "article",
        name: "Article",
        component: () => import("@/views/Article.vue"),
      },
      {
        path: "course",
        name: "Course",
        component: () => import("@/views/Course.vue"),
      },
      {
        path: "course-collection",
        name: "CourseCollection",
        component: () => import("@/views/CourseCollection.vue"),
      },
      {
        path: "article-collection",
        name: "ArticleCollection",
        component: () => import("@/views/ArticleCollection.vue"),
      },
      {
        path: "ranking",
        name: "Ranking",
        component: () => import("@/views/Ranking.vue"),
      },
      {
        path: "pic",
        name: "Pic",
        component: () => import("@/views/Pic.vue"),
      },
      {
        path: "config",
        name: "Config",
        component: () => import("@/views/Config.vue"),
      },
      {
        path: "feedback",
        name: "Feedback",
        component: () => import("@/views/Feedback.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { requireAuth: false },
    component: Login,
  },

  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404.vue"),
    meta: { requireAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !store.getters.isAuth) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
