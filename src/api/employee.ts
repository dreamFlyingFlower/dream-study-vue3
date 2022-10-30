import { Request } from "../axios/request";

let keyguardUrl = import.meta.env.VITE_BASE_URL_KEYGUARD;

class api {
	/* 供应商接口模块 */
	public static apis = {
		add: (params: any) => Request.post(`${keyguardUrl}/v1/employees`, params),
		deleteByCode: (code: string) => Request.delete(`${keyguardUrl}/v1/employees/${code}`),
		edit: (params: any) => Request.patch(`${keyguardUrl}/v1/employees/`, params),
		getByCode: (code: string, params: any) => Request.get(`${keyguardUrl}/v1/employees/${code}`, params),
		getList: (params: any) => Request.get(`${keyguardUrl}/v1/employees`, params),
	};
}
export default api;