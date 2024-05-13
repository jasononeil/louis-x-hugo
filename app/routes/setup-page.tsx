import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
  redirect,
} from "@remix-run/react";
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

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader() {
  const pageData = page.get();
  return {
    ...pageData,
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
      <Form className="flex flex-col space-y-2 mt-2" method="POST">
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
        <ImageUploadField label="Background" name="background" />
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
