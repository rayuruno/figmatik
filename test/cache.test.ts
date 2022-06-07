import { test } from "uvu";
import * as assert from "uvu/assert";
import * as cache from "../src/cache.js";

const fileCache = new cache.FileCache();
const testUrl =
  "https://api.figma.com/v1/files/KObTiYNzH7zah3VSknbeki?version=123&nodes=16%3A126&geometry=paths";

test("api", async () => {
  let filepath = fileCache.filepath(testUrl);
  assert.ok(filepath);
  assert.ok(filepath.endsWith("e33057d7061dd8ff77f7c3194084d1f2"));

  assert.not.ok(await fileCache.exists(testUrl));
  await fileCache.write(testUrl, "test");
  assert.ok(await fileCache.exists(testUrl));
  assert.ok(await fileCache.read(testUrl));

  try {
    await fileCache.delete(testUrl);
  } catch (err) {
    assert.not.ok(err);
  }
});

test.run();
