import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Lynbrook Credit Tracker <onboarding@resend.dev>",
      to: process.env.FEEDBACK_EMAIL as string,
      subject: `Credit Tracker Feedback${name ? ` from ${name}` : ""}`,
      html: `
        <h2>New Feedback — Lynbrook Credit Tracker</h2>
        <p><strong>From:</strong> ${name?.trim() || "Anonymous"}</p>
        <hr />
        <p>${message.trim().replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback email error:", error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
