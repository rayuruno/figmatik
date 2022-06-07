import figmatik from "figmatik";
import { join } from "path";
import { readFile, writeFile, mkdir } from "fs/promises";

const figma = figmatik({ token: process.env.FIGMA_TOKEN });

const file = await figma.api.files({ fileKey: "O7VtSgcZb3a3rNz2FNxwGu" });

const icons = file.document.querySelectorAll(
  ".canvas[@name='Icons'] [size*=medium]"
);

const no = (str = "") => str.toLowerCase().replace(/\W/g, "");

const iconName = ({ node }) =>
  [no(node.parent.name), no(node.attrs.style?.replace(/(Default)|\W/g, ""))]
    .filter((s) => !!s)
    .join("-");

const fileName = ({ node, format }) => iconName({ node }).concat(`.${format}`);

const images = await figma.export(icons, [
  { format: "svg", use_absolute_bounds: true },
]);

await mkdir("public/icons", { recursive: true });

let buff = {};

for (const i of images) {
  writeFile(join("public/icons", fileName(i)), i.buffer);

  let id = iconName(i).split("-").shift();
  if (buff[id]) continue;

  let html = `
    <div class="icon-preview">
    <t-ico small>${id}</t-ico>
    <t-ico>${id}</t-ico>
    <t-ico large>${id}</t-ico>
    <t-ico filled small>${id}</t-ico>
    <t-ico filled>${id}</t-ico>
    <t-ico filled large>${id}</t-ico>
    <t-ico outlined small>${id}</t-ico>
    <t-ico outlined>${id}</t-ico>
    <t-ico outlined large>${id}</t-ico>
    <span class="color"><t-ico small>${id}</t-ico></span>
    <span class="color"><t-ico>${id}</t-ico></span>
    <span class="color"><t-ico large>${id}</t-ico></span>
    <span class="color"><t-ico outlined small>${id}</t-ico></span>
    <span class="color"><t-ico outlined>${id}</t-ico></span>
    <span class="color"><t-ico outlined large>${id}</t-ico></span>
    </div>
  `;
  buff[id] = html;
}

writeFile(
  "public/index.html",
  (await readFile("public/index.html", "utf8")).replace(
    "<main></main>",
    `<main>\n${Object.values(buff).join("\n")}\n</main>`
  )
);
