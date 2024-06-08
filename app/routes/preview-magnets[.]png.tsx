import { LoaderFunctionArgs } from "@remix-run/node";
import { Magnet, getUrlParamsForMagnets } from "~/store/Magnet";
import { generatePngFromUrl } from "~/utils/playwright";

/**
Render a PNG of the `/preview-magnets` page using Playwright.

Use `getPreviewMagnetPngUrl()` to generate correct URLs
*/
export async function loader({ request }: LoaderFunctionArgs) {
  // Get the same URL, with the query parameters, except `preview-magnets` instead of `preview-magnets.png`
  const svgUrl = new URL(request.url);
  svgUrl.pathname = "preview-magnets";

  const png = await generatePngFromUrl(svgUrl.toString());
  return new Response(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}

/** Generate a preview URL for this page with given magnet data in search parameters */
export function getPreviewMagnetPngUrl(magnets: Array<Magnet>) {
  const params = getUrlParamsForMagnets(magnets);
  return `/preview-magnets.png?${params.toString()}`;
}
