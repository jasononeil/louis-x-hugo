import { Link } from "@remix-run/react";
import PageNav from "~/components/PageNav";

export default function DownloadOrPrint() {
  return (
    <>
      <h1>Print With Us</h1>
      <p>Implement print order functionality</p>
      <h2>Download and Print It Yourself</h2>
      <PageNav
        backTo="/download-or-print"
        nextTo="/setup-page"
        nextText="- Want Another One?"
      />
    </>
  );
}
