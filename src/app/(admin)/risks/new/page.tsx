import { RiskForm } from "@/components/risk-form";
import { getProjects } from "@/lib/data/project-repository";

export default async function NewRiskPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          新建风险
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          先录入风险核心字段，保存后再补处理记录。
        </p>
      </div>

      <RiskForm
        mode="create"
        projects={projects.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
      />
    </div>
  );
}
