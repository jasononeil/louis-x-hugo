import { SignedMagnet } from "~/store/Magnet";

export function MagnetGrid({ images }: { images: Array<SignedMagnet> }) {
  const noMoreThan9Images = images.slice(0, 9);
  return (
    <ul className="grid grid-cols-3 grid-rows-3 place-content-around aspect-square w-[125mm] gap-[6mm] p-[3mm] m-3 bg-white border-2">
      {noMoreThan9Images.map((magnet, i) => (
        <li key={i} className="bg-black relative overflow-clip">
          <img
            src={magnet.presignedUrl}
            alt={magnet.name}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </li>
      ))}
    </ul>
  );
}
