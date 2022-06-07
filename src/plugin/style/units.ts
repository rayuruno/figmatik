import { toFixed } from "../../util.js";
export const DEFAULT_UNIT = "rem";

export function pixel(value: number) {
  if (isNaN(value)) return;
  return `${toFixed(value)}px`;
}

export function perc(value: number) {
  if (isNaN(value)) return;
  return `${toFixed(value)}%`;
}

export function rem(value: number, base = 16) {
  if (isNaN(value)) return;
  return `${toFixed(value / base)}rem`;
}

export function unitless(value: number) {
  return value;
}
