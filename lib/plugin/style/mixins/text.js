import * as units from "../units.js";
import { parsePaints } from "../properties/paint.js";
export function fontStyle(node) {
    if (node.style?.italic)
        return "italic";
}
export function fontWeight(node) {
    return node.style?.fontWeight;
}
export function fontSize(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.style?.fontSize);
}
export function fontFamily(node) {
    return node.style?.fontFamily;
}
export function lineHeight(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.style?.lineHeightPx);
}
export function textDecoration(node) {
    const TEXT_DECORATION = {
        STRIKETHROUGH: "line-through",
        UNDERLINE: "underline",
    };
    return node.style?.textDecoration
        ? TEXT_DECORATION[node.style?.textDecoration]
        : undefined;
}
export function textAlign(node) {
    const TEXT_ALIGN_HORIZONTAL = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right",
        JUSTIFIED: "justified",
    };
    return TEXT_ALIGN_HORIZONTAL[node.style?.textAlignHorizontal];
}
export function verticalAlign(node) {
    const TEXT_ALIGN_VERTICAL = {
        TOP: "top",
        CENTER: "middle",
        BOTTOM: "bottom",
    };
    return TEXT_ALIGN_VERTICAL[node.style?.textAlignVertical];
}
export function letterSpacing(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.style?.letterSpacing);
}
export function textTransform(node) {
    const TEXT_CASE = {
        UPPER: "uppercase",
        LOWER: "lowercase",
        TITLE: "cappitalize",
        SMALL_CAPS: "lowercase",
        SMALL_CAPS_FORCED: "lowercase",
    };
    return node.style?.textCase ? TEXT_CASE[node.style?.textCase] : undefined;
}
export function textIndent(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.style?.paragraphIndent);
}
export function whiteSpace(node) {
    if (node.style?.textAutoResize && node.style?.textAutoResize === "WIDTH")
        return "nowrap";
}
export function wordBreak(node) {
    if (node.style?.textAutoResize === "HEIGHT")
        return "break-word";
}
export function color(node) {
    return parsePaints(node?.fills);
}
