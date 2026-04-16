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
