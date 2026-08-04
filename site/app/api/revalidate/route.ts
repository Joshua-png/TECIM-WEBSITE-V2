import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const CACHE_TAG = "tecim-content";

function authorize(secret: string | null): boolean {
  return Boolean(process.env.REVALIDATE_SECRET) && secret === process.env.REVALIDATE_SECRET;
}

function revalidate({ slug }: { slug?: string[] }): void {
  revalidateTag(CACHE_TAG);
  if (Array.isArray(slug)) {
    for (const path of slug) {
      revalidatePath(path, "page");
    }
  }
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Invalid secret" } },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!authorize(searchParams.get("secret"))) return unauthorized();
  revalidate({});
  return NextResponse.json({ success: true, revalidated: true });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!authorize(searchParams.get("secret"))) return unauthorized();

  let body: { slug?: string[] } = {};
  try {
    body = (await request.json()) as { slug?: string[] };
  } catch {
    // No JSON body; tag revalidation alone is enough.
  }

  revalidate(body);
  return NextResponse.json({ success: true, revalidated: true });
}
