import { chromium, devices } from "playwright";

export async function generatePngFromUrl(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();
  // Note, calling `page.screenshot()` seems to hang for unknown reasons.
  // This comment on GitHub suggested using raw "Chrome Devtools Protocol" (cdp)
  // https://github.com/microsoft/playwright/issues/15773#issuecomment-1292776820
  const cdpSession = await context.newCDPSession(page);
  await page.goto(url);
  // TODO: figure out how to make the SVG export at the size we want. The inkscape export of 300mm*200mm at 300dpi is 3543 × 2362
  page.setViewportSize({ width: 1133, height: 755 });
  const screenshotReturnValue = await cdpSession.send(
    "Page.captureScreenshot",
    {
      captureBeyondViewport: true,
    }
  );
  const base64Str = screenshotReturnValue.data;
  await context.close();
  await browser.close();
  return Buffer.from(base64Str, "base64");
}

export async function generatePdfFromUrl(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();
  await page.goto(url);
  const pdfBuffer = await page.pdf({ width: "30cm", height: "20cm" });
  await context.close();
  await browser.close();
  return pdfBuffer;
}
