// request.ts
import axios from "./index";
export class Request {
  /**
   * get方法
   * @param {string} url 路径
   * @param {object} params 参数
   */
  static get = (url: string, params?: any, type: any = 0) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static post = (url: string, params?: any, type: any = 0) => {
    return new Promise((resolve, reject) => {
      let contentType = "";
      switch (type) {
        case 0:
          contentType = "application/json";
          break;
        case 1:
          contentType = "application/x-www-form-urlencoded";
          break;
        case 2:
          contentType = "multipart/form-data";
          break;

        default:
          break;
      }

      axios
        .post(url, params, {
          headers: {
            "Content-Type": contentType,
          },
        })
        .then((res: any) => {
          if (type == 2) {
            resolve(res);
            return;
          }
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static put = (url: string, params?: any, type: any = 0) => {
    console.log(type);
    let contentType = "";
    type == 1
      ? (contentType = "x-www-form-urlencoded")
      : (contentType = "application/json");

    return new Promise((resolve, reject) => {
      axios
        .put(url, params, {
          headers: {
            "Content-Type": contentType,
          },
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static patch = (url: string, params?: any, type: any = 0) => {
    let contentType = type === 1 ? "x-www-form-urlencoded" : "application/json";
    return new Promise((resolve, reject) => {
      axios
        .patch(url, params, {
          headers: {
            "Content-Type": contentType,
          },
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static delete = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, params)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static requestDelete = (url: string, params?: any, type: any = 0) => {
    let contentType = type === 1 ? "x-www-form-urlencoded" : "application/json";
    return new Promise((resolve, reject) => {
      axios
        .request({
          url: url,
          method: "DELETE",
          data: params,
          headers: {
            "Content-Type": contentType,
          },
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static download = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios
        .request({
          url: url,
          method: "GET",
          responseType: "blob",
          params: params,
        })
        .then((res: any) => {
          // 处理返回的文件流
          let content = res.data;
          let blob = new Blob([content]);
          let disposition = res.headers["content-disposition"];
          let fileInfo = disposition
            ? disposition.substr(disposition.indexOf("filename"))
            : "";
          let fileName = fileInfo ? fileInfo.split("=")[1] : "文件";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            let elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  static getBuffer = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
          responseType: 'arraybuffer'
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
}
