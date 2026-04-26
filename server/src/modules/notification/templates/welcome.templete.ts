export const WelcomeTemplate = (name: string, email: string, url: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background:#0f0f0f; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="520" style="margin-top:40px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#ff6a00,#ff8c00); padding:30px; text-align:center; color:#fff;">
                <div style="font-size:26px; font-weight:bold; letter-spacing:1px;">
                  ZYRA AI
                </div>
                <div style="font-size:14px; opacity:0.9; margin-top:6px;">
                  Intelligent Productivity Platform
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px; color:#333;">
                
                <h2 style="margin:0; font-size:22px;">
                  Welcome, ${name} 
                </h2>

                <p style="margin:15px 0; font-size:15px; color:#555; line-height:1.6;">
                  We're truly excited to have you with us. Your account has been successfully created 
                  with the email:
                </p>

                <!-- Email Box -->
                <div style="background:#fff4ec; border-left:4px solid #ff7a00; padding:12px 15px; border-radius:6px; font-size:14px; color:#333;">
                  ${email}
                </div>

                <p style="margin:20px 0; font-size:15px; color:#555; line-height:1.6;">
                  At <b>ZYRA AI</b>, we aim to help you streamline your workflow, automate tasks, 
                  and enhance productivity using intelligent systems.
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${url}" 
                     style="background:linear-gradient(135deg,#ff6a00,#ff8c00); color:#fff; padding:14px 28px; text-decoration:none; border-radius:8px; font-size:15px; font-weight:bold; display:inline-block;">
                     Get Started →
                  </a>
                </div>

                <!-- Divider -->
                <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

                <!-- Footer Text -->
                <p style="font-size:13px; color:#777; text-align:center;">
                  If you have any questions, feel free to reach out anytime.<br/>
                  We're here to support your journey 
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0f0f0f; color:#aaa; text-align:center; padding:18px; font-size:12px;">
                © 2026 ZYRA AI · All rights reserved
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