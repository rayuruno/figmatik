import * as units from "../units.js";
import { parseColor } from "../properties/color.js";

export function filter(node: NodeApi<FrameNode | VectorNode | TextNode>) {
  if (!node.effects) return;

  const filter = [];

  for (const effect of node.effects) {
    if (effect.visible === false) continue;

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

export function opacity(node: NodeApi<FrameNode | VectorNode | TextNode>) {
  return node.opacity;
}

function dropShadow(
  { offset: { x, y }, radius, color }: Effect,
  unit = "pixel"
) {
  return filterFunction("drop-shadow", [
    (units as any)[unit](x),
    (units as any)[unit](y),
    (units as any)[unit](radius),
    parseColor(color),
  ]);
}

function layerBlur({ radius }: Effect, unit = "pixel") {
  return filterFunction("blur", [(units as any)[unit](radius)]);
}

function filterFunction(name: string, variables: string[]) {
  return name + "(" + variables.join(" ") + ")";
}
