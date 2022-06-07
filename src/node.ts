export function walk(node: NodeApi, cb: (node?: NodeApi) => boolean | void) {
  if (cb(node) === true) return;
  if ("children" in node) {
    for (const child of node.children!) {
      walk(child, cb);
    }
  }
}

export function* iterate(node: NodeApi): Generator<any, any, any> {
  if (yield node) return;

  if ("children" in node) {
    for (const child of node.children!) {
      if (yield* iterate(child)) return;
    }
  }
}

export function find(node: NodeApi, pre: (node?: NodeApi) => boolean | void) {
  const queue = [node];
  while (queue.length) {
    let n = queue.shift()!;
    if (pre(n)) return n;
    if (n.children?.length) queue.push(...n.children);
  }
}

export function findAll(
  node: NodeApi,
  pre: (node?: NodeApi) => boolean | void
) {
  const nodes = [];
  const queue = [node];
  while (queue.length) {
    let n = queue.shift()!;
    if (pre(n)) nodes.push(n);
    if (n.children?.length) queue.push(...n.children);
  }
  return nodes;
}

export function ancestors(node: NodeApi): NodeApi[] {
  let nodes = [];
  let parent = (node as any).parent;
  while (parent) {
    nodes.push(parent);
    parent = parent.parent;
  }
  return nodes;
}
