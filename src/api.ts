import { FigmatikConfig } from "./figmatik.js";
import * as http from "./http.js";
import * as parser from "./parser.js";

export interface FilesEndpoint {
  (
    request: GetFilesRequest,
    cache?: http.RequestOptions["cache"]
  ): Promise<FileApi>;
}

export const Files = (config?: EndpointConfig): FilesEndpoint =>
  Endpoint<GetFilesRequest, FileApi>(
    "/v1/files/:fileKey",
    parser.File(config),
    config
  );

export interface ImagesEndpoint {
  (
    request: GetImagesRequest,
    cache?: http.RequestOptions["cache"]
  ): Promise<GetImagesResponse>;
}

export const Images = (config?: EndpointConfig): ImagesEndpoint =>
  Endpoint<GetImagesRequest, GetImagesResponse>(
    "/v1/images/:fileKey",
    parser.Images(config),
    config
  );

export type EndpointConfig = FigmatikConfig & {
  request?: (req: http.RequestOptions) => Promise<Buffer>;
};

export function Endpoint<RequestType, ResponseType>(
  resource: string,
  parse: parser.ResponseParser = JSON.parse as parser.ResponseParser,
  config?: EndpointConfig
) {
  const token = config?.token || process.env.FIGMA_TOKEN;
  if (!token) throw new Error("token missing");

  const request = config?.request || http.Request(config?.cache);

  return async function endpoint(
    requestParams?: RequestType,
    cache?: http.RequestOptions["cache"]
  ): Promise<ResponseType> {
    let params = { ...requestParams };
    let pathParams: Record<string, string> = {};
    let path = resource.replace(/(:\w+)/, (_, s) => {
      let key = s.substring(1);
      let value = (params as any)[key];
      if (value) {
        pathParams[key] = (params as any)[key];
        delete (params as any)[key];
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
