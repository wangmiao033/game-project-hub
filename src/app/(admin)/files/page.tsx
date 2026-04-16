import Link from "next/link";
import { PencilLine, Plus } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import {
  getFiles,
  getProjects,
  getVersions,
} from "@/lib/data/project-repository";

export default async function FilesPage() {
  const [files, projects, versions] = await Promise.all([
    getFiles(),
    getProjects(),
    getVersions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            文件中心
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            挂项目文件链接，并支持新增与编辑。
          </p>
        </div>

        <Link
          href="/files/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          新建文件
        </Link>
      </div>

      <SectionCard title="全部文件">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">文件名</th>
                <th className="px-4 py-3 font-medium">项目</th>
                <th className="px-4 py-3 font-medium">版本</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">来源</th>
                <th className="px-4 py-3 font-medium">上传人</th>
                <th className="px-4 py-3 font-medium">置顶</th>
                <th className="px-4 py-3 font-medium">更新时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((item) => {
                  const project = projects.find(
                    (projectItem) => projectItem.id === item.projectId
                  );
                  const version = versions.find(
                    (versionItem) => versionItem.id === item.versionId
                  );

                  return (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-4">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {item.fileName}
                        </a>
                      </td>
                      <td className="px-4 py-4">{project?.name ?? "-"}</td>
                      <td className="px-4 py-4">
                        {version
                          ? `${version.versionNo}${version.versionName ? ` · ${version.versionName}` : ""}`
                          : "-"}
                      </td>
                      <td className="px-4 py-4">{item.fileCategory || "-"}</td>
                      <td className="px-4 py-4">{item.sourcePlatform || "-"}</td>
                      <td className="px-4 py-4">{item.uploader || "-"}</td>
                      <td className="px-4 py-4">
                        {item.isPinned ? "是" : "否"}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {item.updatedAt || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/files/${item.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <PencilLine className="h-4 w-4" />
                          编辑
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    暂无文件数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
import { SectionCard } from "@/components/section-card";
import { getFiles } from "@/lib/data/project-repository";

export default async function FilesPage() {
  const files = await getFiles();

  return (
    <SectionCard title="项目文件">
      <ul className="space-y-2">
        {files.map((item) => (
          <li key={item.id} className="rounded border border-slate-200 p-3">
            <div className="font-medium">{item.fileName}</div>
            <div className="text-xs text-slate-500">
              {item.fileCategory} · {item.sourcePlatform} · 更新于 {item.updatedAt}
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
