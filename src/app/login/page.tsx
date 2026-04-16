import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isAuthEnabled, isLoggedIn } from "@/lib/auth/session";

export default async function LoginPage() {
  const authEnabled = isAuthEnabled();

  if (!authEnabled) {
    redirect("/dashboard");
  }

  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            登录后台
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            输入后台账号和密码后进入项目管理中心。
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
