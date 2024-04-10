import { persistentMap } from "@nanostores/persistent";

export type Page = {
  name: string;
  background: string;
  weekStart: string;
};

export const page = persistentMap<Page>("page:", {
  name: "",
  background: "",
  weekStart: "sunday",
});

page.listen((old, current, changed) => {
  console.log("In store listener", old, current, changed);
});
