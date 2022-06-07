import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseColor } from "../../src/plugin/style/properties/color.js";

test("parseColor", async () => {
  assert.is(
    parseColor({ r: 0.5, g: 0.5, b: 0.5, a: 0.5 }, 0.5),
    "rgba(127, 127, 127, 0.25)"
  );
});

test.run();
