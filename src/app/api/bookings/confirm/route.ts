import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// ─── Payment Details ───────────────────────────────────────────
// TODO: Replace placeholders with your real payment details
const MPESA_LIPA_NUMBER = process.env.MPESA_LIPA_NUMBER || 'CONTACT US FOR DETAILS'
const BANK_NAME         = 'Equity Bank'
const BANK_ACC_NAME     = 'BlackDot Music'
const BANK_ACC_NUMBER   = process.env.BANK_ACC_NUMBER || 'CONTACT US FOR DETAILS'
const BANK_SWIFT        = process.env.BANK_SWIFT_CODE || 'CONTACT US FOR DETAILS'
const APP_URL           = process.env.NEXT_PUBLIC_APP_URL || 'http://theblackdotmusic.com'
// ──────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY')
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)


    const {
      bookingRef,
      bookingId,
      clientEmail,
      clientName,
      serviceName,
      sessionDate,
      startTime,
      totalPrice,
    } = await req.json()

    if (!clientEmail || !bookingRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const formattedPrice = new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(totalPrice)

    const formattedDate = sessionDate
      ? new Date(sessionDate).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })
      : 'To be confirmed'

    const confirmPaymentUrl = `${APP_URL}/dashboard/payments/confirm?ref=${bookingRef}&booking_id=${bookingId}`

    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080808;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="padding-bottom:32px;" align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#7C3AED;border-radius:12px;padding:10px 14px;">
                          <span style="color:#ffffff;font-weight:900;font-size:18px;">B</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="color:#ffffff;font-weight:700;font-size:18px;">BlackDot Music</span>
                          <span style="display:block;color:rgba(255,255,255,0.4);font-size:12px;">Admin Notification</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Alert badge -->
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.3);border-radius:100px;padding:6px 18px;">
                          <span style="color:#fbbf24;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">New Booking Request</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">Action Required</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:15px;">A new booking has been submitted and is awaiting your confirmation.</p>
                  </td>
                </tr>

                <!-- Booking Ref -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <table cellpadding="0" cellspacing="0" style="background-color:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:16px 32px;">
                      <tr>
                        <td align="center">
                          <p style="margin:0 0 4px 0;color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Booking Reference</p>
                          <p style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:4px;font-family:monospace;">${bookingRef}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Booking Details -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Client</p>
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${clientName || 'Unknown'}</p>
                          <p style="margin:2px 0 0 0;color:rgba(255,255,255,0.4);font-size:13px;">${clientEmail}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Service</p>
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${serviceName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Requested Date</p>
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${formattedDate}${startTime ? ` at ${startTime}` : ''}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;background-color:rgba(124,58,237,0.08);">
                          <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Total Value</p>
                          <p style="margin:0;color:#a78bfa;font-size:22px;font-weight:900;">${formattedPrice}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:16px;padding:28px;">
                      <tr>
                        <td align="center">
                          <p style="margin:0 0 6px 0;color:#ffffff;font-size:15px;font-weight:700;">Review &amp; Confirm this Booking</p>
                          <p style="margin:0 0 24px 0;color:rgba(255,255,255,0.45);font-size:13px;">Log in to the admin dashboard to approve, schedule, or contact the client.</p>
                          <a href="https://theblackdotmusic.com/admin/bookings"
                            style="display:inline-block;background-color:#7C3AED;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:12px;letter-spacing:0.3px;">
                            View Booking in Admin →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
                    <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">BlackDot Music · Internal Notification · Do not reply to this email</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const [{ error }, { error: adminError }] = await Promise.all([
      resend.emails.send({
        from: 'BlackDot Music <bookings@theblackdotmusic.com>',
        to: clientEmail,
        subject: `Booking Confirmed – ${bookingRef} | Payment Required`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080808;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="padding-bottom:32px;" align="center">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#7C3AED;border-radius:12px;padding:10px 14px;">
                            <span style="color:#ffffff;font-weight:900;font-size:18px;">B</span>
                          </td>
                          <td style="padding-left:12px;">
                            <span style="color:#ffffff;font-weight:700;font-size:18px;">BlackDot Music</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Success Icon -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <span style="font-size:48px;">✅</span>
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;">Booking Confirmed!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <p style="margin:0;color:rgba(255,255,255,0.5);font-size:15px;">Hi ${clientName || 'there'}, your session has been booked. Please complete payment to secure your slot.</p>
                    </td>
                  </tr>

                  <!-- Booking Ref -->
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <table cellpadding="0" cellspacing="0" style="background-color:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:16px 32px;">
                        <tr>
                          <td align="center">
                            <p style="margin:0 0 4px 0;color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Booking Reference</p>
                            <p style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:4px;font-family:monospace;">${bookingRef}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Booking Details -->
                  <tr>
                    <td style="padding-bottom:32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                        <tr>
                          <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                            <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Service</p>
                            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${serviceName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                            <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Date</p>
                            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${formattedDate}</p>
                          </td>
                        </tr>
                        ${startTime ? `
                        <tr>
                          <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                            <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Time</p>
                            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">${startTime}</p>
                          </td>
                        </tr>` : ''}
                        <tr>
                          <td style="padding:20px 24px;background-color:rgba(124,58,237,0.08);">
                            <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Total Due</p>
                            <p style="margin:0;color:#a78bfa;font-size:22px;font-weight:900;">${formattedPrice}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Payment Instructions -->
                  <tr>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0;color:#ffffff;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">💳 How to Pay</p>
                    </td>
                  </tr>

                  <!-- M-Pesa -->
                  <tr>
                    <td style="padding-bottom:12px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid rgba(34,197,94,0.2);border-radius:14px;padding:20px 24px;">
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                              <tr>
                                <td style="background-color:rgba(34,197,94,0.15);border-radius:8px;padding:4px 10px;">
                                  <span style="color:#4ade80;font-size:12px;font-weight:700;">M-PESA LIPA</span>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="color:rgba(255,255,255,0.45);font-size:13px;padding-bottom:4px;">Lipa Na M-Pesa Number</td>
                                <td align="right" style="color:#ffffff;font-size:20px;font-weight:900;font-family:monospace;letter-spacing:2px;">${MPESA_LIPA_NUMBER}</td>
                              </tr>
                            </table>
                            <p style="margin:12px 0 0 0;color:rgba(255,255,255,0.35);font-size:12px;">Use your booking reference <strong style="color:#a78bfa;">${bookingRef}</strong> as the payment reference/description.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Bank Transfer -->
                  <tr>
                    <td style="padding-bottom:32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid rgba(59,130,246,0.2);border-radius:14px;padding:20px 24px;">
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                              <tr>
                                <td style="background-color:rgba(59,130,246,0.15);border-radius:8px;padding:4px 10px;">
                                  <span style="color:#60a5fa;font-size:12px;font-weight:700;">BANK TRANSFER</span>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="color:rgba(255,255,255,0.45);font-size:13px;padding-bottom:8px;">Bank</td>
                                <td align="right" style="color:#ffffff;font-size:13px;font-weight:600;">${BANK_NAME}</td>
                              </tr>
                              <tr>
                                <td style="color:rgba(255,255,255,0.45);font-size:13px;padding-bottom:8px;">Account Name</td>
                                <td align="right" style="color:#ffffff;font-size:13px;font-weight:600;">${BANK_ACC_NAME}</td>
                              </tr>
                              <tr>
                                <td style="color:rgba(255,255,255,0.45);font-size:13px;padding-bottom:8px;">Account Number</td>
                                <td align="right" style="color:#ffffff;font-size:16px;font-weight:900;font-family:monospace;letter-spacing:1px;">${BANK_ACC_NUMBER}</td>
                              </tr>
                              <tr>
                                <td style="color:rgba(255,255,255,0.45);font-size:13px;">SWIFT Code</td>
                                <td align="right" style="color:#ffffff;font-size:13px;font-weight:700;font-family:monospace;">${BANK_SWIFT}</td>
                              </tr>
                            </table>
                            <p style="margin:12px 0 0 0;color:rgba(255,255,255,0.35);font-size:12px;">Include <strong style="color:#a78bfa;">${bookingRef}</strong> as the payment description/narration.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Confirm Payment CTA -->
                  <tr>
                    <td style="padding-bottom:12px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:16px;padding:24px;">
                        <tr>
                          <td align="center">
                            <p style="margin:0 0 6px 0;color:#ffffff;font-size:15px;font-weight:700;">Paid? Let us know!</p>
                            <p style="margin:0 0 20px 0;color:rgba(255,255,255,0.45);font-size:13px;">Upload your receipt or paste your transaction ID so we can verify and confirm your booking.</p>
                            <a href="${confirmPaymentUrl}"
                              style="display:inline-block;background-color:#7C3AED;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
                              ✓ Confirm Payment
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Help text -->
                  <tr>
                    <td align="center" style="padding-bottom:40px;">
                      <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/255712168011" style="color:#a78bfa;text-decoration:none;">+255 712 168 011</a></p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
                      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.25);font-size:12px;">BlackDot Music · Dar es Salaam, Tanzania</p>
                      <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">
                        <a href="mailto:info@blackdotmusic.com" style="color:rgba(124,58,237,0.7);text-decoration:none;">info@blackdotmusic.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      }),
      resend.emails.send({
        from: 'BlackDot Music <bookings@theblackdotmusic.com>',
        to: 'bookings@theblackdotmusic.com',
        subject: `🎵 New Booking – ${bookingRef} | Action Required`,
        html: adminNotificationHtml,
      }),
    ])

    if (error) {
      console.error('Client email error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (adminError) {
      console.error('Admin notification email error:', adminError)
      // Non-fatal — client email succeeded, so the booking is still valid
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
