export function saveUserToken(userToken,userid) {
    localStorage.setItem("TOKEN", userToken);
    localStorage.setItem("userid", userid);
}
export function getUserToken() {
    return localStorage.getItem("TOKEN");
}
export function clearUserToken() {
    localStorage.removeItem("userid");
    return localStorage.removeItem("TOKEN");
}
