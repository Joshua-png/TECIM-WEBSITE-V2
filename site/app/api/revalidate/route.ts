import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const CACHE_TAG = "tecim-content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid secret" } },
      { status: 401 }
    );
  }

  revalidateTag(CACHE_TAG);
  return NextResponse.json({ success: true, revalidated: true });
}
