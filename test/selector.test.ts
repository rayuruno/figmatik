import { test } from "uvu";
import * as assert from "uvu/assert";
import { Figmatik } from "../src/figmatik.js";
import {
  match,
  querySelector,
  querySelectorAll,
  parseSelector,
} from "../src/plugin/selector.js";
import * as helpers from "./test-helpers.js";

const f = new Figmatik();
let materialFile: Omit<FileApi, "fileKey">;

const before = async () => {
  await helpers.mock(
    "https://api.figma.com",
    `/v1/files/${helpers.materialFileKey}`,
    200
  );
  materialFile = await f.api.files({ fileKey: helpers.materialFileKey });
};

test.before(async () => await before());

test("match =", async () => {
  // await before();
  assert.ok(match({ name: "Document" }, { name: ["=", "document"] }));
  assert.not.ok(match({ name: "Document" }, { name: ["=", "doc"] }));
});
test("match ~=", async () => {
  // await before();
  assert.ok(
    match({ name: "banana apple orange" }, { name: ["~=", "Banana "] })
  );
  assert.not.ok(
    match({ name: "banana apple orange" }, { name: ["~=", "apple orange"] })
  );
});
test("match |=", async () => {
  // await before();
  assert.ok(match({ lang: "en-GB" }, { lang: ["|=", "en"] }));
  assert.not.ok(match({ lang: "en-GB" }, { lang: ["|=", "GB"] }));
});
test("match ^=", async () => {
  // await before();
  assert.ok(match({ name: "Icon/panic_24px" }, { name: ["^=", "icon"] }));
  assert.not.ok(match({ name: "Icon/panic_24px" }, { name: ["^=", "Icons"] }));
});
test("match $=", async () => {
  // await before();
  assert.ok(match({ name: "Icon/panic_24px" }, { name: ["$=", "24px"] }));
  assert.not.ok(match({ name: "Icon/panic_24px" }, { name: ["$=", "24"] }));
});
test("match *=", async () => {
  // await before();
  assert.ok(match({ name: "Icon/panic_24px" }, { name: ["*=", "ico"] }));
  assert.not.ok(match({ name: "Icon/panic_24px" }, { name: ["*=", "cono"] }));
});
test("match !=", async () => {
  // await before();
  assert.ok(match({ name: "Document" }, { name: ["!=", "page"] }));
  assert.not.ok(match({ name: "Document" }, { name: ["!=", "Document"] }));
});

test("parse class", async () => {
  // await before();
  assert.equal(
    [{ scope: "subtree", query: { class: ["=", "componentset"] } }],
    parseSelector(".component-set")
  );
  assert.equal(
    [{ scope: "subtree", query: { class: ["=", "componentset"] } }],
    parseSelector(".COMPONENT_SET")
  );
});

test("parse tag", async () => {
  // await before();
  assert.equal(
    [{ scope: "subtree", query: { tag: ["=", "button"] } }],
    parseSelector("Button")
  );
});

test("parse attr", async () => {
  // await before();
  assert.equal(
    [
      {
        scope: "subtree",
        query: {
          name: ["=", "configurationfillediconwithiconstatehovered"],
        },
      },
    ],
    parseSelector(
      "[@name='Configuration=filled, Icon=with-icon, State=hovered']"
    )
  );
});

test("parse attr many", async () => {
  // await before();
  assert.equal(
    [
      {
        scope: "subtree",
        query: {
          attrs: {
            configuration: ["=", "filled"],
            icon: ["=", "withicon"],
            state: ["=", "hovered"],
          },
        },
      },
    ],
    parseSelector("[Configuration=filled][Icon=with-icon][State=hovered]")
  );
});

test("parse everything", async () => {
  // await before();
  assert.equal(
    [
      { scope: "subtree", query: { id: ["=", "0:0"] } },
      {
        scope: "subtree",
        query: { tag: ["=", "button"], class: ["=", "componentset"] },
      },
      {
        scope: "children",
        query: {
          attrs: {
            configuration: ["~=", "filled"],
            icon: ["=", "withicon"],
            state: ["=", "hovered"],
          },
        },
      },
      { scope: "adjacent", query: { class: ["=", "frame"] } },
      { scope: "siblings", query: { class: ["=", "text"] } },
    ],
    parseSelector(
      "#0:0 button.component-set > [Configuration~=filled][Icon=with-icon]:hovered + .frame ~ .text "
    )
  );
});

test("parse initial", async () => {
  // await before();
  assert.equal(
    [{ scope: "subtree", query: { class: ["=", "text"] } }],
    parseSelector("* .text")
  );
});

test("select id attr", async () => {
  // await before();
  assert.ok(querySelector(materialFile.document, "[@id='50731:12296']"));
});

test("select id", async () => {
  // await before();
  assert.ok(querySelector(materialFile.document, "#50731:12296"));
});

test("select type attr", async () => {
  // await before();
  assert.ok(querySelector(materialFile.document, "[@type=COMPONENT_SET]"));
});

test("select type (class)", async () => {
  // await before();
  assert.ok(querySelector(materialFile.document, ".component-set"));
});

test("select all class", async () => {
  // await before();
  assert.is(
    50,
    querySelectorAll(materialFile.document, ".component-set").length
  );
});

test("select tag", async () => {
  // await before();
  assert.ok(querySelector(materialFile.document, "Button"));
});

test("select all tag", async () => {
  // await before();
  assert.is(11, querySelectorAll(materialFile.document, "button").length);
});

test("select attr", async () => {
  // await before();
  assert.ok(
    querySelector(
      materialFile.document,
      "[@name='Configuration=filled, Icon=with-icon, State=hovered']"
    )
  );
});

test("select all attr", async () => {
  // await before();
  assert.is(
    1,
    querySelectorAll(
      materialFile.document,
      "[configuration=filled][icon=with-icon][state=hovered]"
    ).length
  );
});

test("select complex", async () => {
  // await before();
  assert.ok(
    querySelector(
      materialFile.document,
      "button.component-set > [Configuration*=filled]:hovered .text"
    )
  );
});

test("select all complex", async () => {
  // await before();
  assert.is(
    2,
    querySelectorAll(
      materialFile.document,
      "button.component-set > [Configuration=filled]:hovered + .component"
    ).length
  );
});

test("select universal", async () => {
  // await before();
  assert.is(1671, querySelectorAll(materialFile.document, "* .text").length);
});

test.run();
