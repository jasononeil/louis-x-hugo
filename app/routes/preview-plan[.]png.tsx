import { LoaderFunctionArgs } from "@remix-run/node";
import { chromium, devices } from "playwright";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the same URL, with the query parameters, except `preview-plan.svg` instead of `preview-plan.png`
  const svgUrl = new URL(request.url);
  svgUrl.pathname = "preview-plan.svg";

  console.log("generate png", svgUrl);

  const png = await generatePngFromUrl(svgUrl.toString());
  return new Response(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}

async function generatePngFromUrl(url: string) {
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
