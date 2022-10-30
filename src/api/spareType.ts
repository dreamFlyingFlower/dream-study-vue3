import { Request } from "../axios/request";

class api {
  /* api接口模块 */
  public static article = {
    getSpareType: () => Request.get("/eam/v1/spare/type"), //查询备件类型列表
    addSpareType: (data: any) => Request.post("/eam/v1/spare/type/add", data), //新增备件类型
    delSpareType: (ids: any) => Request.get(`/eam/v1/spare/delete/${ids}`), //删除备件类型
    editSpareType: (data: any) =>
      Request.post(`/eam/v1/spare/type/update`, data), //修改备件类型
    getEntitys: (
      params: any //供应商
    ) => Request.get("/eam/v1/supplier/getEntitys", params),
    getDictCode: (
      params: any //计量单位
    ) => Request.get("/eam/v1/dictItem/getEntitys", params),
    getSupplierList: (
      params: any //生产厂商
    ) => Request.get("/eam/v1/supplier/list", params),
    getWarehouse: (data: any) => Request.get("/eam/v1/warehouse", data), //查询仓库列表
    getspareInstock: (id:any) => Request.get(`/eam/v1/spare/instock/${id}`),
    spareRecord: (id:any) => Request.get(`/eam/v1/spare/record/${id}`),
    spareDevice: (data:any) => Request.get(`/eam/v1/spare/device/list`, data),
    download: (id:any) => Request.get(`/eam/v1/fm/download/${id}`),
  };

  public static apis = {
    getList: (params: any) => Request.get("/eam/v1/spare/type", params), //查询备件类型列表
    add: (data: any) => Request.post("/eam/v1/spare/type/add", data), //新增备件类型
    edit: (data: any) => Request.post(`/eam/v1/spare/type/update`, data), //修改备件类型
    deleteByIds: (ids: any) => Request.post(`/eam/v1/spare/type/delete/`, ids), //删除备件类型
  };
}
export default api;
