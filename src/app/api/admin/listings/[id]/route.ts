import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, featured } = await req.json();
    await connectToDatabase();

    const listing = await Listing.findById(id).populate("user", "name email");
    
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (status) listing.status = status;
    if (typeof featured === "boolean") listing.featured = featured;

    await listing.save();

    // Send email on status change
    if (status && listing.user?.email) {
      const subject = status === "Approved" ? "Your Listing is Approved!" : "Listing Update";
      const htmlContent = `
        <h2>Listing ${status}</h2>
        <p>Hi ${listing.user.name},</p>
        <p>Your listing "<strong>${listing.title}</strong>" has been <strong>${status}</strong> by the admin.</p>
        ${status === "Approved" ? '<p>It is now live on Nanded Sale Purchase.</p>' : ''}
        <br/>
        <p>Thanks,</p>
        <p>Nanded Sale Purchase Team</p>
      `;
      await sendEmail(listing.user.email, subject, htmlContent);
    }

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Update Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await Listing.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
