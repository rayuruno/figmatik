import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  border,
  borderWidth,
  borderStyle,
  borderColor,
} from "../../src/plugin/style/mixins/border.js";

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
