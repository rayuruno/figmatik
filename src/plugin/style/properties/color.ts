export function parseColor(color: Color, opacity = 1) {
  if (color) {
    let { r, g, b, a } = color;
    if (typeof opacity !== "undefined") a *= opacity;
    return (
      "rgba(" +
      [...[r, g, b].map((n) => ~~(n * 255)), a < 1 ? a.toFixed(2) : a].join(
        ", "
      ) +
      ")"
    );
  }
  return "";
}
