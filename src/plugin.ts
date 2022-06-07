import { Figmatik } from "./figmatik.js";
export { default as export } from "./plugin/export.js";
export { default as selector } from "./plugin/selector.js";
export { default as text } from "./plugin/text.js";
export { default as style } from "./plugin/style.js";

export interface Plugin {
  name: string;
  init?(figmatik: Figmatik): void;
  node?(node: NodeApi): void;
}
