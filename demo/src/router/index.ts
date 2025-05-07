import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/MainPage.vue"),
    },
    {
      path: "/nve-table",
      name: "nve-table",
      component: () => import("../views/NveTableDemo.vue"),
    },
    {
      path: "/nve-table-async",
      name: "nve-table-async",
      component: () => import("../views/NveAsyncTableDemo.vue"),
    },
  ],
});

export default router;
