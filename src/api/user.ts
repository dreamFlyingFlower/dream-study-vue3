import { Request } from "../axios/request";

let keyguardUrl = import.meta.env.VITE_BASE_URL_KEYGUARD;

class api {
    public static apis = {
        // 查询员工列表
        selectlists: (params: any) => Request.get(`${keyguardUrl}/v1/users`, params),
        // 新增员工
        creat: (params: any) => Request.post(`${keyguardUrl}/v1/users`, params),
        // 查询单个员工
        selectlist: (params: any) => Request.get(`${keyguardUrl}/v1/users/${params}`, params),
        // 删除单个用户
        deletelist: (params: any) => Request.delete(`${keyguardUrl}/v1/users/${params}`),
        // 更新单个用户
        updatalist: (code: any, params: any) => Request.patch(`${keyguardUrl}/v1/users/${code}`, params),
        // 功能授权
        authorizationfun: (userName: any, catalogs: any) => Request.post(`${keyguardUrl}/v1/users/${userName}/catalogs?catalogs=${catalogs}`),
        // 授权角色
        authorizationrole: (userName: any, code: any, methods: any) =>
            Request.post(`${keyguardUrl}/v1/users/${userName}/roles`,
                { method: methods, roleCodes: code, userName: userName }),
        // 查询关联的角色记录 query.type=1关联  query.type=2 未关联
        relation: (userName: any, params: any) => Request.get(`${keyguardUrl}/v1/users/${userName}/roles`, params),
        // 修改用户信息
        changeUserInfo: (params: any) => Request.patch(`${keyguardUrl}/v1/users/info`, params),
        // 上传用户头像
        userAvatar: (params: any) => Request.post(`${keyguardUrl}/v1/users/avatar`, params, 2),
        // 获取用户头像
        getUserAvatar: () => Request.getBuffer(`${keyguardUrl}/v1/users/avatar`),
        // mes2.0查询用户列表,查询单个用户列表
        selectUserList: (params: any) => Request.get(`${keyguardUrl}/v1/users`, params),
    }
}
export default api;