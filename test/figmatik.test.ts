import { test } from "uvu";
import * as assert from "uvu/assert";
import { Figmatik } from "../src/figmatik.js";

test("Figmatik", () => {
  let f = new Figmatik();
  assert.ok(f.api.files);
  assert.ok(f.api.images);
  assert.ok(f.http.request);
  assert.ok(f.use);
});

test.run();
