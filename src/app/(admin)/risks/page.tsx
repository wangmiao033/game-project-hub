import Link from "next/link";
import { PencilLine, Plus } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getProjects, getRisks } from "@/lib/data/project-repository";

export default async function RisksPage() {
  const [risks, projects] = await Promise.all([getRisks(), getProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            风险问题
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            集中维护风险登记，并支持新增与编辑。
          </p>
        </div>

        <Link
          href="/risks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          新建风险
        </Link>
      </div>

      <SectionCard title="风险列表">
        <div className="space-y-3">
          {risks.length > 0 ? (
            risks.map((item) => {
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
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        项目：{project?.name ?? "未匹配项目"} · 类型：{item.type || "-"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge value={item.level} />
                      <StatusBadge value={item.status} />
                      <Link
                        href={`/risks/${item.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        编辑
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-500">
                    {item.description || "暂无描述"}
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    责任人：{item.owner || "-"} · 截止：{item.dueDate ?? "-"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-slate-500">暂无风险数据</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
