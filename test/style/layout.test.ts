import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  flex,
  flexGrow,
  width,
  height,
  left,
  top,
  right,
  bottom,
} from "../../src/plugin/style/mixins/layout.js";

const absoluteBoundingBox = { x: 120.0, y: 121.0, width: 300.0, height: 301.0 };
const relativeTransform = [
  [1.0, 0.0, 100.0703125],
  [0.0, 1.0, 100.0703125],
];

test("flex", () => {
  assert.is(flex({ layoutAlign: "STRETCH" } as any), "auto");
});
test("flexGrow", () => {
  assert.is(flexGrow({ layoutGrow: 1 } as any), 1);
});
test("width", () => {
  assert.is(width({ absoluteBoundingBox } as any, "pixel"), "300px");
});
test("height", () => {
  assert.is(height({ absoluteBoundingBox } as any, "pixel"), "301px");
});
test("left", () => {
  assert.is(
    left({
      relativeTransform,
      absoluteBoundingBox,
    } as any),
    "6.25rem"
  );
});
test("top", () => {
  assert.is(top({ absoluteBoundingBox } as any, "pixel"), "121px");
});
test("right", () => {
  assert.is(
    right(
      {
        parent: {
          absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 200 },
        },
        relativeTransform: [[0, 0, 100], 0, 0, 100],
        absoluteBoundingBox: { x: 0, y: 0, width: 10, height: 10 },
      } as any,
      "pixel"
    ),
    "90px"
  );
});
test("bottom", () => {
  assert.is(
    bottom(
      {
        absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 200 },
        parent: {
          relativeTransform: [[0, 0, 100], 0, 0, 100],
          absoluteBoundingBox: { x: 0, y: 0, width: 600, height: 600 },
        },
      } as any,
      "pixel"
    ),
    "400px"
  );
});

test.run();
