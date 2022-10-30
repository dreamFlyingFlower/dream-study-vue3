import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../src/store/index";
import router from "./router/index";
import { filterAsyncRouter } from "./router/index";
import { getToken, checkToken } from './utils/auth';
import { ElMessage } from "element-plus";

let whiteList = ['/login', '/auth-redirect']; // 没有重定向白名单
let getRouter: any = null;
let flag = 0;

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  await store.dispatch("setAuthority");
  next();
  // if (token) {
  //   if (to.path === "/login") {
  //     next({ path: "/" });
  //     NProgress.done();
  //   } else {
  //     // console.log(store.state.authorized)
  //     if (!store.state.authorized) {
  //       await store.dispatch("setAuthority");
  //       next({ ...to, replace: true });
  //     } else {
  //       next();
  //     }
  //   }
  // } else {
  //   if (to.path !== "/login") {
  //     next({ path: "/login" });
  //   } else {
  //     next(true);
  //   }
  // }

  NProgress.start();
  // document.title = getPageTitle(to.meta.title);
  // 确定用户是否已登录
  const hasToken = getToken();
  if (hasToken) {
    // let isOutOfTime = checkToken();
    // if (!isOutOfTime) {
    //   next(`/login?redirect=${to.path}`)
    // }
    if (to.path === '/login') {
      // 如果已登录,请重定向到主页
      next({ path: '/login' })
      NProgress.done();
    } else {
      try {
        // getRouter = router;
        // 获取用户信息
        const menus = await store.dispatch('getMenu');
        // 过滤菜单
        // getRouter = filterAsyncRouter(menus);
        // 基于用户获取可访问的路由映射
        // const accessRoutes = await store.dispatch(
        //   'permission/generateRoutes',
        //   getRouter
        // )
        // //真实路由
        // let realRoutes = realRoute(accessRoutes);
        // // 动态添加可访问的路由
        // router.addRoutes(
        //   realRoutes.concat([
        //     {
        //       path: '*',
        //       redirect: '/404',
        //     },
        //   ])
        // )
        // 确保addroutes完整的hack方法,设置replace:true，这样导航就不会留下历史记录,解决刷新后出现空白
        console.log(router.getRoutes());
        console.log(router.options);

        // if(flag === 0 && to.matched.length === 0){
        //   flag++;
        //   router.push({ path: to.path, replace: true });
        // }
        // next({ ...to, replace: true });
        // await router.replace(router.currentRoute.value.fullPath);
        // router.push(to.path);
        if (hasRoute(to)) {
          const ret = generateRoute(to, menus);
          if (ret.flag) {
            router.addRoute(ret.route);
            router.push(to.path);
            return;
          } else {
            router.push("404");
            return;
          }
        }
        // next(to.fullPath);
      } catch (error: any) {
        // 删除token并转到登录页重新登录
        await store.dispatch('resetToken');
        ElMessage.error(error.toString());
        // next(`/login?redirect=${to.path}`);
        router.push(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // next(`/login?redirect=${to.path}`);
      router.push(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

const hasRoute = (to: any): boolean => {
  let flag = true;
  let getRoutes = router.getRoutes();
  getRoutes.map((item: any) => {
    if (item.path.indexOf("/:") !== -1) {
      if (to.path.indexOf(item.path.substr(0, item.path.indexOf("/:"))) !== -1 && item.name !== "404") {
        flag = false;
      }
    } else {
      if (item.path === to.path) {
        flag = false;
      }
    }
  });
  return flag;
}

const generateRoute = (to: any, list: any) => {
  let index: number = 0;
  let flag: boolean = false;
  let toArr: string = to.path;
  list.map((item: any, i: number) => {
    if (item.path === toArr) {
      item.children.map((v: any) => {
        if (v.path.indexOf("/:") !== -1) {
          if (to.path.indexOf(`${v.path.substr(0, v.path.indexOf("/:"))}`) !== -1
            && v.name !== "404") {
            index = i;
            flag = true;
            return;
          }
        } else {
          if (to.fullPath === `${v.path}`) {
            index = i;
            flag = true;
            return;
          }
        }
      })
    }
  });
  return { route: list[index], flag };
}

router.afterEach(() => {
  NProgress.done();
});
