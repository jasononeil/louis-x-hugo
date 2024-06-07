import { useEffect, useRef, useState } from "react";
import { getUploadUrl } from "../routes/get-upload-url";
import { getDownloadUrl } from "~/routes/get-download-url";

export function ImageUploadField({
  label,
  name,
  existingUploadKey,
}: {
  label: string;
  name: string;
  existingUploadKey?: string;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (existingUploadKey) {
      setImageKey(existingUploadKey);
      getDownloadUrl({
        key: existingUploadKey,
      })
        .then(({ preSignedGetUrl }) => {
          setImageSrc(preSignedGetUrl);
        })
        .catch((err) => console.error(`Error calling getDownloadUrl:`, err));
    }
  }, [existingUploadKey]);

  async function handleUpload(
    e: React.FormEvent | React.DragEvent,
    drop: boolean = false
  ) {
    e.preventDefault();
    const files = drop
      ? (e as React.DragEvent).dataTransfer.files
      : fileInputRef.current?.files;
    if (files && files[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { preSignedUploadUrl, preSignedGetUrl, key } = await getUploadUrl(
          {
            project: "upload-test",
            filename: file.name,
          }
        );

        const result = await fetch(preSignedUploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (result.ok) {
          setImageKey(key);
          setImageSrc(preSignedGetUrl);
          console.log("Upload successful");
        } else {
          throw new Error(
            `Upload failed: ${result.status} ${result.statusText}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleUpload(e, true);
  }

  return (
    <label className="border-t border-b border-gray-400 border-solid p-4 flex flex-col">
      {label}:
      {imageSrc && imageKey ? (
        <div className="h-auto max-w-[300px]">
          <img src={imageSrc} alt="User uploaded background" ref={imageRef} />
          <dl className="flex space-x-2">
            <dt>Dimensions:</dt>
            <dd>
              {imageRef?.current?.naturalWidth ?? "width"}x
              {imageRef?.current?.naturalHeight ?? "height"}
            </dd>
          </dl>
          <input type="hidden" name={name} value={imageKey} />
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => {
              handleDrop(e);
            }}
            className="w-[200px] h-[150px] border-dashed border rounded border-gray-400 flex flex-col items-center justify-center space-y-2 hover:cursor-pointer"
          >
            Select or drop image
            <input
              type="file"
              id="imageInput"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
          <button
            type="submit"
            className="border-solid border-black border w-fit p-1"
            onClick={handleUpload}
          >
            Upload
          </button>
        </>
      )}
    </label>
  );
}
