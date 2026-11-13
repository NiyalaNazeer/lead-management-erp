import { getSessionUser } from "../../../lib/auth";
import { redirect } from "next/navigation";
import LeadForm from "./LeadForm";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return <LeadForm />;
}