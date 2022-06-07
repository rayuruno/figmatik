import * as units from "../units.js";
import { isNumber } from "../../../util.js";
export function position(node) {
    if (node?.layoutAlign)
        return;
    if (node?.isFixed)
        return "fixed";
    if (node?.parent?.type === "CANVAS")
        return "relative";
    if (node?.parent?.layoutMode)
        return;
    return "absolute";
}
export function flex(node) {
    if (node?.layoutAlign === "INHERIT") {
        return flex(node.parent);
    }
    if (node?.layoutAlign === "STRETCH" || node?.layoutGrow) {
        return "auto";
    }
}
export function flexGrow(node) {
    return node?.layoutGrow;
}
export function width(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.absoluteBoundingBox?.width || undefined);
}
export function height(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.absoluteBoundingBox?.height || undefined);
}
export function left(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.relativeTransform
        ? node.relativeTransform[0][2]
        : node.absoluteBoundingBox?.x);
}
export function top(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.relativeTransform
        ? node.relativeTransform[1][2]
        : node.absoluteBoundingBox?.y);
}
export function right(node, unit = units.DEFAULT_UNIT) {
    if (!node.parent)
        return;
    const pw = width(node.parent, "unitless");
    const nl = left(node, "unitless");
    const nw = width(node, "unitless");
    if (!isNumber(pw) || !isNumber(nl) || !isNumber(nw))
        return;
    return units[unit](pw - nl - nw);
}
export function bottom(node, unit = units.DEFAULT_UNIT) {
    if (!node.parent)
        return;
    const ph = height(node.parent, "unitless");
    const nt = top(node, "unitless");
    const nh = height(node, "unitless");
    if (!isNumber(ph) || !isNumber(nt) || !isNumber(nh))
        return;
    return units[unit](ph - nt - nh);
}
