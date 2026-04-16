import { isAuthEnabled, isLoggedIn } from "@/lib/auth/session";

export async function Topbar() {
  const authEnabled = isAuthEnabled();
  const loggedIn = await isLoggedIn();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div>
        <div className="text-lg font-semibold text-slate-900">
          game-project-hub
        </div>
        <div className="text-xs text-slate-500">
          游戏项目进度 / 版本 / 文件 / 风险统一后台
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
          内部使用
        </div>

        {authEnabled && loggedIn ? (
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              退出登录
            </button>
          </form>
        ) : null}

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          WM
        </div>
      </div>
    </header>
  );
}
