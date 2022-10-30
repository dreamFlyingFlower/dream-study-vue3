// 保存数据到浏览器的缓存中
export function saveToken(token: string) {
  localStorage.setItem("userToken", token ? token : '');
  // JSON.stringify() JSON.parse()
}
// 从浏览器的缓存中读取数据
export function readToken(): string {
  let token = localStorage.getItem("userToken") || "";
  return token ? token : "";
}
// 从浏览器的缓存中删除数据
export function delToken() {
  localStorage.removeItem("userToken");
}