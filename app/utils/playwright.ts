import { chromium, devices } from "playwright";

export async function generatePngFromUrl({
  url,
  widthInMM,
  heightInMM,
}: {
  url: string;
  widthInMM: number;
  heightInMM: number;
}) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();
  // Note, calling `page.screenshot()` seems to hang for unknown reasons.
  // This comment on GitHub suggested using raw "Chrome Devtools Protocol" (cdp)
  // https://github.com/microsoft/playwright/issues/15773#issuecomment-1292776820
  const cdpSession = await context.newCDPSession(page);
  await page.goto(url);

  const viewport = getPrintViewport(widthInMM, heightInMM);
  page.setViewportSize({ width: viewport.width, height: viewport.height });

  const screenshotReturnValue = await cdpSession.send(
    "Page.captureScreenshot",
    {
      clip: viewport,
      captureBeyondViewport: true,
    }
  );
  const base64Str = screenshotReturnValue.data;
  await context.close();
  await browser.close();
  return Buffer.from(base64Str, "base64");
}

/**
Get the Viewport with with and height set correctly for the web DPI (96), and `scale` set correctly that we get our desired print DPI (360).
*/
export function getPrintViewport(
  widthInMM: number,
  heighInMM: number
): { x: number; y: number; width: number; height: number; scale: number } {
  const CSS_DPI = 96;
  const CSS_DOTS_PER_MM = CSS_DPI / 25.4;
  const PRINT_DPI = 300;
  // NOTE: All my calculations were off by 2, which I think is to do with High DPI scaling on my macbook, but I don't know how to verify.
  // When we test on different laptops / CI / hosted servers, I'll be interested to see if this value needs to change.
  const HIGH_DPI_SCALING = 2;
  return {
    x: 0,
    y: 0,
    width: Math.round(widthInMM * CSS_DOTS_PER_MM),
    height: Math.round(heighInMM * CSS_DOTS_PER_MM),
    scale: PRINT_DPI / CSS_DPI / HIGH_DPI_SCALING,
  };
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
