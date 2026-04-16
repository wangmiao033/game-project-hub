import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  筹备中: "bg-slate-100 text-slate-700",
  开发中: "bg-blue-100 text-blue-700",
  测试中: "bg-amber-100 text-amber-700",
  提审中: "bg-violet-100 text-violet-700",
  待上线: "bg-cyan-100 text-cyan-700",
  已上线: "bg-emerald-100 text-emerald-700",
  已暂停: "bg-rose-100 text-rose-700",
  低: "bg-emerald-100 text-emerald-700",
  中: "bg-amber-100 text-amber-700",
  高: "bg-orange-100 text-orange-700",
  严重: "bg-rose-100 text-rose-700",
  进行中: "bg-blue-100 text-blue-700",
  待确认: "bg-amber-100 text-amber-700",
  已完成: "bg-emerald-100 text-emerald-700",
  已延期: "bg-rose-100 text-rose-700",
  已阻塞: "bg-rose-100 text-rose-700",
  处理中: "bg-blue-100 text-blue-700",
  未解决: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        colorMap[value] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {value}
    </span>
  );
}
