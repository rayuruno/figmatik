import * as node from "./node.js";
const NODE_TYPE_RE = /CONNECTOR|DOCUMENT|CANVAS|FRAME|GROUP|VECTOR|BOOLEAN_OPERATION|STAR|LINE|ELLIPSE|REGULAR_POLYGON|RECTANGLE|TEXT|SLICE|COMPONENT|COMPONENT_SET|INSTANCE|STICKY|SHAPE_WITH_TEXT/;
export const File = (config) => function filesParser(input) {
    let file;
    file = JSON.parse(input, function fileVisitor(key, value) {
        if (key === "children") {
            value.forEach((child, index) => {
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
    });
    return file;
};
export const Images = (_config) => function imagesParser(input) {
    let res = JSON.parse(input);
    if (res.err) {
        throw new Error(res.err);
    }
    return res;
};
export function Props(node, transform = { key: (k) => k, value: (k) => k }) {
    return Object.fromEntries(node.name
        .split(",")
        .map((t) => {
        const [k, v] = t.split("=").map((s) => s.trim());
        if (k && v)
            return [transform.key(k), transform.value(v)];
    })
        .filter((t) => !!t));
}
