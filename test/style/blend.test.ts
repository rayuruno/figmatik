import { test } from "uvu";
import * as assert from "uvu/assert";
import { filter, opacity } from "../../src/plugin/style/mixins/blend.js";

test("filter", async () => {
  assert.is(
    filter({
      effects: [
        {
          type: "DROP_SHADOW",
          visible: true,
          color: { r: 0.0, g: 0.0, b: 0.0, a: 0.15000000596046448 },
          blendMode: "NORMAL",
          offset: { x: 0.0, y: 1.0 },
          radius: 3.0,
          spread: 1.0,
          showShadowBehindNode: true,
        },
        {
          type: "DROP_SHADOW",
          visible: true,
          color: { r: 0.0, g: 0.0, b: 0.0, a: 0.30000001192092896 },
          blendMode: "NORMAL",
          offset: { x: 0.0, y: 1.0 },
          radius: 2.0,
          showShadowBehindNode: true,
        },
      ],
    } as any),
    "drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.15)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.30))"
  );
});

test("opacity", async () => {
  assert.is(opacity({ opacity: 0 } as any), 0);
});

test.run();
