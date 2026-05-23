export const WelcomeTemplate = (name: string, email: string, url: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background-color:#f4f7f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f9; padding: 40px 0;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding:40px 30px; text-align:center;">
                <div style="font-size:28px; font-weight:800; letter-spacing:1.5px; color:#ffffff; margin-bottom: 4px;">
                  ZYRA AI
                </div>
                <div style="font-size:14px; font-weight: 500; color:#eff6ff; opacity:0.9;">
                  Intelligent Productivity Platform
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 35px; color:#334155;">
                
                <h2 style="margin:0 0 20px 0; font-size:22px; color:#0f172a; font-weight:700;">
                  Welcome, ${name}! 
                </h2>

                <p style="margin:0 0 20px 0; font-size:16px; color:#475569; line-height:1.6;">
                  We are thrilled to have you on board. Your account has been successfully provisioned and linked to the following email address:
                </p>

                <!-- Email Box -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #3b82f6; padding:14px 18px; border-radius:6px; font-size:15px; color:#0f172a; font-weight:500; margin-bottom: 24px;">
                  ${email}
                </div>

                <p style="margin:0 0 30px 0; font-size:16px; color:#475569; line-height:1.6;">
                  At <strong>ZYRA AI</strong>, our mission is to streamline your workflow, automate complex tasks, and supercharge your productivity using intelligent, agentic systems.
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin-bottom: 30px;">
                  <a href="${url}" 
                     style="background-color:#2563eb; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; display:inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">
                     Access Your Dashboard &rarr;
                  </a>
                </div>

                <!-- Divider -->
                <hr style="border:none; border-top:1px solid #e2e8f0; margin:0 0 24px 0;" />

                <!-- Support Text -->
                <p style="margin:0; font-size:14px; color:#64748b; text-align:center; line-height: 1.5;">
                  Have questions or need assistance? <br/>
                  Simply reply to this email. We're here to support your journey.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc; border-top: 1px solid #e2e8f0; color:#94a3b8; text-align:center; padding:20px; font-size:13px;">
                © 2026 ZYRA AI. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};