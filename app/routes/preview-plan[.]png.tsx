import { LoaderFunctionArgs } from "@remix-run/node";
import { generatePngFromUrl } from "~/utils/playwright";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the same URL, with the query parameters, except `preview-plan.svg` instead of `preview-plan.png`
  const svgUrl = new URL(request.url);
  svgUrl.pathname = "preview-plan.svg";

  const png = await generatePngFromUrl(svgUrl.toString());
  return new Response(png, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
