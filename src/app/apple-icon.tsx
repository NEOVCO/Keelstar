import { ImageResponse } from "next/og";
import { KeelMarkIcon } from "@/lib/keel-mark-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<KeelMarkIcon size={180} />, size);
}
