import { companyInformation } from '@/const';

const signupSuccessForTeacherTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Welcome to Aula 360</title>
</head>
<body style="margin:0; padding:0; background-color:#0F172A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (inbox preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#0F172A; font-size:1px; line-height:1px;">
    Welcome to ${companyInformation.name}, {{name}}. Your faculty account is ready — view your schedule, take attendance, and manage your classes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0F172A" style="background-color:#0F172A; padding:40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%; max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 32px 24px 32px;">
              <img src="${companyInformation.logo}" alt="${companyInformation.name}" width="140" style="display:block; border:0; outline:none; text-decoration:none;" />
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:4px; width:48px; background-color:#0F172A; border-radius:2px; margin:0 auto;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <h1 style="margin:0 0 16px 0; color:#0F172A; font-size:26px; font-weight:700; letter-spacing:-0.5px; line-height:1.3;">
                Welcome to ${companyInformation.name}
              </h1>
              <p style="margin:0 0 8px 0; color:#0F172A; font-size:16px; line-height:1.6;">
                Hi <strong style="font-weight:600;">{{name}}</strong>, your faculty account is now active. We're glad to have you onboard.
              </p>
              <p style="margin:0; color:#475569; font-size:15px; line-height:1.6;">
                Your faculty portal is ready — everything you need to run your classes smoothly, right from your phone.
              </p>
            </td>
          </tr>

          <!-- Feature Card -->
          <tr>
            <td align="center" style="padding:24px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0F172A" style="background-color:#0F172A; border-radius:12px;">
                <tr>
                  <td align="left" style="padding:24px 24px 24px 24px;">
                    <span style="display:block; color:#ffffff; opacity:0.7; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;">
                      What You Can Do
                    </span>
                    <p style="margin:0 0 10px 0; color:#ffffff; font-size:15px; line-height:1.6;">
                      &bull;&nbsp; View your assigned class schedule and cohort rosters
                    </p>
                    <p style="margin:0 0 10px 0; color:#ffffff; font-size:15px; line-height:1.6;">
                      &bull;&nbsp; Start and end class sessions with entry and exit times
                    </p>
                    <p style="margin:0 0 10px 0; color:#ffffff; font-size:15px; line-height:1.6;">
                      &bull;&nbsp; Take attendance and submit post-class reports
                    </p>
                    <p style="margin:0; color:#ffffff; font-size:15px; line-height:1.6;">
                      &bull;&nbsp; Assign homework and track student progress
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry / Next step note -->
          <tr>
            <td align="center" style="padding:16px 40px 32px 40px;">
              <p style="margin:0; color:#475569; font-size:14px; line-height:1.6;">
                Log in to the <strong style="color:#0F172A; font-weight:600;">Teacher App</strong> to complete your profile and access your classes.<br />
                For schedule or cohort queries, contact your academy administrator.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none; border-top:1px solid #E2E8F0; margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px 36px 40px;">
              <p style="margin:0 0 8px 0; color:#475569; font-size:13px; line-height:1.6;">
                You're receiving this email because you were registered as faculty at ${companyInformation.name}.
              </p>
              <p style="margin:0 0 16px 0; color:#475569; font-size:13px; line-height:1.6;">
                Need help? Contact us at
                <a href="mailto:${companyInformation.email}" style="color:#0F172A; text-decoration:underline; font-weight:600;">${companyInformation.email}</a>
              </p>
              <p style="margin:0 0 16px 0; font-size:13px;">
                <a href="${companyInformation.website}/terms" style="color:#0F172A; text-decoration:underline; margin-right:12px;">Terms of Service</a>
                <a href="${companyInformation.website}/privacy" style="color:#0F172A; text-decoration:underline;">Privacy Policy</a>
              </p>
              <p style="margin:0 0 6px 0; color:#64748B; font-size:12px; line-height:1.6;">
                ${companyInformation.legalName}<br />
                ${companyInformation.address}<br />
                ${companyInformation.phone}
              </p>
              <p style="margin:0; color:#64748B; font-size:12px;">
                ${companyInformation.copyright}
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

export default signupSuccessForTeacherTemplate;
