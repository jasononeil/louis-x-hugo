import { LoaderFunctionArgs } from "@remix-run/node";
import { generatePngFromUrl } from "~/utils/playwright";

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
