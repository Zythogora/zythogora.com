import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getPlaceAddressDetails } from "@/lib/places";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");
  const sessionToken = searchParams.get("sessionToken");

  if (!placeId || !sessionToken) {
    return NextResponse.json(
      { error: "Missing required parameters: placeId and sessionToken" },
      { status: 400 },
    );
  }

  try {
    const addressDetails = await getPlaceAddressDetails(placeId, sessionToken);
    return NextResponse.json(addressDetails);
  } catch (error) {
    console.error("Error fetching place address details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place address details" },
      { status: 500 },
    );
  }
}
