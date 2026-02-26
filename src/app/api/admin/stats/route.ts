import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Listing from "@/models/Listing";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const pendingListings = await Listing.countDocuments({ status: "Pending" });
    const approvedListings = await Listing.countDocuments({ status: "Approved" });
    const rejectedListings = await Listing.countDocuments({ status: "Rejected" });

    return NextResponse.json({
      totalUsers,
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
