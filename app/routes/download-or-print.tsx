import { useLoaderData } from "@remix-run/react";
import PageNav from "~/components/PageNav";
import { page } from "~/store/page.client";
import { getDownloadUrl } from "./get-download-url";
import { splitEvery, repeat } from "ramda";

/** The client side loader, which runs after hydrate. Data from the serverLoader (`loader()`) is also available. */
export async function clientLoader() {
  const { name, weekStart, background, magnets } = page.get();
  // TODO : once we have access to `pageData.background` on the server, we can use a server side `loader()` (and maybe `await serverLoader()` here) combined
  // with `getSignedUrlForItem()` rather than doing a separate fetch here. Then `get-download-url` might not even be needed. But that would require a
  // database or something 🤷
  const presignedBackground =
    background && (await getDownloadUrl({ key: background })).preSignedGetUrl;

  const presignedMagnets = await Promise.all(
    magnets.map(async (m) => ({
      ...m,
      presignedUrl: m.uploadKey
        ? (await getDownloadUrl({ key: m.uploadKey })).preSignedGetUrl
        : null,
    }))
  );

  return {
    name,
    weekStart,
    background: presignedBackground,
    magnets: presignedMagnets,
  };
}
clientLoader.hydrate = true;

export default function DownloadOrPrint() {
  const { name, weekStart, background, magnets } =
    useLoaderData<typeof clientLoader>();
  const params = new URLSearchParams({
    pageTitle: name || "Weekly Plan",
    firstDayOfWeek: weekStart || "sunday",
    bgImage: background || "https://picsum.photos/id/17/3000/2000",
  }).toString();
  const pdfUrl = `/preview-plan.pdf?${params}`;
  return (
    <>
      <h1>Print With Us</h1>
      <p>Implement print order functionality</p>
      <h2>Download and Print It Yourself</h2>
      <details>
        <summary>Details</summary>
        <ul className="list-disc list-inside">
          <li>{name}</li>
          <li>{weekStart}</li>
          <li>
            {background ? (
              <img src={background} alt="Uploaded background" />
            ) : (
              "No background"
            )}
          </li>
          <li>
            Magnets:
            <ul>
              {magnets.map((magnet) => (
                <li key={magnet.id}>
                  {magnet.name}, {magnet.quantity}, {magnet.uploadKey}
                  {magnet.presignedUrl && (
                    <img src={magnet.presignedUrl} alt="" />
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </details>
      <PrintAllGrids magnets={magnets} />
      <a href={pdfUrl}>PDF Download</a>
      <iframe
        src={pdfUrl}
        width="800"
        height="600"
        title="PDF preview"
      ></iframe>
      <PageNav
        backTo="/download-or-print"
        nextTo="/setup-page"
        nextText="- Want Another One?"
      />
    </>
  );
}

function PrintAllGrids({
  magnets,
}: {
  magnets: Array<{
    presignedUrl: string | null;
    name: string;
    quantity: number;
  }>;
}) {
  const allImages = magnets.flatMap((magnet) =>
    repeat(magnet, magnet.quantity)
  );
  const gridsOfImages = splitEvery(9)(allImages);
  return gridsOfImages.map((images, i) => (
    <MagnetGrid key={i} images={images} />
  ));
}

function MagnetGrid({
  images,
}: {
  images: Array<{ presignedUrl: string | null; name: string }>;
}) {
  return (
    <ul className="grid grid-cols-3 grid-rows-3 place-content-around aspect-square w-[125mm] gap-[6mm] p-[3mm] m-3 bg-white border-2">
      {images.map((magnet, i) => (
        <li key={i} className="bg-black relative overflow-clip">
          <img
            src={magnet.presignedUrl || "BROKE"}
            alt={magnet.name}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </li>
      ))}
    </ul>
  );
}
