export function display(node) {
    if (node.layoutMode)
        return "flex";
    if (node.visible === false)
        return "none";
}
