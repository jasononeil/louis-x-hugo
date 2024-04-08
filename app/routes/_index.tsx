import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Louis X Hugo" },
    { name: "description", content: "Visual schedules made easy" },
  ];
};

export default function Index() {
  return (
    <div className="m-4">
      <h1>Louis x Hugo</h1>
      <h2>Selling Points</h2>
      <Link to="/setup-page" className="underline text-blue-500">
        Get Started
      </Link>
    </div>
  );
}
