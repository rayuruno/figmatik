import { test } from "uvu";
import * as assert from "uvu/assert";
import { Figmatik } from "../src/figmatik.js";
import * as text from "../src/plugin/text.js";
import * as helpers from "./test-helpers.js";
import { readFile } from "fs/promises";

const f = new Figmatik();
let contentFile: Omit<FileApi, "fileKey">;

test.before(async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/files/${helpers.contentFileKey}`,
    200
  );
  contentFile = await f.api.files({ fileKey: helpers.contentFileKey });
});

test("variables", () => {
  let node = (contentFile.document as any).querySelector(
    "[@name*='interpolate']"
  ) as NodeApi<TextNode>;

  assert.equal(text.withChildren(node).children, [
    {
      type: "LINE",
      indent: 0,
      children: [
        {
          type: "TXT",
          characters: "this has {{placeholder}}",
          children: [
            { type: "TXT", characters: "this has" },
            { type: "VARIABLE", characters: "placeholder" },
          ],
          start: 0,
          end: 24,
        },
      ],
      start: 0,
      end: 25,
    },
  ]);
});

test("deep list and links", async () => {
  let node = (contentFile.document as any).querySelector(
    "[@name*='deep']"
  ) as NodeApi<TextNode>;

  assert.equal(
    text.withChildren(node).children,
    JSON.parse(await readFile("test/fixtures/text.json", "utf8"))
  );
});

test.run();
