import { test } from "uvu";
import * as assert from "uvu/assert";
import { Figmatik } from "../src/figmatik.js";
import * as helpers from "./test-helpers.js";

const f = new Figmatik();
let materialFile: Omit<FileApi, "fileKey">;

test.before(async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/files/${helpers.materialFileKey}`,
    200
  );
  materialFile = await f.api.files({ fileKey: helpers.materialFileKey });
});

test("plugin", () => {
  assert.ok((materialFile.document as any).querySelector(".vector").styleMap);
  assert.ok((materialFile.document as any).querySelector(".text").styleMap);
  assert.ok((materialFile.document as any).querySelector(".frame").styleMap);
});
