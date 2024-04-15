import { persistentAtom } from "@nanostores/persistent";

export type Page = {
  name?: string;
  background?: string;
  weekStart?: string;
};

export const page = persistentAtom<Page>(
  "page:",
  {
    name: "",
    background: "",
    weekStart: "sunday",
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

page.listen((value, oldValue) => {
  console.log("In store listener", value, oldValue);
});
