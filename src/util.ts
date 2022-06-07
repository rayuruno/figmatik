export function replaceNonWord(str: string, replacement: string = "-"): string {
  return str.replace(/\W|_/g, replacement).toLocaleLowerCase();
}

export function kebabCase(str = "") {
  return str
    .trim()
    .replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))|\W|\s/g, "$2$5-$3$6")
    .toLowerCase()
    .replaceAll(/_/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

export function after(fun: any, aft: any) {
  return async function (...args: any) {
    return await aft(await fun(...args));
  };
}
export function isNumber(value: any) {
  return typeof value === "number";
}

export function toFixed(value: number) {
  return value.toFixed(2).replace(/\.(\d*)0+$/, (i, s) => {
    s = s.replace(/0/, "");
    if (s) return `.${s}`;
    return "";
  });
}

export function omit(obj: any, ...keys: string[]) {
  if (!obj) return {};
  keys.forEach((k) => delete obj[k]);
  return obj;
}

export function only(obj: any, ...keys: string[]) {
  if (!obj) return {};
  let o = { ...obj };
  Object.keys(o).forEach((k) => {
    if (!keys.includes(k)) {
      delete o[k];
    }
  });
  return o;
}
