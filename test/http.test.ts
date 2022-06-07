import { test } from "uvu";
import * as assert from "uvu/assert";
import * as http from "../src/http.js";
import * as helpers from "./test-helpers.js";

test("queryString", async () => {
  assert.is(http.queryString({ empty: null, un: undefined }), "");
  assert.is(http.queryString({ empty: null, un: undefined, ok: 1 }), "?ok=1");
});

test("Request url", async () => {
  await helpers.mock("https://figma.com", `/`, 200);
  let request = http.Request();
  assert.ok(await request(new URL("https://figma.com")));
});

test("Request options", async () => {
  await helpers.mock("https://figma.com", `/`, 200);
  let request = http.Request();
  assert.ok(
    await request({
      port: 443,
      host: "www.figma.com",
      path: "/",
      headers: { "X-FIGMA-TOKEN": process.env.FIGMA_TOKEN },
    })
  );
});

test.run();
