import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getRisks } from "@/lib/data/project-repository";

export default async function RisksPage() {
  const risks = await getRisks();

  return (
    <SectionCard title="风险清单">
      <div className="space-y-2">
        {risks.map((item) => (
          <div key={item.id} className="rounded border border-slate-200 p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-medium">{item.title}</div>
              <StatusBadge value={item.level} />
            </div>
            <div className="text-xs text-slate-600">{item.description}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
