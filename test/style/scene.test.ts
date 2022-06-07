import { test } from "uvu";
import * as assert from "uvu/assert";
import { display } from "../../src/plugin/style/mixins/scene.js";

test("display", () => {
  assert.is(display({ visible: false } as any), "none");
});

test.run();
