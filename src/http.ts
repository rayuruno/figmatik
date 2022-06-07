import https from "https";
import { FileCache, CacheStore } from "./cache.js";

const defaultHttpCache = new FileCache();

export type RequestOptions = (https.RequestOptions | URL) & {
  cache?: "no-cache" | "only-if-cached" | "reload";
};

export const Request = (cache: CacheStore = defaultHttpCache) =>
  async function request(req: RequestOptions): Promise<Buffer> {
    let cacheOption = req?.cache;
    delete req?.cache;

    let pathname = (req as https.RequestOptions).path || (req as URL).pathname;
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
        } else {
          res = await httpsRequest(req);
          if (res) {
            await cache.write(pathname, res);
          }
        }
    }

    return res;
  };

export function queryString(params?: Record<string, any>): string {
  if (!params) return "";

  const usp = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => !!v)
  );

  const paramsString = usp.toString();

  return paramsString ? `?${paramsString}` : "";
}

function httpsRequest(options: https.RequestOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .request(options, (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          console.error(res.statusCode);
          reject(new Error(`http request rejected: ${res.statusMessage}`));
        }

        const buffer: any[] = [];

        res
          .on("data", (c: any) => {
            buffer.push(c);
          })
          .once("error", (e: Error) => {
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
