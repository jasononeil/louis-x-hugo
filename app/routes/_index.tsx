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
      <h2>Previews</h2>
      <DemoTable />
    </div>
  );
}

function DemoTable() {
  const demos = [
    {
      pageTitle: "Louis",
      firstDayOfWeek: "Sunday",
      bgImage: "https://picsum.photos/id/17/3000/2000",
    },
    {
      pageTitle: "Hugo",
      firstDayOfWeek: "Monday",
      bgImage: "https://picsum.photos/id/18/3000/2000",
    },
  ];
  const formats = ["svg", "pdf", "png"];
  return (
    <table className="table-auto border-collapse w-full">
      {demos.map((demo) => (
        <tr key={demo.pageTitle}>
          <th className="border-slate-200 p-4 border-y">{demo.pageTitle}</th>
          {formats.map((format) => (
            <td key={format} className="border-slate-200 p-4 border-y">
              <a
                href={`/preview-plan.${format}?pageTitle=${demo.pageTitle}&firstDayOfWeek=${demo.firstDayOfWeek}&bgImage=${demo.bgImage}`}
              >
                {format.toUpperCase()}
              </a>
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}
