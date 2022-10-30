import { Request } from "../axios/request";

class api {
  /* 保养计划接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/upkeep/plan/add`, params),
    deleteById: (id: any) => Request.get(`/eam/v1/upkeep/plan/delete/${id}`),
    disable: (id: any) => Request.post(`/eam/v1/upkeep/plan/disable/${id}`),
    edit: (params: any) => Request.post("/eam/v1/upkeep/plan/update", params),
    enable: (id: any) => Request.post(`/eam/v1/upkeep/plan/enable/${id}`),
    getList: (params: any) => Request.get("/eam/v1/upkeep/plan/list", params),
    getById: (id: any) => Request.get(`/eam/v1/upkeep/plan/${id}`),
  };
}
export default api;