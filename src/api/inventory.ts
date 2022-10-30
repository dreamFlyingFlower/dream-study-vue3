import { Request } from "../axios/request";

class api {
  /* api接口模块 */
  public static article = {
    getBlitem: (data: any) => Request.get("/eam/v1/blitem", data), //查询盘点单
    getDetail: (ids: any,data:any) => Request.get(`/eam/v1/blitem/${ids}`,data), //根据id查询明细
    getWarehouse: (data: any) => Request.get("/eam/v1/warehouse", data), //查询仓库列表
    update: (data: any) => Request.patch("/eam/v1/blitem", data), //修改出入库信息
    delete: (data: any) => Request.requestDelete(`/eam/v1/blitem`, data), //批量删除盘点单
    addBlitem: (data: any) => Request.post(`/eam/v1/blitem`, data), //新增盘点单
  };
}
export default api;
