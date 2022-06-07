import * as http from "./http.js";
import * as parser from "./parser.js";
export const Files = (config) => Endpoint("/v1/files/:fileKey", parser.File(config), config);
export const Images = (config) => Endpoint("/v1/images/:fileKey", parser.Images(config), config);
export function Endpoint(resource, parse = JSON.parse, config) {
    const token = config?.token || process.env.FIGMA_TOKEN;
    if (!token)
        throw new Error("token missing");
    const request = config?.request || http.Request(config?.cache);
    return async function endpoint(params, cache) {
        let pathParams = {};
        let path = resource.replace(/(:\w+)/, (_, s) => {
            let key = s.substring(1);
            let value = params[key];
            if (value) {
                pathParams[key] = params[key];
                delete params[key];
                return value;
            }
        });
        path = `${path}${http.queryString(params)}`;
        const buffer = await request({
            port: 443,
            method: "GET",
            hostname: "api.figma.com",
            headers: { "X-FIGMA-TOKEN": token },
            path,
            cache,
        });
        return Object.freeze(Object.assign(parse(buffer), pathParams));
    };
}
