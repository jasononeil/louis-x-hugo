import { Form, Link } from "@remix-run/react";

export default function SetupPage() {
  return (
    <>
      <h1>Setup Your Page</h1>
      <Form className="flex flex-col space-y-2 mx-6 mt-2">
        <label>
          Page Name:
          <input name="name" type="text" className="border border-black border-solid" />
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
        <button type="submit">Submit</button>
        {/*On success should redirect...*/}
        <Link to="/requirements">Continue (temp link until Submit button redirects)</Link>
      </Form>
    </>
  );
}
