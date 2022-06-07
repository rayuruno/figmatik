import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
} from "../../src/plugin/style/mixins/corner.js";

test("borderRadius", () => {
  assert.is(borderRadius({ cornerRadius: 16 } as any, "pixel"), "16px");
});
test("borderTopLeftRadius", () => {
  assert.is(
    borderTopLeftRadius({
      rectangleCornerRadii: [48, 60.0, 16.0, 16.0],
    } as any),
    "3rem"
  );
});
test("borderTopRightRadius", () => {
  assert.is(
    borderTopRightRadius({
      rectangleCornerRadii: [60.0, 48, 60.0, 16.0],
    } as any),
    "3rem"
  );
});
test("borderBottomRightRadius", () => {
  assert.is(
    borderBottomRightRadius({
      rectangleCornerRadii: [60.0, 60.0, 48, 16.0],
    } as any),
    "3rem"
  );
});
test("borderBottomLeftRadius", () => {
  assert.is(
    borderBottomLeftRadius({
      rectangleCornerRadii: [60.0, 60.0, 16.0, 48],
    } as any),
    "3rem"
  );
});
test.run();
