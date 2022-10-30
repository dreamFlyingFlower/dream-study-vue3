import { Request } from "../axios/request";

class api {
    /* 设备接口模块 */
    public static apis = {
        download: (id: number) => Request.download(`/eam/v1/fm/download/${id}`),
        getByIds: (params: any) => Request.post("/eam/v1/fm/getByIds", params),
        upload: (params: any) => Request.post("/eam/v1/fm/upload", params)
    };
}
export default api;