import { notFound } from "next/navigation";
import { VersionForm } from "@/components/version-form";
import {
  getProjects,
  getVersionById,
} from "@/lib/data/project-repository";

export default async function EditVersionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [projects, version] = await Promise.all([
    getProjects(),
    getVersionById(id),
  ]);

  if (!version) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          编辑版本
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          修改版本主表字段，保存后返回版本列表。
        </p>
      </div>

      <VersionForm
        mode="edit"
        projects={projects.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
        initialValues={{
          id: version.id,
          projectId: version.projectId,
          versionNo: version.versionNo,
          versionName: version.versionName,
          status: version.status,
          progressPercent: version.progressPercent,
          startDate: version.startDate,
          testDate: version.testDate ?? "",
          reviewDate: version.reviewDate ?? "",
          planLaunchDate: version.planLaunchDate ?? "",
          actualLaunchDate: version.actualLaunchDate ?? "",
          goal: version.goal ?? "",
          remark: version.remark ?? "",
        }}
      />
    </div>
  );
}
