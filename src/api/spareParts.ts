import { Request } from "../axios/request";

class api {
  /* api接口模块 */
  public static article = {
    getpartconsume: (data: any) =>
      Request.get("/eam/v1/spare/part/consume", data), //查询备件领用列表
    getWarehouse: (data: any) => Request.get("/eam/v1/warehouse", data), //查询仓库列表
    deviceList: (params: any) => Request.get("/eam/v1/device/list", params),
    getconsumedetails: (data: any) =>
      Request.get("/eam/v1/spare/part/consume/details", data), //根据备件领用单id查询领用明细
    getrecorddetails: (data: any) =>
      Request.get("/eam/v1/spare/part/consume/record/details", data), //根据备件领用单单号查询领用记录
    delete: (id: any) =>
      Request.delete(`/eam/v1/spare/part/consume/delete/${id}`), //删除备件领用
    addConsume: (data: any) =>
      Request.post("/eam/v1/spare/part/consume/add", data), //新增备件领用
    auditConsume: (data: any) =>
      Request.post("/eam/v1/spare/part/consume/audit", data), //审核备件领用
    upload: (data: any) =>
      Request.post("/eam/v1/spare/part/consume/file/upload", data), //前端上传文件后得到文件id调用此接口保存上传数据
    reject: (Id: any) =>
      Request.post(`/eam/v1/spare/part/consume/reject/${Id}`), //驳回备件领用
    return: (data: any) =>
      Request.post("/eam/v1/spare/part/consume/return", data), //返还备件领用
    update: (data: any) =>
      Request.post("/eam/v1/spare/part/consume/update", data), //修改备件领用
  };
}
export default api;
