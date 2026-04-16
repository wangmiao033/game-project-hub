import Link from "next/link";
import { PencilLine } from "lucide-react";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { getProjectDetail } from "@/lib/data/project-repository";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProjectDetail(id);

  if (!data) {
    notFound();
  }

  const { project, versions, tasks, files, risks } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{project.summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge value={project.status} />
          <StatusBadge value={project.riskLevel} />
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <PencilLine className="h-4 w-4" />
            编辑项目
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">当前版本</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {project.currentVersion || "-"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">计划上线</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {project.launchPlanDate || "-"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">项目负责人</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {project.owner || "-"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">完成度</div>
          <div className="mt-3">
            <ProgressBar value={project.progressPercent} label={`${project.name} 完成度`} />
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {project.progressPercent}%
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard title="版本进度">
            <div className="space-y-3">
              {versions.length > 0 ? (
                versions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.versionNo} · {item.versionName}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          目标：{item.goal || "-"}
                        </div>
                      </div>
                      <StatusBadge value={item.status} />
                    </div>

                    <div className="mt-4">
                      <ProgressBar
                        value={item.progressPercent}
                        label={`${item.versionNo} 版本进度`}
                      />
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      完成度 {item.progressPercent}% · 计划上线{" "}
                      {item.planLaunchDate ?? "-"}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyText text="暂无版本数据" />
              )}
            </div>
          </SectionCard>

          <SectionCard title="任务进度">
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          模块：{item.module} · 负责人：{item.assignee}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge value={item.status} />
                        <StatusBadge value={item.priority} />
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-slate-500">
                      风险：{item.riskNote || "无"}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyText text="暂无任务数据" />
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="文件中心">
            <div className="space-y-3">
              {files.length > 0 ? (
                files.map((item) => (
                  <a
                    key={item.id}
                    href={item.fileUrl}
                    className="block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                  >
                    <div className="font-medium text-slate-900">
                      {item.fileName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {item.fileCategory} · {item.sourcePlatform}
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      更新：{item.updatedAt}
                    </div>
                  </a>
                ))
              ) : (
                <EmptyText text="暂无文件数据" />
              )}
            </div>
          </SectionCard>

          <SectionCard title="风险问题">
            <div className="space-y-3">
              {risks.length > 0 ? (
                risks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-900">
                        {item.title}
                      </div>
                      <StatusBadge value={item.level} />
                    </div>

                    <div className="mt-2 text-sm text-slate-500">
                      {item.description}
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      责任人：{item.owner}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyText text="暂无风险数据" />
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <div className="text-sm text-slate-500">{text}</div>;
}
