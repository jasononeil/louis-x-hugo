import { Link } from "@remix-run/react";

export default function Requirements() {
  return (
    <>
      <h1>Upload Photos</h1>
      <p>Implement photo upload functionality</p>
      <h2>Preview?</h2>
      <Link to="/download-or-print">Almost There - Download/Print</Link>
    </>
  );
}
