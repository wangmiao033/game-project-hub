import { notFound } from "next/navigation";
import { RiskForm } from "@/components/risk-form";
import { getProjects, getRiskById } from "@/lib/data/project-repository";

export default async function EditRiskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [projects, risk] = await Promise.all([getProjects(), getRiskById(id)]);

  if (!risk) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          编辑风险
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          修改风险主表字段，保存后返回风险列表。
        </p>
      </div>

      <RiskForm
        mode="edit"
        projects={projects.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
        initialValues={{
          id: risk.id,
          projectId: risk.projectId,
          title: risk.title,
          level: risk.level,
          type: risk.type ?? "",
          description: risk.description ?? "",
          owner: risk.owner ?? "",
          status: risk.status,
          dueDate: risk.dueDate ?? "",
        }}
      />
    </div>
  );
}
