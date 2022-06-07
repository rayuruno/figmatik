import { test } from "uvu";
import * as assert from "uvu/assert";
import * as parser from "../src/parser.js";
import * as node from "../src/node.js";
import * as helpers from "./test-helpers.js";

let bench = {};

let contentFile: Omit<FileApi, "fileKey">;
let materialFile: Omit<FileApi, "fileKey">;

test.before(async () => {
  contentFile = parser.File()(
    (await helpers.response(
      "httpsapifigmacomv1filesKObTiYNzH7zah3VSknbeki"
    )) as any
  );
  materialFile = parser.File()(
    (await helpers.response(
      "httpsapifigmacomv1filesZsaaakKEgys8zPMBaUbFz3"
    )) as any
  );
});

test.after(() => {
  console.log("bench", bench);
});

test("walk", async () => {
  let count = 0;
  //@ts-ignore
  let t = performance.now();
  node.walk(contentFile.document, () => {
    count++;
  });
  // @ts-ignore
  bench.walk = performance.now() - t;
  assert.is(count, 42);
});

test("iterate", async () => {
  let count = 0;
  //@ts-ignore
  let t = performance.now();
  for (const _n of node.iterate(contentFile.document)) count++;
  // @ts-ignore
  bench.iterate = performance.now() - t;
  assert.is(count, 42);
});

test("find", async () => {
  //@ts-ignore
  let t = performance.now();
  let found = node.find(contentFile.document, (n: any) => {
    return (
      n.styleOverrideTable?.["2"]?.hyperlink?.url === "https://onuruyar.com"
    );
  });
  // @ts-ignore
  bench.find = performance.now() - t;
  assert.ok(found);
});

test("findAll", async () => {
  //@ts-ignore
  let t = performance.now();
  let found = node.findAll(materialFile.document, (n: any) => {
    return n.type === "COMPONENT";
  });
  // @ts-ignore
  bench.findAll = performance.now() - t;
  assert.ok(found);
});

test("ancestors", async () => {
  let found = node.find(contentFile.document, (n: any) => {
    return n.id === "16:126";
  });
  //@ts-ignore
  let t = performance.now();
  let ans = node.ancestors(found!);
  // @ts-ignore
  bench.ancestors = performance.now() - t;
  assert.ok(found);
  assert.ok(ans?.length);
});

test("props", async () => {
  //@ts-ignore
  let t = performance.now();
  let props: any = {};
  node.walk(materialFile.document, (n) => {
    if (n) props[n.id!] = parser.Props(n as NodeApi);
  });
  // @ts-ignore
  bench.props = performance.now() - t;
  assert.equal(props["51006:9788"], {
    "Style": "outlined",
    "Lines": "single-line",
    "Leading icon": "true",
    "Text configurations": "label-text",
    "State": "error",
  });
});

test.run();
