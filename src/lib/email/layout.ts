export function wrapEmailHtml(bodyHtml: string, organizationName?: string): string {
  const footerOrg = organizationName ?? "your organization";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 20px;font-size:13px;font-weight:600;letter-spacing:0.02em;color:#6b7280;text-transform:uppercase;">Keelstar</p>
              <div style="font-size:15px;line-height:1.6;color:#14171a;">${bodyHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
              <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                Sent via Keelstar on behalf of ${footerOrg}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
