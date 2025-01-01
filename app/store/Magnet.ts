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

/** Get URL parameters of these magnets. Used for generating URLs to magnet previews. */
export function getUrlParamsForMagnets(magnets: Array<Magnet>) {
  const params = new URLSearchParams();
  for (const m of magnets) {
    params.append("magnets", JSON.stringify(m));
  }
  return params;
}
