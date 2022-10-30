import { Request } from "../axios/request";

class api {
  /* api接口模块 */
  public static article = {
    getList: (params:any) => Request.get("/eam/v1/spare/list",params),
    add: (data: any) => Request.post(`/eam/v1/spare/add`, data),
    edit: (data: any) => Request.post("/eam/v1/spare/update", data),
    getDeatail: (data:any) => Request.post(`/eam/v1/spare/orderDetail`, data,1),
    
  };
}
export default api;
