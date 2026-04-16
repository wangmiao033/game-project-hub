import Link from "next/link";
import { FolderKanban, LayoutDashboard, ShieldAlert, Upload, Workflow } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "看板", icon: LayoutDashboard },
  { href: "/projects", label: "项目", icon: FolderKanban },
  { href: "/versions", label: "版本", icon: Workflow },
  { href: "/files", label: "文件", icon: Upload },
  { href: "/risks", label: "风险", icon: ShieldAlert },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-200 bg-white p-4">
      <div className="mb-6 text-lg font-semibold">Game Project Hub</div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
