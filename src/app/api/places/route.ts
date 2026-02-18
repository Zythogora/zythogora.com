import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { addToSpan, recordError } from "@/lib/logger";
import { getAutocompleteSuggestions } from "@/lib/places";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const sessionToken = searchParams.get("sessionToken");

  if (!search || !sessionToken) {
    return NextResponse.json(
      { error: "Missing required parameters: search and sessionToken" },
      { status: 400 },
    );
  }

  addToSpan({ "user.id": user.id });

  try {
    const suggestions = await getAutocompleteSuggestions(search, sessionToken);
    return NextResponse.json(suggestions);
  } catch (error) {
    recordError(error);
    return NextResponse.json(
      { error: "Failed to fetch place suggestions" },
      { status: 500 },
    );
  }
}
