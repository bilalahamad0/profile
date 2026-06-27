import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkBotId } from "botid/server";
import { verifySession, readCookie, SESSION_COOKIE } from "@/lib/security/session";
import { rateLimit, getClientIp, hashKey } from "@/lib/security/ratelimit";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reject anything that lets a crafted email value escape its single-address slot
 * in the reply-to: CR/LF (classic header injection) and the address-list /
 * angle-bracket characters nodemailer would otherwise parse as extra recipients.
 */
function isSafeHeaderValue(value: string): boolean {
  return !/[\r\n,<>]/.test(value) && value.length <= 254;
}

export async function POST(req: Request) {
  try {
    // 1. Vercel BotID (invisible, Basic): block automated clients the challenge
    //    flags. In local dev / off-Vercel this always returns isBot:false.
    const bot = await checkBotId();
    if (bot.isBot) {
      return NextResponse.json({ error: "Automated request blocked." }, { status: 403 });
    }

    // 2. Anti-automation gate: require the signed entry token the official frontend sets.
    const session = await verifySession(readCookie(req.headers.get("cookie"), SESSION_COOKIE));
    if (!session) {
      return NextResponse.json(
        { error: "Your session expired. Please reload the page and try again." },
        { status: 403 }
      );
    }

    // 3. Rate limit: per IP and (below) per email, so a valid session can't be a spam cannon.
    const ip = getClientIp(req);
    const ipLimit = await rateLimit(`contact:ip:${ip}`, 5, 3600); // 5 / hour / IP
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many messages from this network. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 4. Input hardening.
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    if (name.length > 120 || email.length > 254 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || !isSafeHeaderValue(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const emailLimit = await rateLimit(`contact:email:${await hashKey(email)}`, 3, 86400); // 3 / day / email
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: "You've already sent a few messages today. I'll be in touch soon." },
        { status: 429 }
      );
    }

    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE !== "false";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO || process.env.SMTP_FROM,
      replyTo: email,
      subject: `New Lead [bilalahamad.com] - ${safeName}`,
      text: `New submission from bilalahamad.com\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission from bilalahamad.com</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    // Log the real cause server-side; never leak internal/SMTP details to clients.
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
