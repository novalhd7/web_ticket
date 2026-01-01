// components/admin/tiket/delete-button.tsx
"use client";

import { deleteCar } from "@/app/admin/dashboard/delete/actions";
import { toast } from "sonner";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Yakin hapus data?")) return;

        try {
          await deleteCar(id);
          toast.success("Car deleted");
        } catch {
          toast.error("Failed delete car");
        }
      }}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>
  );
}
