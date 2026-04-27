export const otpTemplate = (otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background:#0f0f0f; font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="520" style="margin-top:40px; background:#ffffff; border-radius:14px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#ff6a00,#ff8c00); padding:25px; text-align:center; color:#fff;">
                <h2 style="margin:0;">ZYRA AI</h2>
                <p style="margin:5px 0 0; font-size:13px;">Secure Verification</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; text-align:center;">
                
                <p style="font-size:16px; color:#333;">Your verification code</p>

                <div style="font-size:34px; font-weight:bold; letter-spacing:8px; color:#ff6a00; margin:20px 0;">
                  ${otp}
                </div>

                <p style="font-size:13px; color:#777;">
                  This code will expire in 5 minutes.<br/>
                  Do not share this code with anyone.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0f0f0f; color:#aaa; text-align:center; padding:15px; font-size:12px;">
                © 2026 ZYRA AI
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