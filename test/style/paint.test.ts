import { test } from "uvu";
import * as assert from "uvu/assert";
import {
  parsePaints,
  parsePaint,
  parseSolid,
  parseSolidAsLinearGradient,
  parseLinearGradient,
  parseRadialGradient,
} from "../../src/plugin/style/properties/paint.js";

test("parsePaint", () => {
  assert.is(
    parsePaint({
      type: "SOLID",
      opacity: 0.4,
      color: { r: 0, g: 1, b: 1, a: 1 },
    } as any),
    "rgba(0, 255, 255, 0.40)"
  );
});

test("parsePaints", () => {
  assert.is(
    parsePaints([
      { type: "SOLID", opacity: 0.4, color: { r: 0, g: 1, b: 1, a: 1 } },
      { type: "SOLID", opacity: 0.4, color: { r: 0, g: 0.4, b: 0.4, a: 1 } },
    ] as any),
    "linear-gradient(rgba(0, 102, 102, 0.40),rgba(0, 102, 102, 0.40)), linear-gradient(rgba(0, 255, 255, 0.40),rgba(0, 255, 255, 0.40))"
  );
});

test("parseSolid", () => {
  assert.is(
    parseSolid({
      type: "SOLID",
      opacity: 0.4,
      color: { r: 0, g: 1, b: 1, a: 1 },
    } as any),
    "rgba(0, 255, 255, 0.40)"
  );
});

test("parseLinearGradient", () => {
  assert.is(
    parseSolidAsLinearGradient({
      type: "SOLID",
      opacity: 0.4,
      color: { r: 0, g: 1, b: 1, a: 1 },
    } as any),
    "linear-gradient(rgba(0, 255, 255, 0.40),rgba(0, 255, 255, 0.40))"
  );
});

test("parseSolidAsLinearGradient", () => {
  assert.is(
    parseLinearGradient({
      type: "GRADIENT_LINEAR",
      opacity: 0.4,
      gradientHandlePositions: [
        { x: 0, y: 0.5 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0.4, b: 0.4, a: 1 } },
        { position: 1, color: { r: 1, g: 0.7, b: 0.4, a: 1 } },
      ],
    } as any),
    "linear-gradient(2.0344439357957027rad, rgba(255, 102, 102, 0.40) 0%, rgba(255, 178, 102, 0.40) 100%)"
  );
});

test("parseRadialGradient", () => {
  assert.is(
    parseRadialGradient({
      type: "GRADIENT_RADIAL",
      opacity: 0.4,
      gradientHandlePositions: [
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 1 },
        { x: 1, y: 0.5 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0.4, b: 0.4, a: 1 } },
        { position: 1, color: { r: 1, g: 0.7, b: 0.4, a: 1 } },
      ],
    } as any),
    "radial-gradient(rgba(255, 102, 102, 0.40) 0%, rgba(255, 178, 102, 0.40) 100%)"
  );
});

test.run();
