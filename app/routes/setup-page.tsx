import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  redirect,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { getSignedUrlsForItemsInBucket } from "~/.server/s3";
import { page } from "~/store/page.client";
import { ImageUploadField } from "~/components/ImageUploadField";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const body = await request.formData();
  const pageData = {
    name: getStringFromFormData(body, "name"),
    background: getStringFromFormData(body, "background"),
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

type ServerData = {
  filesInBucket: string[];
};

/** The server side loader */
export async function loader(): Promise<ServerData> {
  return {
    filesInBucket: await getSignedUrlsForItemsInBucket(),
  };
}

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const pageData = page.get();
  const serverData: ServerData = await serverLoader();
  return {
    ...pageData,
    images: serverData.filesInBucket,
  };
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
        <ImageUploadField label="Background" name="background" />
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
      <ul>
        {pageData.images.map((imageUrl, i) => (
          <li key={i}>
            <img src={imageUrl} alt="" />
          </li>
        ))}
      </ul>
    </>
  );
}
