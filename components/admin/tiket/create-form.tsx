"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { BarLoader } from "react-spinners";

type Props = {
  action: (formData: FormData) => void;
};

const CreateForm = ({ action }: Props) => {
  const inputfileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const handleUpload = () => {
    if (!inputfileRef.current?.files) return;

    const file = inputfileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message);
          return;
        }

        setImage(data.url);
        setMessage("");
      } catch {
        setMessage("Upload failed");
      }
    });
  };

  const deleteImage = () => {
    if (!image) return;

    startTransition(async () => {
      await fetch(`/api/upload?imageUrl=${encodeURIComponent(image)}`, {
        method: "DELETE",
      });
      setImage(null);
    });
  };

  return (
    <form action={action} className="grid md:grid-cols-12 gap-5">
      {/* LEFT */}
      <div className="col-span-8 bg-white p-4 space-y-4">
        <input
          name="name"
          placeholder="Nama Mobil"
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          rows={8}
          placeholder="Deskripsi"
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* RIGHT */}
      <div className="col-span-4 bg-white p-4 space-y-4">
        {/* IMAGE */}
        <div className="relative aspect-video border-2 border-dashed rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
          {pending && (
            <div className="absolute z-30">
              <BarLoader />
            </div>
          )}

          {!image ? (
            <>
              <input
                ref={inputfileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className="text-center text-gray-500 z-10">
                <p className="font-semibold">Upload image</p>
                <p className="text-xs">PNG, JPG (Max 4MB)</p>
                {message && (
                  <p className="text-red-500 text-xs mt-1">{message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <Image src={image} alt="preview" fill className="object-cover" />
              <button
                type="button"
                onClick={deleteImage}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* HIDDEN IMAGE URL */}
        {image && <input type="hidden" name="imageUrl" value={image} />}

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateForm;
