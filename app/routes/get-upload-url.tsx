import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import { getSignedUrlForItem, getSignedUrlForPosting } from "~/.server/s3";

/**
 * A simple POST route action to create a pre-signed URL for file uploads.
 * Use the `getUploadUrl()` helper rather than calling directly.
 */
export async function action({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<GetUploadUrlResult>> {
  const url = new URL(request.url);
  const project = url.searchParams.get("project");
  const filename = url.searchParams.get("filename");
  if (!project) {
    throw new Error("Please set `project` query parameter to project UUID");
  }
  if (!filename) {
    throw new Error(
      "Please set `filename` query parameter to filename for this upload"
    );
  }
  const key = `uploads/${project}/${filename}`;
  return json({
    key,
    preSignedUploadUrl: await getSignedUrlForPosting(key),
    preSignedGetUrl: await getSignedUrlForItem(key),
  });
}

type GetUploadUrlResult = {
  key: string;
  preSignedUploadUrl: string;
  preSignedGetUrl: string;
};

export async function getUploadUrl({
  project,
  filename,
}: {
  /** A string representing the ID of the project. Used for keeping the bucket clean and sorted by different projects. */
  project: string;
  /** A string representing the filename being uploaded. Currently this is used in the object Key in the bucket, but in future this may not be used. */
  filename: string;
}): Promise<GetUploadUrlResult> {
  const params = new URLSearchParams({ project, filename }).toString();
  const preSignedUrlResponse = await fetch(`/get-upload-url?${params}`, {
    method: "POST",
  });
  return await preSignedUrlResponse.json();
}
