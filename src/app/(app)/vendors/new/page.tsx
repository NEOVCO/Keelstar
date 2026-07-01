import { redirect } from "next/navigation";

export default function LegacyNewVendorRedirect() {
  redirect("/app/vendors/new");
}
