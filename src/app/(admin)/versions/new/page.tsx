import { VersionForm } from "@/components/version-form";
import { getProjects } from "@/lib/data/project-repository";

export default async function NewVersionPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          新建版本
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          先录入版本核心字段，保存后再补任务、文件和风险。
        </p>
      </div>

      <VersionForm
        mode="create"
        projects={projects.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
      />
    </div>
  );
}
