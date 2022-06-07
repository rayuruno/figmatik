import https from "https";
import { FileCache } from "./cache.js";
const defaultHttpCache = new FileCache();
export const Request = (cache = defaultHttpCache) => async function request(req) {
    let cacheOption = req?.cache;
    delete req?.cache;
    let pathname = req.path || req.pathname;
    let res;
    switch (cacheOption) {
        case "no-cache":
            res = await httpsRequest(req);
            break;
        case "only-if-cached":
            res = await cache.read(pathname);
            break;
        case "reload":
            res = await httpsRequest(req);
            if (res) {
                await cache.write(pathname, res);
            }
            break;
        default:
            if (await cache.exists(pathname)) {
                res = await cache.read(pathname);
            }
            else {
                res = await httpsRequest(req);
                if (res) {
                    await cache.write(pathname, res);
                }
            }
    }
    return res;
};
export function queryString(params) {
    if (!params)
        return "";
    const usp = new URLSearchParams(Object.entries(params).filter(([_, v]) => !!v));
    const paramsString = usp.toString();
    return paramsString ? `?${paramsString}` : "";
}
function httpsRequest(options) {
    return new Promise((resolve, reject) => {
        https
            .request(options, (res) => {
            if (!res.statusCode || res.statusCode >= 400) {
                console.error(res.statusCode);
                reject(new Error(`http request rejected: ${res.statusMessage}`));
            }
            const buffer = [];
            res
                .on("data", (c) => {
                buffer.push(c);
            })
                .once("error", (e) => {
                console.error(e);
                reject(e);
            })
                .once("end", () => {
                resolve(Buffer.concat(buffer));
            });
        })
            .end();
    });
}
