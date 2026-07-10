"use client";

export function CcSenderOption({
  checked,
  onChange,
  senderEmail,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  senderEmail?: string | null;
}) {
  if (!senderEmail) return null;

  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-secondary">
      <input
        type="checkbox"
        className="mt-0.5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        CC me on this email
        <span className="mt-0.5 block text-caption text-tertiary">{senderEmail}</span>
      </span>
    </label>
  );
}
