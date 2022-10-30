import { Request } from "../axios/request";

let keyguardUrl = import.meta.env.VITE_BASE_URL_KEYGUARD;

class api {
  public static apis = {
    getTokenId: (params: any) => Request.post(`${keyguardUrl}/v1/auth/tokens`, params),
    getCatalog: (params: any) => Request.get(`${keyguardUrl}/v1/auth/catalog`, params),
    logout: (params: any) => Request.post(`${keyguardUrl}/v1/login/logout`, params),
    changePassword: (userName: string, data: any) => Request.post(`/users/${userName}/password/`, data),
  }
}
export default api;