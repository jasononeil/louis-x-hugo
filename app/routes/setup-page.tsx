import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { page } from "~/store/page";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = await body.get("name");
  const background = await body.get("background");
  const weekStart = await body.get("weekStart");
  const pageData = { name, background, weekStart };
  page.set(pageData);
  return redirect("/requirements");
}

export async function loader() {
  const pageData = page.get();
  return json(pageData);
}

export default function SetupPage() {
  const pageData = useLoaderData<typeof loader>();
  console.log(pageData.background);
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
