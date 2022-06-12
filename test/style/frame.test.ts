import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  flexDirection,
  justifyContent,
  alignItems,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  gap,
  overflow,
  contain,
  verticalAlign,
  background,
  backgroundColor,
  border,
  borderWidth,
  borderStyle,
  borderColor,
} from "../../src/plugin/style/mixins/frame.js";

test("flexDirection", () => {
  assert.is(flexDirection({ layoutMode: "VERTICAL" } as any), "column");
});
test("justifyContent", () => {
  // assert.is(justifyContent({ layoutMode: "VERTICAL", counterAxisAlignItems: "MAX" }), "flex-end");
  assert.is(
    justifyContent({
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
    } as any),
    "center"
  );
});
test("alignItems", () => {
  assert.is(
    alignItems({ layoutMode: "VERTICAL", counterAxisAlignItems: "MAX" } as any),
    "flex-end"
  );
  // assert.is(alignItems({ layoutMode: "HORIZONTAL", counterAxisAlignItems: "SPACE_BETWEEN" }), "space-between");
});
test("padding", () => {
  assert.is(
    padding({
      paddingLeft: 16,
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
    } as any),
    "1rem"
  );
  assert.is(
    padding({
      paddingLeft: 16,
      paddingTop: 8,
      paddingRight: 16,
      paddingBottom: 8,
    } as any),
    "0.5rem 1rem"
  );
});
test("paddingTop", () => {
  assert.is(paddingTop({ paddingTop: 16 } as any), "1rem");
});
test("paddingRight", () => {
  assert.is(paddingRight({ paddingRight: 16 } as any), "1rem");
});
test("paddingBottom", () => {
  assert.is(paddingBottom({ paddingBottom: 16 } as any), "1rem");
});
test("paddingLeft", () => {
  assert.is(paddingLeft({ paddingLeft: 16 } as any), "1rem");
});
test("gap", () => {
  assert.is(gap({ itemSpacing: 16 } as any), "1rem");
});
test("overflow", () => {
  assert.is(overflow({ clipsContent: true } as any), "hidden");
});
test("contain", () => {
  assert.is(contain({ clipsContent: true } as any), "content");
});
test("verticalAlign", () => {
  assert.is(
    verticalAlign({ constraints: { vertical: "CENTER" } } as any),
    "middle"
  );
});
test("background", () => {
  assert.is(
    background({
      fills: [
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
      ],
    } as any),
    undefined
  );
  assert.is(
    background({
      fills: [
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 0.4, b: 0.4, a: 1 } },
      ],
    } as any),
    "linear-gradient(rgba(0, 102, 102, 0.40),rgba(0, 102, 102, 0.40)), linear-gradient(rgba(0, 255, 255, 0.40),rgba(0, 255, 255, 0.40))"
  );
});
test("backgroundColor", () => {
  assert.is(
    backgroundColor({
      fills: [
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
      ],
    } as any),
    "rgba(0, 255, 255, 0.40)"
  );
});
test("borderWidth", () => {
  assert.is(
    borderWidth(
      {
        strokeWeight: 2,
        strokes: [
          { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
        ],
      } as any,
      "pixel"
    ),
    "2px"
  );
});
test("borderStyle", () => {
  assert.is(
    borderStyle({
      strokeWeight: 2,
      strokes: [
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
      ],
    } as any),
    "solid"
  );
});
test("borderColor", () => {
  assert.is(
    borderColor({
      strokeWeight: 2,
      strokes: [
        { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
      ],
    } as any),
    "rgba(0, 255, 255, 0.40)"
  );
});
test("border", () => {
  assert.is(
    border(
      {
        strokeWeight: 2,
        strokes: [
          { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
        ],
      } as any,
      "pixel"
    ),
    "2px solid rgba(0, 255, 255, 0.40)"
  );
});

test.run();
