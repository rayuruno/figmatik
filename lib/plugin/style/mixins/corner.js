import * as units from "../units.js";
export function borderRadius(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.cornerRadius);
}
export function borderTopLeftRadius(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.rectangleCornerRadii?.[0]);
}
export function borderTopRightRadius(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.rectangleCornerRadii?.[1]);
}
export function borderBottomRightRadius(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.rectangleCornerRadii?.[2]);
}
export function borderBottomLeftRadius(node, unit = units.DEFAULT_UNIT) {
    return units[unit](node.rectangleCornerRadii?.[3]);
}
