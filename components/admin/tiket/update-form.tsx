"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { updateCar } from "@/app/admin/dashboard/edit/actions";

type Props = {
  car: {
    id: string;
    name: string;
    capacity: number;
    price: number;
    imageUrl: string;
  };
};

export default function UpdateCarForm({ car }: Props) {
  const inputfileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>(car.imageUrl);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  // 📤 upload image baru
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

        setImage(data.url); // 🔥 replace image lama
        setMessage("");
        toast.success("Image updated");
      } catch {
        toast.error("Upload failed");
      }
    });
  };

  // ❌ hapus image (optional)
  const deleteImage = async () => {
    if (!image) return;

    await fetch(`/api/upload?imageUrl=${encodeURIComponent(image)}`, {
      method: "DELETE",
    });

    setImage("");
  };

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          try {
            await updateCar(car.id, formData);
            toast.success("Car updated");
          } catch (e) {
            toast.error((e as Error).message);
          }
        });
      }}
      className="grid md:grid-cols-12 gap-5"
    >
      {/* LEFT */}
      <div className="col-span-8 bg-white p-4 space-y-4">
        <input
          name="name"
          defaultValue={car.name}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="capacity"
          defaultValue={car.capacity}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="price"
          defaultValue={car.price}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* RIGHT */}
      <div className="col-span-4 bg-white p-4 space-y-4">
        {/* IMAGE EDIT */}
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

        {/* 🔑 imageUrl WAJIB */}
        <input type="hidden" name="imageUrl" value={image} />

        <button
          disabled={pending}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {pending ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}
