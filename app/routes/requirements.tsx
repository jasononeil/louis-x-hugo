import { Link } from "@remix-run/react";

export default function Requirements() {
  return (
    <div className="flex flex-col space-y-2">
      <p>Add functionality to add list of requirements</p>
      <div className="flex">
        <Link to="/setup-page" className="border border-solid border-black p-1 mx-1">
          &lt;-- Back
        </Link>
        <Link to="/upload-photos" className="border border-solid border-black p-1 mx-1">
          Next (Upload Photos) --&gt;
        </Link>
      </div>
    </div>
  );
}
