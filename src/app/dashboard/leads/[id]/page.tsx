import { LeadDetailPage } from "@/components/dashboard/leads/lead-detail-page";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailRoute({ params }: Props) {
  const { id } = await params;
  return <LeadDetailPage id={id} />;
}
