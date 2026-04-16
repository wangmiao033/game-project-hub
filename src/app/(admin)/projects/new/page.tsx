import { ProjectForm } from "@/components/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          新建项目
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          先录入项目核心字段，保存后再补其他模块。
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
