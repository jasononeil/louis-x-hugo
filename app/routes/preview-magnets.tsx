import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { memoizeWith } from "ramda";
import { getSignedUrlForItem } from "~/.server/s3";
import { Magnet, SignedMagnet } from "~/store/Magnet";
import { MagnetGrid } from "~/components/MagnetGrid";

/**
This page displays a 3x3 magnet grid.

Each magnet's info (including upload keys) should be passed in as JSON in URL search parameters.

Use `getPreviewMagnetUrl()` to generate a correctly formatted URL for this page.
*/
export default function PreviewMagnets() {
  const { images } = useLoaderData<typeof loader>();
  return <MagnetGrid images={images} />;
}

/** Generate a preview URL for this page with given magnet data in search parameters */
export function getPreviewMagnetUrl(magnets: Array<Magnet>) {
  const params = new URLSearchParams();
  for (const m of magnets) {
    params.append("magnets", JSON.stringify(m));
  }
  return `/preview-magnets?${params.toString()}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Use `memoizeWith` to cache calls to `getSignedUrlForItem()` so we don't pre-sign the same image multiple times
  // (Because that makes an API call that is slow and contributes to our billing, and it'll be slower to download for the end user)
  const memoizePresignedUrl: (uploadKey: string) => Promise<string> =
    memoizeWith(
      (key) => key,
      (key) => getSignedUrlForItem(key)
    );

  const magnets: Array<Magnet> = url.searchParams
    .getAll("magnets")
    .map((json) => JSON.parse(json));

  const magnetImages: Array<SignedMagnet> = (
    await Promise.all(
      magnets.map(async (m) => {
        return (
          m.uploadKey && {
            ...m,
            presignedUrl: await memoizePresignedUrl(m.uploadKey),
          }
        );
      })
    )
  )
    // Note: this type assertion won't be needed in Typescript 5.5
    // https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#inferred-type-predicates
    .filter((m): m is SignedMagnet => m !== null);
  return { images: magnetImages };
}
