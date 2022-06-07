import figmatik from "figmatik";
import { writeFile } from "fs/promises";
import cssbeautify from "cssbeautify";
const figma = figmatik({
  token: process.env.FIGMATIK_TOKEN,
});

const materialDesign = await figma.api.files(
  {
    fileKey: "ZsaaakKEgys8zPMBaUbFz3",
    geometry: "paths",
  },
  "only-if-cached"
);

import materialButton from "./styles/material-button.css.js";
writeFile(
  "public/material-button.css",
  cssbeautify(materialButton(materialDesign.document))
);
