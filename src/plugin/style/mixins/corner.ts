import * as units from "../units.js";

export function borderRadius(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.cornerRadius);
}

export function borderTopLeftRadius(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.rectangleCornerRadii?.[0]);
}

export function borderTopRightRadius(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.rectangleCornerRadii?.[1]);
}

export function borderBottomRightRadius(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.rectangleCornerRadii?.[2]);
}

export function borderBottomLeftRadius(
  node: NodeApi<FrameNode>,
  unit = units.DEFAULT_UNIT
) {
  return (units as any)[unit](node.rectangleCornerRadii?.[3]);
}
