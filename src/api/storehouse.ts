import { Request } from "../axios/request";

class api {
  /* api接口模块 */
  public static article = {
    getInputwarehouse: (data: any) =>
      Request.get("/eam/v1/outputinputwarehouse/list/inputwarehouse", data), //查询入库信息列表
    getOutputwarehouse: (data: any) =>
      Request.get("/eam/v1/outputinputwarehouse/list/outputwarehouse", data), //查询入库信息列表
    getWarehouse: (data: any) => Request.get("/eam/v1/warehouse", data), //查询仓库列表
    getEntitys: (data: any) => Request.get("/eam/v1/supplier/getEntitys", data), //查询供应商列表

    getDetail: (data: any) =>
      Request.get("/eam/v1/outputinputwarehouse/list/detail", data), //查询出入库明细
    update: (data: any) =>
      Request.post("/eam/v1/outputinputwarehouse/update", data), //修改出入库信息
    delete: (ids: any) => Request.delete(`/eam/v1/outputinputwarehouse/${ids}`), //删除出入库信息
    addToStock: (data: any) =>
      Request.post(`/eam/v1/outputinputwarehouse/add/inputwarehouse`, data), //新增入库信息
    addOutbound: (data: any) =>
      Request.post(`/eam/v1/outputinputwarehouse/add/outputwarehouse`, data), //新增出库信息
    getSpareType: () => Request.get("/eam/v1/spare/type"), //查询备件类型列表
    getList: (params:any) => Request.get("/eam/v1/spare/list",params),
  };
}
export default api;
