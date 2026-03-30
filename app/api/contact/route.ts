import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, honeypot } = await req.json()

    // ── Honeypot: bots fill hidden fields, humans don't ──────────────────
    if (honeypot) {
      // Return a fake success so bots think it worked
      return NextResponse.json({ success: true })
    }

    // ── Field validation ─────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // ── Basic email format check ──────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // ── Resolve credentials (support both naming conventions) ─────────────
    const smtpUser = process.env.GMAIL_USER ?? process.env.SMTP_USER
    const smtpPass = process.env.GMAIL_APP_PASSWORD ?? process.env.SMTP_PASS
    const receiver = process.env.CONTACT_RECEIVER

    if (!smtpUser || !smtpPass || !receiver) {
      console.error('[contact route] Missing SMTP environment variables')
      return NextResponse.json({ error: 'Server email configuration error.' }, { status: 500 })
    }

    // ── Create transporter ────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false, // STARTTLS on port 587
      auth: { user: smtpUser, pass: smtpPass },
    })

    // ── Send email ────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Vansh's Portfolio" <${smtpUser}>`,
      to: receiver,
      replyTo: `"${name}" <${email}>`,
      subject: `[Portfolio Contact] ${subject} - from ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;border:1px solid rgba(93,202,165,0.15);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#5DCAA5,#38866e);padding:28px 32px;">
              <h1 style="margin:0;color:#0A0F1E;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
                📬 New Portfolio Contact
              </h1>
              <p style="margin:6px 0 0;color:rgba(10,15,30,0.7);font-size:13px;">via vansh.dev contact form</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px;background:rgba(93,202,165,0.06);border-radius:10px;border:1px solid rgba(93,202,165,0.12);">
                    <p style="margin:0 0 6px;color:#8892A4;font-size:11px;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:0;color:#E8EDF5;font-size:16px;font-weight:600;">${escapeHtml(name)}</p>
                    <a href="mailto:${escapeHtml(email)}" style="color:#5DCAA5;font-size:13px;text-decoration:none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
              </table>
              <!-- Subject -->
              <p style="margin:0 0 6px;color:#8892A4;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Subject</p>
              <p style="margin:0 0 24px;color:#E8EDF5;font-size:15px;font-weight:500;padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #5DCAA5;">
                ${escapeHtml(subject)}
              </p>
              <!-- Message -->
              <p style="margin:0 0 6px;color:#8892A4;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;border:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;color:#CDD5E0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
              </div>
              <!-- Reply hint -->
              <p style="margin:24px 0 0;color:#8892A4;font-size:12px;text-align:center;">
                💡 Hit <strong style="color:#5DCAA5;">Reply</strong> to respond directly to ${escapeHtml(name)}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;color:#4B5563;font-size:11px;">Sent via Vansh Lakhwani's Portfolio · vansh.dev</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact route]', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email me directly.' },
      { status: 500 },
    )
  }
}

/** Basic HTML escape to prevent injection in email body */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
