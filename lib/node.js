export function walk(node, cb) {
    if (cb(node) === true)
        return;
    if ("children" in node) {
        for (const child of node.children) {
            walk(child, cb);
        }
    }
}
export function* iterate(node) {
    if (yield node)
        return;
    if ("children" in node) {
        for (const child of node.children) {
            if (yield* iterate(child))
                return;
        }
    }
}
export function find(node, pre) {
    const queue = [node];
    while (queue.length) {
        let n = queue.shift();
        if (pre(n))
            return n;
        if (n.children?.length)
            queue.push(...n.children);
    }
}
export function findAll(node, pre) {
    const nodes = [];
    const queue = [node];
    while (queue.length) {
        let n = queue.shift();
        if (pre(n))
            nodes.push(n);
        if (n.children?.length)
            queue.push(...n.children);
    }
    return nodes;
}
export function ancestors(node) {
    let nodes = [];
    let parent = node.parent;
    while (parent) {
        nodes.push(parent);
        parent = parent.parent;
    }
    return nodes;
}
