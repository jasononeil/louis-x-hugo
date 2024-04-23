import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  redirect,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { page } from "~/store/page.client";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const body = await request.formData();
  const pageData = {
    name: getStringFromFormData(body, "name"),
    background: undefined, // TODO: support files
    weekStart: getStringFromFormData(body, "weekStart"),
  };
  page.set(pageData);
  return redirect("/requirements");
}

function getStringFromFormData(
  body: FormData,
  field: string
): string | undefined {
  const value = body.get(field);
  if (typeof value === "string") {
    return value;
  }
  // If the value was `null` or a `File` don't return anything
}

/** The server side loader */
export async function loader() {
  const CLOUDFLARE_ACCOUNT_ID = "01ff6cd586444f2c0adbd5ffcac8a764";
  const s3Client = new S3Client({
    credentials: fromEnv(),
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    region: "auto",
  });
  const response = await s3Client.send(
    new ListObjectsCommand({ Bucket: "louis-x-hugo-uploads" })
  );
  return {
    filesInBucket: response.Contents?.map((object) => object.Key),
  };
}

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const pageData = page.get();
  const serverData = await serverLoader();
  console.log(
    "The server can make authenticated request to R2, like checking the files in the bucket:",
    serverData
  );
  return pageData;
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function SetupPage() {
  const pageData = useLoaderData<typeof clientLoader>();
  return (
    <>
      <h1>Setup Your Page</h1>
      <Form className="flex flex-col space-y-2 mx-6 mt-2" method="POST">
        <label>
          Page Name:
          <input
            name="name"
            type="text"
            defaultValue={pageData.name}
            className="border border-black border-solid"
          />
        </label>
        <label>
          Background:
          <input
            name="background"
            type="file"
            className="border border-black border-solid"
          />
        </label>
        <label>
          Week Start:
          <select
            name="weekStart"
            className="border border-black border-solid"
            defaultValue={pageData.weekStart}
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </label>
        <button
          type="submit"
          className="border-solid border-black border w-fit p-2"
        >
          Submit
        </button>
        {/*On success should redirect...*/}
      </Form>
    </>
  );
}
