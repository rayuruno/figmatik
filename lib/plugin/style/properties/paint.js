import { parseColor } from "./color.js";
export function parsePaints(paints = []) {
    if (!paints)
        return;
    if (paints.length === 1) {
        return parsePaint(paints[0]);
    }
    return paints
        .map((p) => {
        return p.type === "SOLID" ? parseSolidAsLinearGradient(p) : parsePaint(p);
    })
        .filter((s) => !!s)
        .reverse()
        .join(", ");
}
export function parsePaint(paint) {
    if (!paint)
        return;
    if (paint.visible === false) {
        return;
    }
    switch (paint.type) {
        case "SOLID":
            return parseSolid(paint);
        case "GRADIENT_LINEAR":
            return parseLinearGradient(paint);
        case "GRADIENT_RADIAL":
            return parseRadialGradient(paint);
        case "GRADIENT_ANGULAR":
        case "GRADIENT_DIAMOND":
        case "IMAGE":
        case "EMOJI":
        // console.warn(paint.type + " not implemented");
    }
}
export function parseSolid(paint) {
    if (!paint || paint.visible === false)
        return;
    let { color, opacity } = paint || {};
    if (color) {
        let { r, g, b, a } = color;
        if (typeof opacity !== "undefined")
            a *= opacity;
        return parseColor({ r, g, b, a });
    }
    return "";
}
export function parseSolidAsLinearGradient(paint) {
    if (!paint || paint.visible === false)
        return;
    return `linear-gradient(${parseColor(paint.color, paint.opacity)},${parseColor(paint.color, paint.opacity)})`;
}
export function parseLinearGradient(paint) {
    if (!paint || paint.visible === false)
        return;
    const handles = paint.gradientHandlePositions;
    const handle0 = handles[0];
    const handle1 = handles[1];
    const ydiff = handle1.y - handle0.y;
    const xdiff = handle0.x - handle1.x;
    const angle = Math.atan2(-xdiff, -ydiff);
    const stops = paint.gradientStops
        .map((stop) => {
        return `${parseColor(stop.color, paint.opacity)} ${Math.round(stop.position * 100)}%`;
    })
        .join(", ");
    return `linear-gradient(${angle}rad, ${stops})`;
}
export function parseRadialGradient(paint) {
    if (!paint || paint.visible === false)
        return;
    const stops = paint.gradientStops
        .map((stop) => {
        return `${parseColor(stop.color, paint.opacity)} ${Math.round(stop.position * 100)}%`;
    })
        .join(", ");
    return `radial-gradient(${stops})`;
}
