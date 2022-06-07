import figmatik from "figmatik";
import { dirname } from "path";
import * as util from "figmatik/lib/util.js";
import render from "./render.js";

import { writeFile, mkdir } from "fs/promises";

const figma = figmatik({
  token: process.env.FIGMATIK_TOKEN,
});

const file = await figma.api.files({
  fileKey: "fjTcuw1scxIiMlnNmtFx54",
  geometry: "paths",
});

const frames = file.document.querySelectorAll(".canvas > .frame");

for (const frame of frames) {
  let fileName = `public/content/${frame.parent.name}/${util.replaceNonWord(
    frame.name,
    "-"
  )}.html`;

  await mkdir(dirname(fileName), { recursive: true });

  writeFile(fileName, render.HTML([frame]));
}
