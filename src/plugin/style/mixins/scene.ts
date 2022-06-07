export function display(node: NodeApi<SceneNode>) {
  if ((node as FrameNode).layoutMode) return "flex";
  if (node.visible === false) return "none";
}
