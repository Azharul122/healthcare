
const setCookie = (res: any, name: string, value: string, options: any) => {
    res.cookie(name, value, options);
}

const deleteCookie = (res: any, name: string) => {
    res.clearCookie(name);
}

const clearCookie = (res: any) => {
    res.clearCookie();
}

export { setCookie, deleteCookie, clearCookie }