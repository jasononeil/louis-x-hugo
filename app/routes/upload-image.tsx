import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  redirect,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import {
  getSignedUrlsForItemsInBucket,
  getSignedUrlForPosting,
} from "~/.server/s3";
import { useState } from "react";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const body = await request.formData();
  console.log("body", body);
  return redirect("/upload-image");
}

type ServerData = {
  filesInBucket: string[];
  postURL?: any;
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
  const serverData: ServerData = await serverLoader();
  console.log(
    "The server can make authenticated request to R2, like checking the files in the bucket:",
    serverData
  );
  return {
    images: serverData.filesInBucket,
    presignedPost: serverData?.postURL,
  };
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function SetupPage() {
  const [file, setFile] = useState<File | null>(null);
  const data = useLoaderData<typeof clientLoader>();
  const url = data.presignedPost;
  function handleChange(e) {
    if (e.target.files) {
      console.log(e.target.files);
      const nextFile = e.target.files[0];
      setFile(nextFile);
      console.log(nextFile);
    }
  }
  async function handleUpload(e) {
    e.preventDefault();
    if (file) {
      console.log("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);
      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "image/jpeg",
          },
          body: file,
        });

        const data = await result.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <>
      <h1>Setup Your Page</h1>
      <form
        className="flex flex-col space-y-2 mx-6 mt-2"
        method="PUT"
        encType="multipart/form-data"
        onSubmit={handleUpload}
      >
        <input type="file" name="file" onChange={handleChange} />
        <button
          type="submit"
          accept="image/*"
          className="border-solid border-black border w-fit p-2"
        >
          Upload
        </button>
        {/*On success should redirect...*/}
      </form>
      <ul>
        {data.images.map((imageUrl, i) => (
          <li key={i}>
            <img src={imageUrl} alt="" />
          </li>
        ))}
      </ul>
    </>
  );
}
