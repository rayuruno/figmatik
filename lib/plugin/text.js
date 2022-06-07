import he from "he";
export default {
    name: "text",
    node(n) {
        if (n?.type == "TEXT") {
            Object.defineProperty(n, "children", {
                value: withChildren(n)?.children,
            });
        }
    },
};
export function getRanges(node) {
    let r = [];
    let p = 0;
    let i = node.characterStyleOverrides[p];
    while (true) {
        let p1 = node.characterStyleOverrides.findIndex((n, x) => x > p && n != i);
        if (p1 > -1) {
            r.push({ s: p, e: p1, i });
        }
        else {
            p1 = node.characterStyleOverrides.lastIndexOf(i);
            if (p1 > -1) {
                r.push({ s: p, e: p1, i });
                i = node.characterStyleOverrides[p1];
                p = p1;
            }
            break;
        }
        i = node.characterStyleOverrides[p1];
        p = p1;
    }
    if (p < node.characters.length) {
        r.push({ s: p, e: node.characters.length, i: 0 });
    }
    return r;
}
export function getSegments(node) {
    let rs = getRanges(node);
    let sl = [];
    rs.forEach((r) => {
        let style = node.styleOverrideTable[r.i];
        let characters = node.characters.slice(r.s, r.e);
        let type = characters === "\n" ? "LINE_BREAK" : style?.hyperlink ? "LINK" : "TXT";
        if (type === "TXT" && characters === "")
            return;
        let children = getVariables(characters);
        sl.push({
            type,
            ...(style ? { style } : null),
            characters: he.encode(characters.trim()),
            ...(children ? { children } : null),
            start: r.s,
            end: r.e,
        });
    });
    return sl;
}
export function getLines(node) {
    let li = node.characters.split("\n");
    let ls = [];
    while (li.length) {
        let i = ls.length;
        let l = li.shift();
        let start = i === 0 ? 0 : ls[i - 1].end;
        let end = start + l.length + 1;
        let type = node.lineTypes[i];
        let indent = node.lineIndentations[i];
        let children = getSegments({
            ...node,
            styleOverrideTable: node.styleOverrideTable,
            characters: node.characters.slice(start, end),
            characterStyleOverrides: node.characterStyleOverrides.slice(start, end),
        });
        ls.push({ type, indent, children, start, end });
    }
    return ls;
}
export function getVariables(text, delimStart = "{{", delimEnd = "}}") {
    let cs = text
        .split(new RegExp(`(${delimStart}.+${delimEnd})`, "g"))
        .map((characters) => ({
        type: characters.startsWith(delimStart) ? "VARIABLE" : "TXT",
        characters: characters
            .replace(delimStart, "")
            .replace(delimEnd, "")
            .trim(),
    }))
        .filter((c) => c.characters);
    if (!cs.find((c) => c.type === "VARIABLE"))
        return;
    return cs;
}
export function withChildren(node) {
    node.children = [];
    let lines = getLines(node);
    let line = lines.shift();
    let current = node;
    while (line) {
        if (line.type === "NONE") {
            current = node;
            current.children.push(Object.defineProperty({ ...line, type: "LINE" }, "parent", {
                value: node,
            }));
            line = lines.shift();
        }
        else {
            // current ||= node;
            if (line.indent !== current.indent) {
                let list = {
                    type: `${line.type}_LIST`,
                    indent: line.indent,
                    children: [],
                    start: line.start,
                    end: line.end,
                };
                addItem(line, list);
                Object.defineProperty(list, "parent", { value: current });
                current.children.push(list);
                current = list;
            }
            else {
                addItem(line, current);
            }
            while (true) {
                let line1 = lines.shift();
                if (!line1) {
                    line = line1;
                    break;
                }
                if (line1.type === "NONE") {
                    line = line1;
                    break;
                }
                if (line1.indent === current.indent) {
                    if (current.type.startsWith(line1.type)) {
                        addItem(line1, current);
                        continue;
                    }
                    else {
                        line = line1;
                        break;
                    }
                }
                if (line1.indent > current.indent) {
                    current = current.children[current.children.length - 1];
                }
                else {
                    while (line1.indent <= current.indent) {
                        current = current.parent;
                    }
                    current = current.children[current.children.length - 1];
                }
                line = line1;
                break;
            }
        }
    }
    return node;
}
function addItem(line, parent) {
    if (!line) {
        console.warn("addItem received null line");
        return;
    }
    let item = {
        indent: line.indent,
        type: `${line.type}_LIST_ITEM`,
        children: line.children.filter((c) => c.type !== "LINE_BREAK"),
    };
    Object.defineProperty(item, "parent", { value: parent });
    parent.children.push(item);
}
