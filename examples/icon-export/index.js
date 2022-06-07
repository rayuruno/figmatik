import figmatik from "figmatik";
import { writeFile, mkdir } from "fs/promises";

const figma = figmatik({ token: process.env.FIGMATIK_TOKEN });

const file = await figma.api.files(
  { fileKey: "ZsaaakKEgys8zPMBaUbFz3" },
  "only-if-cached"
);

const icons = file.document.querySelectorAll(".component[@name^='Icons/']");

const images = await figma.export(icons, [
  { format: "svg", use_absolute_bounds: true },
]);

await mkdir("icons");

for (const i of images) {
  writeFile(i.node.name.toLowerCase() + "." + i.format, i.buffer);
}
