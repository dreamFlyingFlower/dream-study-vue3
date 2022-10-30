import { Request } from "../axios/request";

class api {
	/* api接口模块 */
	public static apis = {
		getList: (params: any) => Request.get("/eam/v1/maintenancestandard/list", params),

		// getEntitys: (params: any) => Request.get("/eam/v1/supplier/getEntitys", params),
		add: (data: any) => Request.post(`/eam/v1/maintenancestandard/add`, data),
		edit: (data: any) => Request.patch("/eam/v1/maintenancestandard/update", data),
		deleteById: (id: any) => Request.delete(`/eam/v1/maintenancestandard/${id}`),
		deleteByIds: (data: any) => Request.post(`/eam/v1/supplier/deleteByIds`, data),
		getDeatail: (id: any) => Request.get(`/eam/v1/maintenancestandard/get/${id}`),
		// hasValue: (data: any) => Request.post(`/eam/v1/supplier/hasValue`, data),
		getListDetail: (params: any) => Request.get("/eam/v1/maintenancestandard/list/detail", params),
	};
}
export default api;