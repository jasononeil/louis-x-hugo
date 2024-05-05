import { useRef, useState } from "react";
import { getUploadUrl } from "../routes/get-upload-url";

export function ImageUploadField({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const files = fileInputRef.current?.files;
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

  return (
    <label>
      {label}:
      {imageSrc && imageKey ? (
        <>
          <img src={imageSrc} alt="User uploaded background" />
          <input type="hidden" name={name} value={imageKey} />
        </>
      ) : (
        <>
          <input type="file" ref={fileInputRef} accept="image/*" />
          <button
            type="submit"
            className="border-solid border-black border w-fit p-2"
            onClick={handleUpload}
          >
            Upload
          </button>
        </>
      )}
    </label>
  );
}
