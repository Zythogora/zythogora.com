import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env["REVALIDATION_API_KEY"];

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("tags" in body) ||
    !Array.isArray(body.tags) ||
    body.tags.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid 'tags' array in request body" },
      { status: 400 },
    );
  }

  const invalidatedTags: string[] = [];

  for (const tag of body.tags) {
    if (typeof tag !== "string" || tag.length === 0 || tag.length > 256) {
      continue;
    }

    revalidateTag(tag, "max");
    invalidatedTags.push(tag);
  }

  return NextResponse.json({
    success: true,
    invalidatedTags,
  });
}
