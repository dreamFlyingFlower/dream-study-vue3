import { createStore } from "vuex";
import router from "../router/index";
import Layout from "../layout/index.vue";
import apiLogin from '../api/login';
import apiUser from '../api/user';
import * as auth from '../utils/auth';
import { useRouter } from 'vue-router';
import { reactifyObject } from "@vueuse/shared";

const $router = useRouter();

export interface GlobalData {
  authorized: boolean;
  isCollapse: boolean;
  // ActiveRoute: object;
  menuList: any;
  tabsList: any[];
  tabsIndex: number;
  tenantCode: any,
  tokenTime: any,
  token: any,
  name: any,
  passWord: any,
  menu: any,
  avatar: '',
  superRoles: false,
  roles: [],
  domainId: any,
  domainName: any,
  theme: any
}

const store = createStore<GlobalData>({
  state: {
    authorized: false,
    isCollapse: false,
    tabsList: [],
    tabsIndex: -1,
    tokenTime: auth.getTokenTime(),
    token: auth.getToken(),
    name: auth.getName(),
    passWord: auth.getPassWord(),
    avatar: '',
    domainId: auth.getDomainId(),
    domainName: auth.getDomainName(),
    theme: auth.getTheme(),
    tenantCode: '',
    superRoles: false,
    roles: [],
  },
  getters: {
    // addTabs(state,tabsItem) {
    //   console.log(state)
    //   console.log(tabsItem)
    //   // return state.tabsList.push(tabsItem);
    // },
  },
  mutations: {
    setAuthority(state) {
      state.authorized = true;
    },
    clearAuthority(state) {
      state.authorized = false;
      state.menuList = [];
    },
    setTabIndex(state, tabsIndex) {
      state.tabsIndex = tabsIndex;
    },
    setActiveRoute(state, ActiveRoute) {
      // let ActiveIndex = state.tabsList.findIndex((e) => {
      //   return e.id == ActiveRoute.id;
      // });
      // if (ActiveIndex >= 0) {
      //   state.tabsIndex = ActiveIndex;
      // } else {
      //   state.tabsList.push(ActiveRoute);
      //   state.tabsIndex = state.tabsList.length - 1;
      // }
    },
    delTabs(state, ActiveIndex) {
      state.tabsList.splice(ActiveIndex, 1);
      if (state.tabsList.length == 0) {
        state.tabsList.push({
          id: 1,
          label: "主工作台",
          path: "home",
        });
      }
      if (state.tabsIndex > ActiveIndex) {
        state.tabsIndex--;
      } else if (state.tabsIndex == ActiveIndex) {
        state.tabsIndex = state.tabsList.length - 1;
      }
      // state.menuList = menuList;
    },
    //
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TOKENTIME: (state, tokenTime) => {
      state.tokenTime = tokenTime
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_DOMAINID: (state, domainId) => {
      state.domainId = domainId
    },
    SET_DOMAINNAME: (state, domainName) => {
      state.domainName = domainName
    },
    SET_THEME: (state, theme) => {
      state.theme = theme
    },
    SET_TENANTCODE: (state, tenantCode) => {
      state.tenantCode = tenantCode
    },
    SET_SUPER_ROLES: (state, superRoles) => {
      state.superRoles = superRoles
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },
  actions: {
    setAuthority: async ({ commit }) => {
      await new Promise<void>(async (resolve) => {
        let module0 = import.meta.glob("../views/*/*.vue");
        let module1 = import.meta.glob("../views/*/*/*.vue");
        let modules = Object.assign(module0, module1);
        // console.log(modules);
        // path: "/" + e.path.split("/")[1],
        // component: modules[`../views/${e.path}.vue`],
        resolve();
        commit("setAuthority");
      });
      return;
    },
    loginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', 'x-subject-token');
        auth.setToken('x-subject-token');
        resolve("");
      });
    },
    // loginByUsername({ commit }, userInfo) {
    //   commit('SET_NAME', userInfo.username);
    //   return new Promise((resolve, reject) => {
    //     // 获取刷新token
    //     apiLogin.apis.getTokenId(userInfo).then((res: any) => {
    //       commit('SET_DOMAINID', res.data.token.domainId)
    //       commit('SET_DOMAINNAME', res.data.token.domainName)
    //       commit('SET_THEME', res.data.token.theme)
    //       commit('SET_TENANTCODE', res.data.token.tenantCode)
    //       auth.setDomainId(res.data.token.domainId)
    //       auth.setDomainName(res.data.token.domainName)
    //       auth.setTheme(res.data.token.theme)
    //       auth.setTenantCode(res.data.token.tenantCode)
    //       const userToken = {
    //         auth: {
    //           identity: {
    //             methods: ['token'],
    //             token: {
    //               id: res.headers['x-subject-token'],
    //               tenantCode: res.data.token.tenantCode,
    //             },
    //           },
    //         },
    //       }
    //       // 获取访问token
    //       apiLogin.apis.getTokenId(userToken).then((response: any) => {
    //         commit('SET_TOKEN', response.headers['x-subject-token']);
    //         commit('SET_TOKENTIME', response.data.token.expireAt);
    //         auth.setTokenTime(response.data.token.expireAt);
    //         auth.setToken(response.headers['x-subject-token']);
    //         auth.setName(userInfo.username);
    //         auth.setPassWord(userInfo.password);

    //         let queryRole = {
    //           type: 1,
    //           currentPage: 1,
    //           pageSize: 1000,
    //           page: 1,
    //         }
    //         apiUser.apis.relation(userInfo.username, queryRole).then((resr: any) => {
    //           let superRole = false;
    //           resr.data.list.forEach((item: any) => {
    //             if (item.roleCode === 'WMS-SUPER') {
    //               commit('SET_SUPER_ROLES', true);
    //               superRole = true;
    //             }
    //           })
    //           if (!superRole) {
    //             commit('SET_SUPER_ROLES', false);
    //           }
    //         })
    //         resolve("");
    //       })
    //     }).catch((error) => {
    //       reject(error);
    //     })
    //   })
    // },
    getMenu({ commit }) {
      return new Promise((resolve) => {
        // 模拟菜单数据
        let datas = [
          {
            path: "/device/deviceArchive", component: Layout, redirect: "/device/deviceArchive", name: "设备管理", children: [
              { path: "/device/deviceArchive", component: () => import("../views/device/deviceArchive/index.vue"), name: "设备台账" },
              { path: "/device/deviceType", component: () => import("../views/basic/deviceType/index.vue"), name: "设备类型" },
            ]
          },
          {
            path: "/basic/supplier", component: Layout, redirect: "/basic/supplier", name: "基础信息", children: [
              { path: "/basic/supplier", component: () => import("../views/basic/supplier/index.vue"), name: "供应商" },
              { path: "/basic/faultType", component: () => import("../views/basic/faultType/index.vue"), name: "故障类型" },
              { path: "/basic/spareType", component: () => import("../views/basic/spareType/index.vue"), name: "备件类型" },
              { path: "/basic/warehouse", component: () => import("../views/basic/warehouse/index.vue"), name: "仓库定义" },
            ]
          },
        ]
        resolve(datas);
      });
    },
    // 用户退出
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        auth.removeToken();
        resolve(null);
      })
    },
    // 删除token
    resetToken({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        auth.removeToken();
        resolve(null);
      })
    },
  },
  modules: {},
});

export default store;
