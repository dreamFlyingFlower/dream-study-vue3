import { Request } from "../axios/request";

class api {
  /* 字典接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/dictItem/add`, params),
    deleteById: (rowId: any) => Request.delete(`/eam/v1/dictItem/deleteById/${rowId}`),
    deleteByIds: (params: any) => Request.post(`/eam/v1/dictItem/deleteByIds`, params),
    edit: (params: any) => Request.patch("/eam/v1/dictItem/edit", params),
    getByCode: (dictCode: any) => Request.get(`/eam/v1/dictItem/getByCode/${dictCode}`),
    getList: (params: any) => Request.get("/eam/v1/dictItem/list", params),
    getEntitys: (params: any) => Request.get("/eam/v1/dictItem/list", params),
    getDeatail: (rowId: any) => Request.get(`/eam/v1/dictItem/getById/${rowId}`),
    hasValue: (params: any) => Request.post(`/eam/v1/dictItem/hasValue`, params),
    getItemsByCode: (params: any) => Request.get(`/eam/v1/dictItem/getEntitys/`, params),
  };
}
export default api;