import { redirect } from "next/navigation";

export default function LegacyRequestRedirect({ params }: { params: { id: string } }) {
  redirect(`/app/workflows/${params.id}`);
}
