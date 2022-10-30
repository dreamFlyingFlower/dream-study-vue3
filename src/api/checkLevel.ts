import { Request } from "../axios/request";

class api {
	/* api接口模块 */
	public static apis = {
		getList: (params: any) => Request.get("/eam/v1/inspect/standard/list", params),

		getEntitys: (params: any) => Request.get("/eam/v1/supplier/getEntitys", params),
		add: (data: any) => Request.post(`/eam/v1/inspect/standard/add`, data),
		edit: (data: any) => Request.patch("/eam/v1/inspect/standard/update", data),
		deleteById: (id: any) => Request.get(`/eam/v1/inspect/standard/delete/${id}`),
		deleteByIds: (data: any) => Request.post(`/eam/v1/supplier/deleteByIds`, data),
		getDeatail: (data: any) => Request.get(`/eam/v1/inspect/standard/detail/list`,data),
		hasValue: (data: any) => Request.post(`/eam/v1/supplier/hasValue`, data),
	};
}
export default api;