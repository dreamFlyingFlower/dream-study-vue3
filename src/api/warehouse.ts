import { Request } from "../axios/request";

class api {
  /* 设备接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/warehouse`, params),
    deleteById: (params: any) => Request.requestDelete(`/eam/v1/warehouse/`, params),
    deleteByIds: (params: any) => Request.requestDelete(`/eam/v1/warehouse`, params),
    edit: (params: any) => Request.patch("/eam/v1/warehouse", params),
    getDeatail: (rowId: any) => Request.get(`/eam/v1/warehouse/getById/${rowId}`),
    getEntitys: (params: any) => Request.get("/eam/v1/warehouse/getEntitys", params),
    getList: (params: any) => Request.get("/eam/v1/warehouse", params)
  };
}
export default api;