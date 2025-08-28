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
    {
      path: "/nve-table-custom-components",
      name: "nve-table-custom-components",
      component: () => import("../views/NveTableDemoWithCustomComponents.vue"),
    },
    {
      path: "/nve-table-sticky",
      name: "nve-table-sticky",
      component: () => import("../views/NveTableDemoStickyFirstColumn.vue"),
    },
  ],
});

export default router;
