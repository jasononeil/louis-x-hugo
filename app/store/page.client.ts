import { persistentAtom } from "@nanostores/persistent";

export type Magnet = {
  id: string;
  name: string;
  quantity: number;
  uploadKey?: string;
};

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
