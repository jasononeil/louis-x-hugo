import PageNav from "../components/PageNav";
import { page } from "~/store/page.client";

export default function Requirements() {
  return (
    <div className="flex flex-col space-y-2 m-4">
      <h1 className="text-4xl font-bold">What do you need magnets for?</h1>
      <ul className="space-y-2">
        <ListItem value="hello word" />
        <ListItem />
      </ul>
      <PageNav
        backTo="/setup-page"
        nextTo="/upload-photos"
        nextText="(Upload Photos)"
      />
    </div>
  );
}

function ListItem({ value = "" }) {
  return (
    <li>
      <input
        type="text"
        defaultValue={value}
        className="2xl border border-solid border-black rounded-2xl p-4 w-full"
      ></input>
    </li>
  );
}
