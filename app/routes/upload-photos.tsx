import { ImageUploadField } from "~/components/ImageUploadField";
import {
  useLoaderData,
  ClientActionFunctionArgs,
  redirect,
  Form,
} from "@remix-run/react";
import { getIntFromFormData, getStringFromFormData } from "~/utils/formUtils";
import { Page, page } from "~/store/page.client";

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader() {
  return page.get();
}
clientLoader.hydrate = true;

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const pageData = await page.get();
  const body = await request.formData();

  const newPageData: Page = {
    ...pageData,
    magnets: pageData.magnets.map((magnet) => ({
      ...magnet,
      uploadKey: getStringFromFormData(body, `upload-${magnet.id}`),
      quantity: getIntFromFormData(body, `quantity-${magnet.id}`, 1),
    })),
  };
  page.set(newPageData);
  return redirect("/download-or-print");
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export default function UploadPhotos() {
  const pageData = useLoaderData<typeof clientLoader>();
  return (
    <Form method="POST">
      <div className="flex flex-col space-y-2 m-4">
        <h1 className="text-4xl font-bold">Upload Photos</h1>
        {pageData.magnets.map((magnet) => (
          <div key={magnet.id}>
            <h2 className="text-xl m-4">{magnet.name}</h2>
            <ImageUploadField
              label={`Upload photo for ${magnet.name}`}
              name={`upload-${magnet.id}`}
              existingUploadKey={magnet.uploadKey}
            />
            <label className="flex gap-3">
              <span>Number of magnets:</span>
              <input
                type="number"
                name={`quantity-${magnet.id}`}
                defaultValue={magnet.quantity}
              />
            </label>
          </div>
        ))}

        {/* TODO: allow "Submit" on a PageNav for next button, same on setup page */}
        <button
          type="submit"
          className="border-solid border-black border w-fit p-2"
        >
          Submit
        </button>
        {/* <PageNav
        backTo="/requirements"
        nextTo="/download-or-print"
        nextText="Download/Print"
      /> */}
      </div>
    </Form>
  );
}
