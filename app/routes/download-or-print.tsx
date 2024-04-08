import { Link } from "@remix-run/react";

export default function DownloadOrPrint() {
  return (
    <>
      <h1>Print With Us</h1>
      <p>Implement print order functionality</p>
      <h2>Download and Print It Yourself</h2>
      <Link to="/setup-page">Want Another One?</Link>
    </>
  );
}
