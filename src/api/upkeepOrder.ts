import { Request } from "../axios/request";

class api {
  /* 保养计划接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/upkeep/order/add`, params),
    deleteById: (id: any) => Request.get(`/eam/v1/upkeep/order/delete/${id}`),
    edit: (params: any) => Request.post("/eam/v1/upkeep/order/update", params),
    getList: (params: any) => Request.get("/eam/v1/upkeep/order/list", params),
    getById: (id: any) => Request.get(`/eam/v1/upkeep/order/${id}`),
  };
}
export default api;