import { splitEvery, repeat } from "ramda";

export type Magnet = {
  id: string;
  name: string;
  quantity: number;
  uploadKey?: string;
};

export type SignedMagnet = Magnet & {
  presignedUrl: string;
};

/**
Given an array of MagnetImages:
- copy each image the specified number of times in "quantity"
- and then split into groups of 9
*/
export function setupMagnetGroups<T extends Magnet>(magnets: Array<T>) {
  const allImages = magnets.flatMap((magnet) =>
    repeat(magnet, magnet.quantity)
  );
  return splitEvery(9)(allImages);
}
