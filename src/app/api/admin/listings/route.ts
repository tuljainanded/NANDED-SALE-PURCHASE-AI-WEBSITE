import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Listing from "@/models/Listing";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const listings = await Listing.find().populate("user", "name email").sort({ createdAt: -1 });
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Fetch Listings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
