import { FileForm } from "@/components/file-form";
import { getProjects, getVersions } from "@/lib/data/project-repository";

export default async function NewFilePage() {
  const [projects, versions] = await Promise.all([getProjects(), getVersions()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          新建文件
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          先挂文件链接，后面再补上传和预览能力。
        </p>
      </div>

      <FileForm
        mode="create"
        projects={projects.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
        versions={versions.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          versionNo: item.versionNo,
          versionName: item.versionName,
        }))}
      />
    </div>
  );
}
