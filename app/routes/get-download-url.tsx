import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import { getSignedUrlForItem } from "~/.server/s3";

/**
 * A simple POST route action to create a pre-signed URL for file access / downloads.
 * Use the `getDownloadUrl()` helper rather than calling directly.
 */
export async function action({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<GetDownloadUrlResult>> {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) {
    throw new Error(
      "Please set `key` query parameter to the Object Key you want to download"
    );
  }
  return json({
    preSignedGetUrl: await getSignedUrlForItem(key),
  });
}

type GetDownloadUrlResult = {
  preSignedGetUrl: string;
};

export async function getDownloadUrl({
  key,
}: {
  key: string;
}): Promise<GetDownloadUrlResult> {
  const params = new URLSearchParams({ key }).toString();
  const preSignedUrlResponse = await fetch(`/get-download-url?${params}`, {
    method: "POST",
  });
  return await preSignedUrlResponse.json();
}
