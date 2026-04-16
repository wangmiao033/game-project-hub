import Link from "next/link";
import { ProjectItem } from "@/types/project";
import { StatusBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";

export function ProjectTable({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">项目</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">当前版本</th>
            <th className="px-4 py-3 font-medium">进度</th>
            <th className="px-4 py-3 font-medium">负责人</th>
            <th className="px-4 py-3 font-medium">计划上线</th>
            <th className="px-4 py-3 font-medium">风险</th>
            <th className="px-4 py-3 font-medium">最近更新</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">
                  <Link href={`/projects/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {item.type} / {item.platform}
                </div>
              </td>
              <td className="px-4 py-4">
                <StatusBadge value={item.status} />
              </td>
              <td className="px-4 py-4">{item.currentVersion}</td>
              <td className="px-4 py-4">
                <div className="w-36">
                  <ProgressBar value={item.progressPercent} label={`${item.name} 进度`} />
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {item.progressPercent}%
                </div>
              </td>
              <td className="px-4 py-4">{item.owner}</td>
              <td className="px-4 py-4">{item.launchPlanDate}</td>
              <td className="px-4 py-4">
                <StatusBadge value={item.riskLevel} />
              </td>
              <td className="px-4 py-4 text-slate-500">{item.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
