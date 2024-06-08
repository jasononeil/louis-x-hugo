import { persistentAtom } from "@nanostores/persistent";
import { Magnet } from "./Magnet";

export type Page = {
  name: string;
  background: string | null;
  weekStart: string;
  magnets: Magnet[];
};

export const page = persistentAtom<Page>(
  "page:",
  {
    name: "",
    background: null,
    weekStart: "sunday",
    magnets: [],
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
