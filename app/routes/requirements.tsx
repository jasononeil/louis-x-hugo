import { Form, useLoaderData } from "@remix-run/react";
import PageNav from "../components/PageNav";
import { page } from "~/store/page.client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader() {
  return page.get();
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const commonOptions = [
  "Home",
  "Mum's house",
  "Dad's house",
  "School",
  "Daycare",
  "Playground",
  "Grandparents",
  "Therapy",
  "Church",
  "Car",
];

export default function Requirements() {
  const pageData = useLoaderData<typeof clientLoader>();
  const emptyMagnet = () => ({
    id: uuidv4(),
    name: "",
    quantity: 0,
  });
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

  function deleteMagnet(indexToDelete: number) {
    console.log("magnets", magnets);
    const newMagnets = magnets.filter(
      (magnet, index) => index !== indexToDelete
    );
    if (newMagnets[newMagnets.length - 1].name !== "") {
      newMagnets.push(emptyMagnet());
    }

    setMagnets(newMagnets);
    page.set({
      ...pageData,
      magnets: newMagnets.filter((m) => m.name !== ""),
    });
    console.log("newMagnets", newMagnets);
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
        <p>
          Think of the different magnets you want, and on the next page you can
          upload photos and choose how many.
        </p>
        <ul className="space-y-2">
          {magnets.map((magnet, index) => (
            <ListItem
              value={magnet.name}
              onChange={(text) => updateMagnet(text, index)}
              key={magnet.id}
              onDelete={() => deleteMagnet(index)}
            />
          ))}
        </ul>
        <h2 className="text-2xl font-bold">Common options</h2>
        <ul className="flex flex-wrap gap-4">
          {filteredCommonOptions.map((option) => (
            <li key={option}>
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
  onDelete,
}: {
  value: string;
  onChange: (name: string) => void;
  onDelete: () => void;
}) {
  return (
    <li className="border border-solid border-black rounded-2xl flex">
      <input
        type="text"
        defaultValue={value}
        className="2xl p-4 w-full rounded-l-2xl"
        onChange={(e) => onChange(e.currentTarget.value)}
      ></input>
      <button
        onClick={onDelete}
        type="button"
        className=" border-l border-black border-solid p-4 rounded-r-2xl text-2xl leading-none text-red-500"
      >
        x
      </button>
    </li>
  );
}
