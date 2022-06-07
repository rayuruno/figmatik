import * as units from "../units.js";
import { parseColor } from "../properties/color.js";
export function filter(node) {
    if (!node.effects)
        return;
    const filter = [];
    for (const effect of node.effects) {
        if (effect.visible === false)
            continue;
        switch (effect.type) {
            case "DROP_SHADOW":
                filter.push(dropShadow(effect));
                break;
            case "LAYER_BLUR":
                filter.push(layerBlur(effect));
                break;
        }
    }
    return filter.join(" ");
}
export function opacity(node) {
    return node.opacity;
}
function dropShadow({ offset: { x, y }, radius, color }, unit = "pixel") {
    return filterFunction("drop-shadow", [
        units[unit](x),
        units[unit](y),
        units[unit](radius),
        parseColor(color),
    ]);
}
function layerBlur({ radius }, unit = "pixel") {
    return filterFunction("blur", [units[unit](radius)]);
}
function filterFunction(name, variables) {
    return name + "(" + variables.join(" ") + ")";
}
