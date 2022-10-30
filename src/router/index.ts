import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Layout from "../layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("../views/login/index.vue"),
    meta: {
      hidden: true,
      label: "登录"
    }
  },
  // {
  //   path: "/device/deviceArchive",
  //   component: Layout,
  //   redirect: "/device/deviceArchive",
  //   name: "设备管理",
  //   children: [
  //     {
  //       path: "/device/deviceArchive",
  //       component: () => import("../views/device/deviceArchive/index.vue"),
  //       name: "设备台账"
  //     },
  //     {
  //       path: "/device/deviceType",
  //       component: () => import("../views/basic/deviceType/index.vue"),
  //       name: "设备类型"
  //     },
  //   ]
  // },
  // {
  //   path: "/basic",
  //   component: Layout,
  //   redirect: "supplier",
  //   meta: { label: "基础配置" },
  //   children: [
  //     {
  //       path: "/supplier",
  //       component: () => import("../views/basic/supplier/index.vue"),
  //       name: "supplier",
  //       meta: { label: "往来单位" },
  //     },
  //     {
  //       path: "/faultType",
  //       component: () => import("../views/basic/faultType/index.vue"),
  //       name: "faultType",
  //       meta: { label: "故障类型" },
  //     },
  //     {
  //       path: "/warehouse",
  //       component: () => import("../views/basic/warehouse/index.vue"),
  //       name: "warehouse",
  //       meta: { label: "仓库定义" },
  //     },
  //     {
  //       path: "/spareType",
  //       component: () => import("../views/basic/spareType/index.vue"),
  //       name: "spareType",
  //       meta: { label: "备件类型" },
  //     },
  //     {
  //       path: "/dict",
  //       component: () => import("../views/basic/dict/index.vue"),
  //       name: "dict",
  //       meta: { label: "字典定义" },
  //     }
  //   ],
  // },
  // {
  //   path: "/device",
  //   component: Layout,
  //   redirect: "deviceArchive",
  //   meta: { label: "设备管理" },
  //   children: [
  //     {
  //       path: "/deviceType",
  //       component: () => import("../views/basic/deviceType/index.vue"),
  //       name: "deviceType",
  //       meta: { label: "设备类型" },
  //     },
  //     {
  //       path: "/deviceArchive",
  //       component: () => import("../views/device/deviceArchive/index.vue"),
  //       name: "deviceArchive",
  //       meta: { label: "设备台账" },
  //     }
  //   ],
  // },
  {
    path: "/:pathMatch(.*)*",
    component: import("../views/404.vue"),
    name: "404",
    meta: {
      hidden: true,
      label: "404"
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});

export function filterAsyncRouter(menus: any) {
  console.log(menus);
  console.log(router);

  menus.forEach((item: any) => {
    router.addRoute({
      path: item.path,
      redirect: item.redirect,
      component: item.component,
      children: item.children,
      meta: item.meta || {},
      name: item.name
    })
  });
  console.log(router);

}

export default router;
