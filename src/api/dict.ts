import { Request } from "../axios/request";

class api {
  /* 字典接口模块 */
  public static apis = {
    add: (params: any) => Request.post(`/eam/v1/dict/add`, params),
    deleteById: (rowId: any) => Request.delete(`/eam/v1/dict/deleteById/${rowId}`),
    deleteByIds: (params: any) => Request.post(`/eam/v1/dict/deleteByIds`, params),
    edit: (params: any) => Request.patch("/eam/v1/dict/edit", params),
    getByCode: (dictCode: any) => Request.get(`/eam/v1/dict/getByCode/${dictCode}`),
    getList: (params: any) => Request.get("/eam/v1/dict/list", params),
    getEntitys: (params: any) => Request.get("/eam/v1/dict/list", params),
    getDeatail: (rowId: any) => Request.get(`/eam/v1/dict/getById/${rowId}`),
    hasValue: (params: any) => Request.post(`/eam/v1/dict/hasValue`, params),
    getItemsByCode: (params: any) => Request.get(`/eam/v1/dictItem/getEntitys/`, params),
  };
}
export default api;