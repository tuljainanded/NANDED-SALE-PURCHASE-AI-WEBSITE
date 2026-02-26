import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/Post";
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

    const post = await Post.findById(id).populate("user", "name email");
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (status) post.status = status;
    if (typeof featured === "boolean") post.featured = featured;

    await post.save();

    // Send email on status change
    if (status && post.user?.email) {
      const subject = status === "Approved" ? "Your Post is Approved!" : "Post Update";
      const htmlContent = `
        <h2>Post ${status}</h2>
        <p>Hi ${post.user.name},</p>
        <p>Your post "<strong>${post.title}</strong>" has been <strong>${status}</strong> by the admin.</p>
        ${status === "Approved" ? '<p>It is now live on Nanded Sale Purchase.</p>' : ''}
        <br/>
        <p>Thanks,</p>
        <p>Nanded Sale Purchase Team</p>
      `;
      await sendEmail(post.user.email, subject, htmlContent);
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Update Post Error:", error);
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
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
