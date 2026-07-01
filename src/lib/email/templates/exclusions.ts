export function exclusionPotentialMatchEmail(vars: {
  subjectName: string;
  resultUrl: string;
}) {
  const subject = `Potential exclusion match found for ${vars.subjectName}`;
  const text = `A potential exclusion match was found for ${vars.subjectName}. Review the result in Keelstar: ${vars.resultUrl}\n\nPotential matches require human review. Keelstar does not make final compliance determinations.`;
  const html = `<p>A potential exclusion match was found for <strong>${vars.subjectName}</strong>.</p><p><a href="${vars.resultUrl}">Review screening result</a></p><p style="color:#666;font-size:12px;">Potential matches require human review. Keelstar does not make final compliance determinations.</p>`;
  return { subject, text, html };
}

export function exclusionMonitorFailedEmail(vars: { subjectName: string }) {
  const subject = `Exclusion screening failed for ${vars.subjectName}`;
  const text = `Scheduled exclusion screening failed for ${vars.subjectName}. Open Keelstar to review.`;
  const html = `<p>Scheduled exclusion screening failed for <strong>${vars.subjectName}</strong>.</p>`;
  return { subject, text, html };
}
