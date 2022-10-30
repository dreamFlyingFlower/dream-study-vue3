import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import apiLogin from '../api/login';

const key = 'qwwe%^*yhu8976)(';
const iv = 'UJHY@#$*0987&^%H';
const TokenKey = 'X-Auth-Token';
const username = 'username';
const passWord: string = 'passWord';
const Catalog = 'Catalog';
const TokenTime = 'TokenTime';
const DomainName = 'DomainName';
const IssuedAt = 'IssuedAt';
const RealName = 'RealName';
const DomainId = 'DomainId';
const DomainCode = 'DomainCode';
const DomainCodeName = 'DomainCodeName';
const Theme = 'Theme';
const TenantCode = 'TenantCode';

export function clearCookie() {
    Cookies.remove('username');
}

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token: any) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getName() {
    return Cookies.get(username);
}

export function setName(name: string) {
    return Cookies.set(username, name);
}

export function removeName() {
    return Cookies.remove(username);
}

export function getPassWord() {
    if (Cookies.get(passWord)) {
        return decrypt(Cookies.get(passWord));
    } else {
        return Cookies.get(passWord);
    }
}

export function setPassWord(passWords: string) {
    return Cookies.set(passWord, encrypt(passWords));
}

export function removePassWord() {
    return Cookies.remove(passWord);
}
export function getCatalogs() {
    return Cookies.get(Catalog);
}

export function setCatalogs(Catalogs: any) {
    return Cookies.set(Catalog, Catalogs);
}

export function removeCatalogs() {
    return Cookies.remove(Catalog);
}
export function getTokenTime(): any {
    return Cookies.get(TokenTime);
}

export function setTokenTime(TokenTimes: any) {
    return Cookies.set(TokenTime, TokenTimes);
}

export function removeTokenTime() {
    return Cookies.remove(TokenTime);
}

export function getDomainId() {
    return Cookies.get(DomainId);
}

export function setDomainId(DomainIds: any) {
    return Cookies.set(DomainId, DomainIds);
}

export function removeDomainId() {
    return Cookies.remove(DomainId);
}

export function getDomainName() {
    return Cookies.get(DomainName);
}

export function setDomainName(DomainNames: any) {
    return Cookies.set(DomainName, DomainNames);
}

export function removeDomainName() {
    return Cookies.remove(DomainName);
}

export function getIssuedAt() {
    return Cookies.get(IssuedAt);
}

export function setIssuedAt(IssuedAts: any) {
    return Cookies.set(IssuedAt, IssuedAts);
}

export function removeIssuedAt() {
    return Cookies.remove(IssuedAt);
}

export function getRealName() {
    return Cookies.get(RealName);
}

export function setRealName(RealNames: any) {
    return Cookies.set(RealName, RealNames);
}

export function removeRealName() {
    return Cookies.remove(RealName);
}

export function getDomainCode() {
    return Cookies.get(DomainCode);
}

export function setDomainCode(DomainCodes: any) {
    return Cookies.set(DomainCode, DomainCodes);
}

export function removeDomainCode() {
    return Cookies.remove(DomainCode);
}

export function getDomainCodeName() {
    return Cookies.get(DomainCodeName);
}

export function setDomainCodeName(DomainCodeNames: any) {
    return Cookies.set(DomainCodeName, DomainCodeNames);
}

export function removeDomainCodeName() {
    return Cookies.remove(DomainCodeName);
}

//获取设置主题
export function getTheme() {
    return Cookies.get(Theme);
}

export function setTheme(data: any) {
    return Cookies.set(Theme, data);
}

export function removeTheme() {
    return Cookies.remove(Theme);
}

export function setWorkstation(data: any) {
    return Cookies.set('workstation', data);
}

export function getWorkstation() {
    return Cookies.get('workstation');
}

export function removeWorkstation() {
    return Cookies.remove('workstation');
}
//获取租户
export function setTenantCode(data: any) {
    return Cookies.set(TenantCode, data);
}

export function getTenantCode() {
    return Cookies.get(TenantCode);
}

export function removeTenantCode() {
    return Cookies.remove(TenantCode);
}

// 检查token
export function checkToken() {
    let expire = getTokenTime();
    expire = expire.replace(new RegExp("-", "gm"), "/");
    expire = (new Date(expire)).getTime(); //得到毫秒数
    let nowData = new Date().getTime() //当前时间转化为分钟
    let duringTime = (expire - nowData) / 1000 / 60; //token剩余时间间隔 5min
    if (duringTime > 0 && duringTime < 10) {
        const auth = {
            "auth": {
                "identity": {
                    "methods": [
                        "password"
                    ],
                    "password": {
                        "user": {
                            "name": getName(),
                            "password": getPassWord()
                        }
                    }
                }
            }
        }
        return new Promise((resolve, reject) => {
            //获取刷新token
            apiLogin.apis.getTokenId(auth).then((res: any) => {
                const userToken = {
                    "auth": {
                        "identity": {
                            "methods": [
                                "token"
                            ],
                            "token": {
                                "id": res.headers['x-subject-token']
                            }
                        }
                    }
                }
                //获取访问token
                apiLogin.apis.getTokenId(userToken).then((response: any) => {
                    setTokenTime(response.data.token.expireAt);
                    setToken(response.headers['x-subject-token']);
                    resolve(null);
                })
            }).catch(error => {
                console.log("错误在checkToken里面")
                // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
                reject(error)
            })
        })
    } else {
        if (duringTime < 0) {
            removeTokenTime();
            removeToken();
            return false;
        } else {
            return true
        }
    }
}

// 加密
function encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })
}

// 解密
function decrypt(text: string | undefined) {
    let result = CryptoJS.AES.decrypt(<string>text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })
    return result.toString(CryptoJS.enc.Utf8)
}

export function removeAll() {
    removeDomainName();
    removeIssuedAt();
    removeRealName();
    removeDomainId();
    removeDomainCode();
    removeDomainCodeName();
    removeTokenTime();
    removeCatalogs();
    removePassWord();
    removeName();
    removeToken();
    removeWorkstation();
    removeTenantCode();
}