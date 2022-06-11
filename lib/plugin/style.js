import { kebabCase, only } from "../util.js";
import * as nodes from "./style/nodes/index.js";
import { DEFAULT_UNIT } from "./style/units.js";
const VECTOR_TYPE_RE = /VECTOR|BOOLEAN_OPERATION|STAR|LINE|ELLIPSE|REGULAR_POLYGON|RECTANGLE/;
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
const options = { unit: DEFAULT_UNIT };
export default (opts) => {
    if (opts) {
        options.unit = opts.unit;
    }
    return {
        name: "style",
        node(node) {
            let getter;
            if (node?.type.match(VECTOR_TYPE_RE)) {
                getter = vectorStyle;
            }
            else if (node?.type.match(FRAME_TYPE_RE)) {
                getter = frameStyle;
            }
            else if (node?.type === "TEXT") {
                getter = textStyle;
            }
            else if (node?.type === "GROUP") {
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
                            return Object.fromEntries(Object.entries(styles).map(([name, props]) => {
                                return [name, new StyleMap(only(this.styleMap, ...props))];
                            }));
                        },
                    },
                });
            }
        },
    };
};
export class StyleMap {
    constructor(props) {
        Object.assign(this, props);
    }
    toString() {
        return Object.entries(this)
            .filter(([_, v]) => !!v)
            .map(([k, v]) => `${kebabCase(k)}: ${v};`)
            .join("\n");
    }
}
function frameStyle(node) {
    return new StyleMap(fromEntries(entries(nodes.frame)
        .map(([p, f]) => [p, f(node, options.unit)])
        .filter(([_, v]) => !!v)));
}
function vectorStyle(node) {
    return new StyleMap(fromEntries(entries(nodes.vector)
        .map(([p, f]) => [p, f(node, options.unit)])
        .filter(([_, v]) => !!v)));
}
function textStyle(node) {
    return new StyleMap(fromEntries(entries(nodes.text)
        .map(([p, f]) => [p, f(node, options.unit)])
        .filter(([_, v]) => !!v)));
}
