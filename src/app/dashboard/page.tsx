import { PageHeader } from "@/components/dashboard/shared/page-header";
import { DashboardHome } from "@/components/dashboard/home/dashboard-home";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu funil de vendas e performance."
      />
      <DashboardHome />
    </div>
  );
}
