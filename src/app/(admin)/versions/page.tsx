import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { getProjects, getVersions } from "@/lib/data/project-repository";

export default async function VersionsPage() {
  const [versions, projects] = await Promise.all([getVersions(), getProjects()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          版本管理
        </h1>
        <p className="mt-1 text-sm text-slate-500">按版本看当前推进情况。</p>
      </div>

      <SectionCard title="版本列表">
        <div className="space-y-3">
          {versions.map((item) => {
            const project = projects.find(
              (projectItem) => projectItem.id === item.projectId
            );

            return (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-900">
                      {project?.name} · {item.versionNo} · {item.versionName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      目标：{item.goal}
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
                  完成度 {item.progressPercent}% · 提测 {item.testDate ?? "-"} · 提审{" "}
                  {item.reviewDate ?? "-"}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
