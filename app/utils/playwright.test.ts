import { expect, test } from "vitest";
import { generatePngFromUrl, getPrintViewport } from "./playwright";
import sizeOf from "image-size";

test("getPrintViewort for 125mm magnet grid", () => {
  // At 360 DPI, Inkscape exported a 125mm square grid as 1772 by 1772px
  expect(getPrintViewport(125, 125)).toStrictEqual({
    x: 0,
    y: 0,
    height: 472,
    width: 472,
    scale: 1.5625,
  });
});

test("generatePngFromUrl produces the expected size for 125x125mm", async () => {
  const pngBuffer = await generatePngFromUrl({
    url: "about:blank",
    widthInMM: 125,
    heightInMM: 125,
  });
  const { width, height } = sizeOf(pngBuffer);
  // Note: these values are sometimes 1px off, with different rounding to what I expect if I calculate manually.
  // It's close enough though, and I don't care to dive into Chrome/Playwright internals to understand the slight differences.
  expect(width).toBe(1475);
  expect(height).toBe(1475);
});

test("generatePngFromUrl produces the expected size for 300x200mm", async () => {
  const pngBuffer = await generatePngFromUrl({
    url: "about:blank",
    widthInMM: 300,
    heightInMM: 200,
  });
  const { width, height } = sizeOf(pngBuffer);
  // Note: these values are sometimes 1px off, with different rounding to what I expect if I calculate manually.
  // It's close enough though, and I don't care to dive into Chrome/Playwright internals to understand the slight differences.
  expect(width).toBe(3544);
  expect(height).toBe(2363);
});
