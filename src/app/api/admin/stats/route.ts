import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const pendingPosts = await Post.countDocuments({ status: "Pending" });
    const approvedPosts = await Post.countDocuments({ status: "Approved" });
    const rejectedPosts = await Post.countDocuments({ status: "Rejected" });

    return NextResponse.json({
      totalUsers,
      totalPosts,
      pendingPosts,
      approvedPosts,
      rejectedPosts,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
