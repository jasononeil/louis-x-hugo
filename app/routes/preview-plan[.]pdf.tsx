import { LoaderFunctionArgs } from "@remix-run/node";
import { chromium, devices } from "playwright";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the same URL, with the query parameters, except `preview-plan.svg` instead of `preview-plan.pdf`
  const svgUrl = new URL(request.url);
  svgUrl.pathname = "preview-plan.svg";

  const pdf = await generatePdfFromUrl(svgUrl.toString());
  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}

async function generatePdfFromUrl(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();
  await page.goto(url);
  const pdfBuffer = await page.pdf({ width: "30cm", height: "20cm" });
  await context.close();
  await browser.close();
  return pdfBuffer;
}
