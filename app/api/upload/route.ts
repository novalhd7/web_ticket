import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image files allowed" },
      { status: 400 }
    );
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ message: "Max 4MB" }, { status: 400 });
  }

  const blob = await put(`cars/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("imageUrl");

  if (imageUrl) {
    await del(imageUrl);
  }

  return NextResponse.json({ success: true });
}
