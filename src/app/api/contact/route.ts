import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "business.bonjour77@icloud.com";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, product } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const subject = product
      ? `【お問い合わせ】${product} について`
      : `【お問い合わせ】${name}様より`;

    const body = `
お問い合わせがありました。

━━━━━━━━━━━━━━━━━━━━
お名前: ${name}
メール: ${email}
${product ? `商品: ${product}\n` : ""}━━━━━━━━━━━━━━━━━━━━

■ お問い合わせ内容

${message}

━━━━━━━━━━━━━━━━━━━━
このメールは わん・ダーランド のお問い合わせフォームから自動送信されました。
返信する場合は ${email} 宛にお送りください。
`.trim();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Wanderland <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text: body,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
