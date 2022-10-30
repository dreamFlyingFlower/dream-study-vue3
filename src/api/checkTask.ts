import { Request } from "../axios/request";

class api {
	/* api接口模块 */
	public static apis = {
		getList: (params: any) => Request.get("/eam/v1/inspectiontask/list/inspectiontask", params),

		// getEntitys: (params: any) => Request.get("/eam/v1/supplier/getEntitys", params),
        // 变更
		update: (data: any) => Request.post(`/eam/v1/inspectiontask/update`, data),
		// edit: (data: any) => Request.patch("/eam/v1/inspect/standard/update", data),
		deleteById: (id: any) => Request.delete(`/eam/v1/inspectiontask/${id}`),
		// deleteByIds: (data: any) => Request.post(`/eam/v1/supplier/deleteByIds`, data),
        
		getDeatail: (inspectionTaskId: any) => Request.get(`/eam/v1/inspectiontask/getinspecttaskdetail/${inspectionTaskId}`),

		startTask: (inspectionTaskId: any) => Request.get(`/eam/v1/inspectiontask/taskbegin/${inspectionTaskId}`),
		getTaskItem: (inspectionTaskDetailId: any) => Request.get(`/eam/v1/inspectiontask/getinspecttaskdetailitem/${inspectionTaskDetailId}`),
        excutTask:(data: any) => Request.post(`/eam/v1/inspectiontask/taskexecute`, data),
		stopTask: (id: any) => Request.post(`/eam/v1/inspectiontask/taskfinish/${id}`),
	};
}
export default api;