import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  redirect,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { useRef } from "react";
import {
  getSignedUrlsForItemsInBucket,
  getSignedUrlForPosting,
} from "~/.server/s3";
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

type ServerData = {
  filesInBucket: string[];
  postURL: string;
};

/** The server side loader */
export async function loader(): Promise<ServerData> {
  return {
    filesInBucket: await getSignedUrlsForItemsInBucket(),
    postURL: await getSignedUrlForPosting("202402portrait.jpg"),
  };
}

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const pageData = page.get();
  const serverData: ServerData = await serverLoader();
  return {
    ...pageData,
    images: serverData.filesInBucket,
    presignedPost: serverData.postURL,
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
      <ImageUploadForm url={pageData.presignedPost} />
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

function ImageUploadForm({ url }: { url: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (files && files[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (result.ok) {
          console.log("Upload successful");
        } else {
          throw new Error(
            `Upload failed: ${result.status} ${result.statusText}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <form className="flex flex-col space-y-2 mx-6 mt-2" onSubmit={handleUpload}>
      <input type="file" ref={fileInputRef} accept="image/*" />
      <button
        type="submit"
        className="border-solid border-black border w-fit p-2"
      >
        Upload
      </button>
      {/*On success should redirect...*/}
    </form>
  );
}
