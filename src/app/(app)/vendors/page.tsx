import { redirect } from "next/navigation";

export default function LegacyVendorsRedirect() {
  redirect("/app/vendors");
}
