import { Request } from "../axios/request";

class api {
  /* 设备接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/device/add`, params),
    deleteById: (rowId: any) => Request.delete(`/eam/v1/device/deleteById/${rowId}`),
    deleteByIds: (params: any) => Request.post(`/eam/v1/device/deleteByIds`, params),
    edit: (params: any) => Request.patch("/eam/v1/device/edit", params),
    getDeatail: (rowId: any) => Request.get(`/eam/v1/device/getById/${rowId}`),
    getEntitys: (params: any) => Request.get("/eam/v1/device/getEntitys", params),
    getList: (params: any) => Request.get("/eam/v1/device/list", params),
    hasValue: (params: any) => Request.post(`/eam/v1/device/hasValue`, params),
    // 查询设备下的备件列表
    listDeviceSpare: (params: any) => Request.get(`/eam/v1/device/listDeviceSpare`, params),
    addDeviceSpares: (params: any) => Request.post(`/eam/v1/device/addDeviceSpares/`, params),
    deleteDeviceSpares: (params: Array<Number>) => Request.requestDelete(`/eam/v1/device/deleteDeviceSpares/`, params),
    addDeviceFile: (params: any) => Request.post(`/eam/v1/device/addDeviceFile/`, params),
    deleteDeviceFiles: (params: any) => Request.post(`/eam/v1/device/deleteDeviceFiles/${params.rowId}`, params.fileIds),
  };
}
export default api;