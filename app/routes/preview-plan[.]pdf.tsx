import { LoaderFunctionArgs } from "@remix-run/node";
import { generatePdfFromUrl } from "~/utils/playwright";

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
