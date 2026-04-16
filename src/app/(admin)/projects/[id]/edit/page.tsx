import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { getProjectDetail } from "@/lib/data/project-repository";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProjectDetail(id);

  if (!data) {
    notFound();
  }

  const { project } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          编辑项目
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          修改项目主表字段，保存后返回项目详情。
        </p>
      </div>

      <ProjectForm
        mode="edit"
        initialValues={{
          id: project.id,
          name: project.name,
          shortName: project.shortName,
          type: project.type,
          platform: project.platform,
          status: project.status,
          progressPercent: project.progressPercent,
          currentVersion: project.currentVersion,
          owner: project.owner,
          operatorOwner: project.operatorOwner,
          testOwner: project.testOwner,
          launchPlanDate: project.launchPlanDate,
          actualLaunchDate: project.actualLaunchDate ?? "",
          riskLevel: project.riskLevel,
          blocker: project.blocker ?? "",
          summary: project.summary ?? "",
        }}
      />
    </div>
  );
}
