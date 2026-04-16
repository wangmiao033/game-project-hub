import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectTable } from "@/components/project-table";
import { SectionCard } from "@/components/section-card";
import { getProjects } from "@/lib/data/project-repository";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            项目管理
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            先管理项目主表，后面再逐步补版本、任务、文件和风险。
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          新建项目
        </Link>
      </div>

      <SectionCard title="全部项目">
        <ProjectTable projects={projects} />
      </SectionCard>
    </div>
  );
}
