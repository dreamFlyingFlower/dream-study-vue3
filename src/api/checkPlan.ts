import { Request } from "../axios/request";

class api {
	/* api接口模块 */
	public static apis = {
		getList: (params: any) => Request.get("/eam/v1/inspectionplan/list/inspectionplan", params),

		// getEntitys: (params: any) => Request.get("/eam/v1/supplier/getEntitys", params),
        
		add: (data: any) => Request.post(`/eam/v1/inspectionplan/add/inspectionplan`, data),
		edit: (data: any) => Request.post("/eam/v1/inspectionplan/update", data),
		deleteById: (id: any) => Request.delete(`/eam/v1/inspectionplan/${id}`),
        // 停用
		stopById: (id: any) => Request.post(`/eam/v1/inspectionplan/end/${id}`),
                // 停用
		startById: (id: any) => Request.post(`/eam/v1/inspectionplan/start/${id}`),
        // 修改时间
		updatePlanTime: (id: any,inspectionPlanStartTime:any,inspectionPlanEndTime:any) => Request.post(`/eam/v1/inspectionplan/updatePlanTime/${id}/${inspectionPlanStartTime}/${inspectionPlanEndTime}`),

		// deleteByIds: (data: any) => Request.post(`/eam/v1/supplier/deleteByIds`, data),
		getDeatail: (id: any) => Request.get(`/eam/v1/inspectionplan/get/${id}`),
		// hasValue: (data: any) => Request.post(`/eam/v1/supplier/hasValue`, data),
        // 查询设备列表
        getDeviceList:(params: any) =>  Request.get("/eam/v1/device/list",params),
        //查询巡检记录
		getReccordList: (params: any) => Request.get("/eam/v1/inspectionplan/list/inspectionRecord", params),
        //查询巡检任务明细
        getCheckTaskDetail:(inspectionTaskId: any) => Request.get(`/eam/v1/inspectiontask/getinspecttaskdetail/${inspectionTaskId}`),
        //巡检任务明细检查项列表
        getCheckTaskDetailItems:(inspectionTaskDetailId: any) => Request.get(`/eam/v1/inspectiontask/getinspecttaskdetailitem/${inspectionTaskDetailId}`),

	};
}
export default api;