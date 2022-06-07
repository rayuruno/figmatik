// @file https://www.figma.com/file/ZsaaakKEgys8zPMBaUbFz3;

export default (document) => {
  let Button = document.$("buttons button.component-set");
  let configs = ["filled", "outlined", "text", "elevated", "tonal"];
  let states = [
    ["hovered", "hover"],
    ["pressed", "active"],
    ["focused", "focus-visible"],
  ];

  return /*css */ `
  button {
    all: unset;
    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
    position: relative;
  }
  button::after {
    display: block;
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  svg {
    fill: currentColor;
  }

${configs
  .map(($config) => {
    let button = Button.$(
      `[configuration=${$config}][icon=with-icon][state=enabled]`
    );
    let label = Button.$(
      `[configuration=${$config}][icon=with-icon][state=enabled] label-text`
    );
    let css = `
      button.${$config} {
        ${button.styles.frame}
        ${button.styles.shape}
        ${button.styles.border}
        ${button.styles.background}
        ${button.styles.blend}
        ${label.styles.text}
        ${label.styles.color}
      }
    `;

    states.forEach(([$state, $class]) => {
      let button = Button.$(
        `[configuration=${$config}][icon=with-icon][state=${$state}]`
      );

      if (button?.styles.background.toString()) {
        css += `button.${$config}:${$class} { ${button.styles.background} }`;
      }

      let layer = button.$(`state-layer`);
      if (layer?.styles.background.toString()) {
        css += `button.${$config}:${$class}::after { ${layer.styles.background} }`;
      }
    });

    let disabled = Button.$(
      `[configuration=${$config}][icon=with-icon][state=disabled]`
    );
    if (disabled?.styles.background.toString()) {
      css += `button.${$config}:disabled {${disabled.styles.background}}`;
    }

    return css;
  })
  .flat()
  .join("\n")}

button:disabled {
  pointer-events: none;
}
`;
};
