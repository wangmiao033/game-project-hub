import Link from "next/link";
import { PencilLine, Plus } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { getProjects, getVersions } from "@/lib/data/project-repository";

export default async function VersionsPage() {
  const [versions, projects] = await Promise.all([getVersions(), getProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            版本管理
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            按版本看当前推进情况，并支持新增与编辑。
          </p>
        </div>

        <Link
          href="/versions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          新建版本
        </Link>
      </div>

      <SectionCard title="版本列表">
        <div className="space-y-3">
          {versions.length > 0 ? (
            versions.map((item) => {
              const project = projects.find(
                (projectItem) => projectItem.id === item.projectId
              );

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {project?.name ?? "未匹配项目"} · {item.versionNo} ·{" "}
                        {item.versionName || "未命名版本"}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        目标：{item.goal || "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge value={item.status} />
                      <Link
                        href={`/versions/${item.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        编辑
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      value={item.progressPercent}
                      label={`${item.versionNo} 版本进度`}
                    />
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    完成度 {item.progressPercent}% · 提测 {item.testDate ?? "-"} ·
                    提审 {item.reviewDate ?? "-"} · 计划上线{" "}
                    {item.planLaunchDate ?? "-"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-slate-500">暂无版本数据</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
