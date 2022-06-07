import { Figmatik } from "../figmatik.js";
import { Plugin } from "../plugin.js";

const DefaultOpts = {
  format: "jpg" as ExportOptions["format"],
  scale: 1,
};

const { entries, keys } = Object;

export default {
  name: "export",

  init(figmatik: Figmatik) {
    figmatik.export = async function (
      nodes: NodeApi[],
      options: ExportOptions[]
    ) {
      let reqs: Record<string, Record<string, NodeApi>> = nodes.reduce(
        (g: any, n: any) => {
          g[n.file.fileKey] ||= {};
          g[n.file.fileKey][n.id] = n;
          return g;
        },
        {}
      );
      let imgs = [];
      for (const [fileKey, idMap] of entries(reqs)) {
        for (let opt of options) {
          opt = { ...DefaultOpts, ...opt };

          let res = await figmatik.api.images({
            fileKey,
            ids: keys(idMap),
            ...opt,
          });

          for (const [id, url] of entries(res.images)) {
            let buffer = await figmatik.http.request(new URL(url));

            imgs.push({
              node: idMap[id],
              buffer,
              ...opt,
            });
          }
        }
      }
      return imgs;
    };
  },
};

export type ExportOptions = Omit<GetImagesParams, "ids" | "version">;

export interface ExportFunc {
  (nodes: NodeApi[], options: ExportOptions[]): Promise<
    {
      format?: "jpg" | "png" | "svg" | "pdf" | undefined;
      scale?: number | undefined;
      svg_include_id?: boolean | undefined;
      svg_simplify_stroke?: boolean | undefined;
      use_absolute_bounds?: boolean | undefined;
      node: NodeApi;
      buffer: Buffer;
    }[]
  >;
}

declare module "../figmatik" {
  interface Figmatik {
    export: ExportFunc;
  }
}
