import { test } from "uvu";
import * as assert from "uvu/assert";
import * as parser from "../src/parser.js";
import * as helpers from "./test-helpers.js";

test("File", async () => {
  assert.ok(
    parser.File(
      (await helpers.response(
        "httpsapifigmacomv1filesKObTiYNzH7zah3VSknbeki"
      )) as any
    )
  );
});
test("Images", async () => {
  assert.ok(
    parser.Images(
      (await helpers.response(
        "httpsapifigmacomv1imagesKObTiYNzH7zah3VSknbekiids163A126formatjpg"
      )) as any
    )
  );
});
test("Props", async () => {
  let props = parser.Props({
    name: "key=value, another key = ANother 1?? /'=~~!value",
  } as any);
  assert.equal(props, { "key": "value", "another key": "ANother 1?? /'" });
});

test.run();
