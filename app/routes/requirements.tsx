import { Form, useLoaderData } from "@remix-run/react";
import PageNav from "../components/PageNav";
import { page } from "~/store/page.client";
import { useState } from "react";

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader() {
  return page.get();
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const commonOptions = [
  "School",
  "Grandparents",
  "Therapy",
  "Playground",
  "Daycare",
  "Church",
  "example",
  "test",
  "anotherTest",
];

export default function Requirements() {
  const pageData = useLoaderData<typeof clientLoader>();
  const emptyMagnet = () => ({ name: "", quantity: 0 });
  const [magnets, setMagnets] = useState([...pageData.magnets, emptyMagnet()]);
  function updateMagnet(newText: string, indexToUpdate: number) {
    const newMagnets = magnets.map((magnet, index) => ({
      ...magnet,
      name: index === indexToUpdate ? newText : magnet.name,
    }));
    if (newMagnets[newMagnets.length - 1].name !== "") {
      newMagnets.push(emptyMagnet());
    }

    setMagnets(newMagnets);
    page.set({
      ...pageData,
      magnets: newMagnets.filter((m) => m.name !== ""),
    });
  }

  function clickCommonOption(option: string) {
    updateMagnet(option, magnets.length - 1);
  }

  const filteredCommonOptions = commonOptions.filter((option) => {
    return !magnets
      .map((m) => m.name.toLowerCase())
      .includes(option.toLowerCase());
  });

  return (
    <div className="flex flex-col space-y-2 m-4">
      <Form>
        <h1 className="text-4xl font-bold">What do you need magnets for?</h1>
        <ul className="space-y-2">
          {magnets.map((magnet, index) => (
            <ListItem
              value={magnet.name}
              onChange={(text) => updateMagnet(text, index)}
              key={index}
            />
          ))}
        </ul>
        <h2 className="text-2xl font-bold">Common options</h2>
        <ul className="flex flex-wrap gap-4">
          {filteredCommonOptions.map((option) => (
            <li>
              <button
                onClick={() => clickCommonOption(option)}
                className="p-2 border border-solid border-black rounded-xl"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </Form>
      <PageNav
        backTo="/setup-page"
        nextTo="/upload-photos"
        nextText="(Upload Photos)"
      />
    </div>
  );
}

function ListItem({
  value = "",
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <li>
      <input
        type="text"
        defaultValue={value}
        className="2xl border border-solid border-black rounded-2xl p-4 w-full"
        onChange={(e) => onChange(e.currentTarget.value)}
      ></input>
    </li>
  );
}
