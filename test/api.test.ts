import { test } from "uvu";
import * as assert from "uvu/assert";
import * as api from "../src/api.js";
import * as helpers from "./test-helpers.js";

test("Files", async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/files/${helpers.contentFileKey}?version=${helpers.contentFileVersion}`,
    200
  );

  const endpoint = api.Files();

  const file = await endpoint({
    fileKey: helpers.contentFileKey,
    version: helpers.contentFileVersion,
  });

  assert.ok(file);
});

test("Images", async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/images/${helpers.contentFileKey}?ids=16%3A126&format=jpg`,
    200
  );

  const endpoint = api.Images();

  const images = await endpoint({
    fileKey: helpers.contentFileKey,
    ids: ["16:126"],
    format: "jpg",
  });

  assert.ok(images);
});

test("Endpoint", async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/styles/8b5620bd5810095da6278c1cde5b4a6a71642e16`,
    200
  );
  let endpoint = api.Endpoint("/v1/styles/:styleKey");
  let style = await endpoint({
    styleKey: "8b5620bd5810095da6278c1cde5b4a6a71642e16",
  });
  assert.ok(style);
});

test.run();
