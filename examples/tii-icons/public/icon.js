const css = `
:host {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: middle;
  contain: content;
}
:host([large]) {
  width: 2.25rem;
  height: 2.25rem;
}
:host([small]) {
  width: 1.125rem;
  height: 1.125rem;
}
svg {
  display: block;
  width: 100%;
  height: 100%;
}
path {
  fill: currentColor;
}
`;
let style;
if ("adoptedStyleSheets" in document) {
  style = new CSSStyleSheet();
  style.replaceSync(css);
} else {
  style = document.createElement("style");
  style.textContent = css;
}
export class IconElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if ("adoptedStyleSheets" in document) {
      this.shadowRoot.adoptedStyleSheets = [style];
    } else {
      this.shadowRoot.append(style.cloneNode(true));
    }
    this.#load();
  }
  #load() {
    setTimeout(async () => {
      const name = this.textContent.trim();
      const suffix = this.hasAttribute("outlined")
        ? "-outlined"
        : this.hasAttribute("filled")
        ? "-filled"
        : "";
      try {
        const doc = await loadXML(`/icons/${name}${suffix}.svg`);
        this.shadowRoot.append(doc.firstElementChild);
      } catch (err) {
        console.log(name, suffix);
        this.remove();
      }
    }, Math.random() * 1000);
  }
}

function loadXML(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE && xhr.responseXML) {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject(new Error(xhr.statusText));
        }
      } else {
        reject(new Error("empty response"));
      }
    };

    xhr.send();
  });
}
