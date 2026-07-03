import { LeadDetailPage } from "@/components/dashboard/leads/lead-detail-page";
import { getWhatsAppNumber } from "@/lib/env";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailRoute({ params }: Props) {
  const { id } = await params;
  return <LeadDetailPage id={id} whatsappNumber={getWhatsAppNumber()} />;
}
