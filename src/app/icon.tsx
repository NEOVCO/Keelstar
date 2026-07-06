import { ImageResponse } from "next/og";
import { KeelMarkIcon } from "@/lib/keel-mark-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<KeelMarkIcon size={32} />, size);
}
