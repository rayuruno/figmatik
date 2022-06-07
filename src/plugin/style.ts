import { kebabCase, only } from "../util.js";
import * as nodes from "./style/nodes/index.js";

const VECTOR_TYPE_RE =
  /VECTOR|BOOLEAN_OPERATION|STAR|LINE|ELLIPSE|REGULAR_POLYGON|RECTANGLE/;

const FRAME_TYPE_RE = /FRAME|COMPONENT|COMPONENT_SET|INSTANCE/;

const { defineProperties, fromEntries, entries } = Object;

const styles = {
  position: ["top", "right", "bottom", "left"],
  size: ["width", "height"],
  shape: ["borderRadius"],
  border: ["border"],
  background: ["background", "backgroundColor"],
  color: ["color", "fill", "stroke"],
  blend: ["filter", "opacity"],
  frame: [
    "padding",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "overflow",
    "contain",
  ],
  text: [
    "fontStyle",
    "fontWeight",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "textDecoration",
    "textAlign",
    "verticalAlign",
    "letterSpacing",
    "textTransform",
    "textIndent",
    "whiteSpace",
    "wordBreak",
  ],
};

export default {
  name: "style",

  node(node: NodeApi) {
    let getter: any;
    if (node?.type.match(VECTOR_TYPE_RE)) {
      getter = vectorStyle;
    } else if (node?.type.match(FRAME_TYPE_RE)) {
      getter = frameStyle;
    } else if (node?.type === "TEXT") {
      getter = textStyle;
    } else if (node?.type === "GROUP") {
      getter = frameStyle;
    }
    if (getter !== undefined) {
      defineProperties(node, {
        styleMap: {
          get() {
            return getter(node);
          },
        },
        styles: {
          get() {
            return Object.fromEntries(
              Object.entries(styles).map(([name, props]) => {
                return [name, new StyleMap(only(this.styleMap, ...props))];
              })
            );
          },
        },
      });
    }
  },
};

export class StyleMap {
  constructor(props: Record<string, string | number>) {
    Object.assign(this, props);
  }
  toString() {
    return Object.entries(this)
      .filter(([_, v]) => !!v)
      .map(([k, v]) => `${kebabCase(k)}: ${v};`)
      .join("\n");
  }
}

function frameStyle(node: NodeApi): StyleMap {
  return new StyleMap(
    fromEntries(
      entries(nodes.frame)
        .map(([p, f]) => [p, f(node as NodeApi<FrameNode>)])
        .filter(([_, v]) => !!v)
    )
  );
}

function vectorStyle(node: NodeApi): StyleMap {
  return new StyleMap(
    fromEntries(
      entries(nodes.vector)
        .map(([p, f]) => [p, f(node as NodeApi<VectorNode>)])
        .filter(([_, v]) => !!v)
    )
  );
}

function textStyle(node: NodeApi): StyleMap {
  return new StyleMap(
    fromEntries(
      entries(nodes.text)
        .map(([p, f]) => [p, f(node as NodeApi<TextNode>)])
        .filter(([_, v]) => !!v)
    )
  );
}

declare module "../figmatik" {
  interface NodeApi {
    styleMap: StyleMap;
  }
}
