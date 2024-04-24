import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers";

const CLOUDFLARE_ACCOUNT_ID = "01ff6cd586444f2c0adbd5ffcac8a764";
const BUCKET = "louis-x-hugo-uploads";

const s3Client = new S3Client({
  credentials: fromEnv(),
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
});

export async function getItemsInBucket(): Promise<string[]> {
  const response = await s3Client.send(
    new ListObjectsCommand({ Bucket: BUCKET })
  );
  return response.Contents?.map((object) => object.Key || "") || [];
}

export async function getSignedUrlsForItemsInBucket(): Promise<string[]> {
  const items = await getItemsInBucket();
  const presignedUrls = await Promise.all(
    items.map(async (key) => {
      const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    })
  );
  return presignedUrls;
}

export async function getSignedUrlForPosting(key) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key });
  const presignedPost = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return presignedPost;
}
