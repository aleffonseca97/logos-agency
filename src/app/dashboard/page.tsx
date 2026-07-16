import { PageHeader } from "@/components/dashboard/shared/page-header";
import { DashboardHome } from "@/components/dashboard/home/dashboard-home";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão geral"
        description="Operação da Logos Agency — leads, clientes, projetos e performance em um só lugar."
      />
      <DashboardHome />
    </div>
  );
}
