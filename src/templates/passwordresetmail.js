const passwordResetmail = (otp) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Password Reset Request</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:20px;">
                <table width="100%" max-width="500px" style="background:#ffffff; border-radius:8px; padding:20px;">

                  <tr>
                    <td align="center">
                      <h2 style="color:#333;">Password Reset</h2>
                      <p style="color:#555; font-size:14px;">
                        Use the OTP below to give access to reset password
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <div style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:6px;
                        color:#2c3e50;
                        background:#f0f0f0;
                        padding:12px 24px;
                        border-radius:6px;
                        display:inline-block;
                      ">
                        ${otp}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">
                      <p style="color:#777; font-size:13px;">
                        This OTP is valid for <b>2 minutes</b>.
                      </p>
                      <p style="color:#999; font-size:12px;">
                        If you didn’t request this, please ignore this email.
                      </p>
                    </td>
                  </tr>

                </table>

                <p style="font-size:11px; color:#aaa; margin-top:10px;">
                  © 2025 Your App Name
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
    `
}

module.exports = passwordResetmail;