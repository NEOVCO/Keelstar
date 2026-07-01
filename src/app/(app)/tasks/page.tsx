import { redirect } from "next/navigation";

export default function LegacyTasksRedirect() {
  redirect("/app/inbox");
}
