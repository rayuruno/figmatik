import { EndpointConfig } from "./api.js";
import * as node from "./node.js";

const NODE_TYPE_RE =
  /CONNECTOR|DOCUMENT|CANVAS|FRAME|GROUP|VECTOR|BOOLEAN_OPERATION|STAR|LINE|ELLIPSE|REGULAR_POLYGON|RECTANGLE|TEXT|SLICE|COMPONENT|COMPONENT_SET|INSTANCE|STICKY|SHAPE_WITH_TEXT/;

export const File = (config?: EndpointConfig) =>
  function filesParser(input: string | Buffer): Omit<FileApi, "fileKey"> {
    let file: Omit<FileApi, "fileKey">;

    file = JSON.parse(
      input as string,

      function fileVisitor(this: any, key: string, value: any) {
        if (key === "children") {
          value.forEach((child: any, index: number) => {
            Object.defineProperties(child, {
              parent: { value: this },
              index: { value: index },
            });
          });
        }

        if (value?.type?.match(NODE_TYPE_RE) && value?.id && value?.name) {
          Object.defineProperties(value, {
            file: { get: () => file },
            props: { value: Props(value) },
          });

          Object.assign(value, {
            walk: node.walk.bind(null, value),
            iterate: node.iterate.bind(null, value),
            find: node.find.bind(null, value),
            findAll: node.findAll.bind(null, value),
            ancestors: node.ancestors.bind(null, value),
          });

          config?.plugins?.forEach((p) => p.node?.(value));
        }

        return value;
      }
    );

    return file;
  };

export const Images = (_config?: EndpointConfig) =>
  function imagesParser(input: string | Buffer): GetImagesResponse {
    let res: GetImagesResponse = JSON.parse(input as string);

    if (res.err) {
      throw new Error(res.err);
    }

    return res;
  };

export function Props(
  node: Node,
  transform = { key: (k: string) => k, value: (k: string) => k }
): Record<string, string> {
  return Object.fromEntries(
    node.name
      .split(",")
      .map((t: string) => {
        const [k, v] = t.split("=").map((s) => s.trim());
        if (k && v) return [transform.key(k), transform.value(v)];
      })
      .filter((t) => !!t) as Iterable<[PropertyKey, string]>
  );
}

export interface ResponseParser {
  (
    text: string | Buffer,
    reviver?: ((this: any, key: string, value: any) => any) | undefined
  ): any;
}
