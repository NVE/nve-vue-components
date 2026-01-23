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
      component: () => import("../views/NveTableDemo/NveTableDemo.vue"),
    },
    {
      path: "/nve-table-async",
      name: "nve-table-async",
      component: () => import("../views/NveTableDemo/NveAsyncTableDemo.vue"),
    },
    {
      path: "/nve-table-custom-components",
      name: "nve-table-custom-components",
      component: () => import("../views/NveTableDemo/NveTableDemoWithCustomComponents.vue"),
    },
    {
      path: "/nve-table-sticky",
      name: "nve-table-sticky",
      component: () => import("../views/NveTableDemo/NveTableDemoStickyFirstColumn.vue"),
    },
    {
      path: "/nve-table-sub-rows",
      name: "nve-table-sub-rows",
      component: () => import("../views/NveTableDemo/NveTableSubRows.vue"),
    },
    {
      path: "/nve-table-events",
      name: "nve-table-events",
      component: () => import("../views/NveTableDemo/NveTableEvents.vue"),
    },
        {
      path: "/nve-month-selector",
      name: "nve-month-selector",
      component: () => import("../views/NveMonthSelectorDemo/NveMonthSelectorDemo.vue")
    },
  ],
});

export default router;
