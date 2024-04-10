import { Link } from "@remix-run/react";
import PageNav from "~/components/PageNav";

export default function UploadPhotos() {
  return (
    <>
      <h1>Upload Photos</h1>
      <p>Implement photo upload functionality</p>
      <h2>Preview?</h2>
      <PageNav
        backTo="/requirements"
        nextTo="/download-or-print"
        nextText="Download/Print"
      />
    </>
  );
}
