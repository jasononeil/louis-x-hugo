import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { type Page, page } from "~/store/page";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = await body.get("name");
  const background = await body.get("background");
  const weekStart = await body.get("weekStart");
  const pageData = { name, background, weekStart };
  page.set(pageData);
  return redirect("/requirements");
}

export default function SetupPage() {
  return (
    <>
      <h1>Setup Your Page</h1>
      <Form className="flex flex-col space-y-2 mx-6 mt-2" method="POST">
        <label>
          Page Name:
          <input
            name="name"
            type="text"
            defaultValue="Test"
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
            defaultValue="sunday"
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </label>
        <button type="submit" className="border-solid border-black border w-fit p-2">
          Submit
        </button>
        {/*On success should redirect...*/}
      </Form>
    </>
  );
}
