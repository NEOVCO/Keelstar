import { redirect } from "next/navigation";

export default function LegacyVendorDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/app/vendors/${params.id}`);
}
