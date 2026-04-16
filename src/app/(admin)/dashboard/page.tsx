import { ProjectTable } from "@/components/project-table";
import { StatCard } from "@/components/stat-card";
import { getProjects } from "@/lib/data/project-repository";

export default async function DashboardPage() {
  const projects = await getProjects();
  const onGoing = projects.filter((item) => item.status === "开发中").length;
  const highRisk = projects.filter((item) => item.riskLevel === "高").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="项目总数" value={projects.length} />
        <StatCard label="开发中项目" value={onGoing} />
        <StatCard label="高风险项目" value={highRisk} />
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
