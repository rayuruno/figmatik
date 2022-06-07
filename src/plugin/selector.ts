import { replaceNonWord } from "../util.js";
import * as parser from "../parser.js";
import SelectorParser from "postcss-selector-parser";

const processor = SelectorParser();
const { defineProperties, assign } = Object;

export default {
  name: "selector",

  node(n: NodeApi) {
    defineProperties(n, {
      tag: { value: replaceNonWord(n.name) },
      class: { value: replaceNonWord(n.type) },
      attrs: {
        value: {
          ...parser.Props(n, {
            key: (k) => replaceNonWord(k),
            value: (k) => k,
          }),
        },
      },
    });

    assign(n, {
      match: match.bind(null, n),
      querySelector: querySelector.bind(null, n),
      $: querySelector.bind(null, n),
      querySelectorAll: querySelectorAll.bind(null, n),
      $$: querySelectorAll.bind(null, n),
    });
  },
};

export function querySelector(
  node: NodeApi,
  selector: string
): NodeApi | undefined {
  const selectors = parseSelector(selector);
  let currentNode: NodeApi | undefined = node;

  for (const { scope, query } of selectors) {
    switch (scope) {
      case "subtree": {
        currentNode = currentNode?.find((c: any) => match(c, query));
        break;
      }
      case "children": {
        currentNode = currentNode?.children?.find((child) =>
          match(child, query)
        );
        break;
      }
      case "adjacent": {
        let adjacentNode =
          currentNode && currentNode.parent?.children[currentNode.index + 1];
        if (match(adjacentNode, query)) {
          currentNode = adjacentNode;
        }
        break;
      }
      case "siblings": {
        currentNode = currentNode?.parent?.children.find(
          (child) => child !== currentNode && match(child, query)
        );
        break;
      }
    }
    if (!currentNode) return;
  }

  return currentNode;
}

export function querySelectorAll(node: NodeApi, selector: string): NodeApi[] {
  const selectors = parseSelector(selector);
  let nodes: NodeApi[] = [node];

  for (const { scope, query } of selectors) {
    switch (scope) {
      case "subtree": {
        nodes = nodes
          .map((node) => node.findAll((child) => match(child, query)))
          .flat();
        break;
      }

      case "children": {
        nodes = nodes
          .map((node) => node.children?.filter((child) => match(child, query)))
          .flat();
        break;
      }

      case "adjacent": {
        nodes = nodes
          .map((node) => {
            let adjacentNode = node.parent?.children[node.index + 1];
            if (adjacentNode && match(adjacentNode, query))
              return [adjacentNode];
          })
          .flat()
          .filter((n) => !!n) as NodeApi[];
        break;
      }

      case "siblings": {
        nodes = nodes
          .map((node) =>
            node.parent?.children.filter(
              (child) => child !== node && match(child, query)
            )
          )
          .flat();
        break;
      }
    }
  }

  return nodes;
}

export function parseSelector(selectorText: string): QuerySelector[] {
  const root = processor.astSync(selectorText);
  const selectors: QuerySelector[] = [];
  let scope: QuerySelector["scope"] = "subtree";
  let query: Query | undefined;
  for (const node of root.nodes[0].nodes) {
    switch (node.type) {
      case "attribute": {
        query ||= {};
        if (node.attribute.startsWith("@")) {
          query[replaceNonWord(node.attribute.substring(1), "")] = [
            node.operator!,
            node.attribute === "@id"
              ? node.value!
              : replaceNonWord(node.value!, ""),
          ];
        } else {
          query.attrs ||= {};
          (query.attrs as Record<string, [Operator, string]>)[
            replaceNonWord(node.attribute, "")
          ] = [node.operator!, replaceNonWord(node.value!, "")];
        }
        break;
      }

      case "combinator": {
        if (scope && query) {
          selectors.push({ scope, query });
          query = undefined;
        }

        switch (node.value) {
          case " ": {
            scope = "subtree";
            break;
          }
          case ">": {
            scope = "children";
            break;
          }
          case "+": {
            scope = "adjacent";
            break;
          }
          case "~": {
            scope = "siblings";
            break;
          }
          default: {
            throw new Error(`unsupported combinator ${node.value}`);
          }
        }

        break;
      }

      case "id": {
        query ||= {};
        query.id = ["=", node.value];
        break;
      }

      case "pseudo": {
        query ||= {};
        // hack for figma id pattern (1:2) which gets parsed as pseudo
        if (node.parent?.at(node.parent.index(node) - 1)?.type === "id") {
          query.id[1] += node.value;
        } else {
          query.attrs ||= {};
          (query.attrs as Record<string, [Operator, string]>).state = [
            "=",
            replaceNonWord(node.value.substring(1), ""),
          ];
        }
        break;
      }

      case "class": {
        query ||= {};
        query.class = ["=", replaceNonWord(node.value, "")];
        break;
      }

      case "tag": {
        query ||= {};
        query.tag = ["=", replaceNonWord(node.value, "")];
        break;
      }
    }
  }
  if (query && scope) {
    selectors.push({ scope, query });
  }
  return selectors;
}

export function match(data: any, query: Query): boolean {
  for (let [k, q] of Object.entries(query)) {
    if (typeof data[k] === "undefined") {
      return false;
    }

    if (!Array.isArray(q)) {
      if (typeof q === "object" && q !== null) {
        return match(data[k], q);
      } else {
        throw new Error(`invalid query ${JSON.stringify(query)}`);
      }
    }

    const [o, v] = q;
    const vi = replaceNonWord(v, "");
    const d = data[k].toString();
    const di = replaceNonWord(d, "");
    switch (o) {
      case "=": {
        if (di != vi) {
          return false;
        }
        break;
      }
      case "~=": {
        if (
          !d
            .split(" ")
            .map((s: string) => replaceNonWord(s.trim()))
            .includes(vi)
        ) {
          return false;
        }
        break;
      }
      case "|=": {
        if (!replaceNonWord(d.split("-").shift(), "").startsWith(vi)) {
          return false;
        }
        break;
      }
      case "^=": {
        if (!di.startsWith(vi)) {
          return false;
        }
        break;
      }
      case "$=": {
        if (!di.endsWith(vi)) {
          return false;
        }
        break;
      }
      case "*=": {
        if (!di.match(vi)) {
          return false;
        }
        break;
      }
      case "!=": {
        if (di.match(vi)) {
          return false;
        }
        break;
      }
    }
  }
  return true;
}

export type Operator = "=" | "~=" | "|=" | "^=" | "$=" | "*=" | "!=";

export type Query = {
  [index: string]: [Operator, string] | Record<string, [Operator, string]>;
};

export type QuerySelector = {
  scope: "subtree" | "children" | "adjacent" | "siblings";
  query: Query;
};

declare module "../figmatik" {
  interface NodeApi {
    attrs: Record<string, string>;
    match(query: Query): boolean;
    querySelector(selector: string): NodeApi | undefined;
    querySelectorAll(selector: string): NodeApi[];
  }
}
