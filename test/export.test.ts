import { test } from "uvu";
import * as assert from "uvu/assert";
import { Figmatik } from "../src/figmatik.js";
import * as helpers from "./test-helpers.js";

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

test("export", async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/images/${helpers.contentFileKey}?ids=16%3A126&format=jpg&scale=1`,
    200
  );
  await helpers.mock(
    "https://api.figma.com",
    `/v1/images/${helpers.contentFileKey}?ids=16%3A126&format=png&scale=1`,
    200
  );
  await helpers.mock(
    "https://figma-alpha-api.s3.us-west-2.amazonaws.com",
    "/images/4f41ba77-f858-4f15-bfcf-e248bffee726",
    200
  );

  let res = await f.export(
    contentFile.document.findAll((n) => n?.id === "16:126"),
    [
      {},
      {
        format: "png",
      },
    ]
  );
  assert.is(res[0].node.id, "16:126");
  assert.is(res[0].format, "jpg");
  assert.instance(res[0].buffer, Buffer);
  assert.is(res[1].node.id, "16:126");
  assert.is(res[1].format, "png");
  assert.instance(res[1].buffer, Buffer);
});

test.run();
