"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProjectFormMode = "create" | "edit";

export interface ProjectFormValues {
  id?: string;
  name: string;
  shortName: string;
  type: string;
  platform: string;
  status: string;
  progressPercent: number;
  currentVersion: string;
  owner: string;
  operatorOwner: string;
  testOwner: string;
  launchPlanDate: string;
  actualLaunchDate: string;
  riskLevel: string;
  blocker: string;
  summary: string;
}

const statusOptions = [
  "筹备中",
  "开发中",
  "测试中",
  "提审中",
  "待上线",
  "已上线",
  "已暂停",
];

const riskOptions = ["低", "中", "高", "严重"];

function normalizeDate(value?: string | null) {
  if (!value) {
    return "";
  }

  if (value.length >= 10) {
    return value.slice(0, 10);
  }

  return value;
}

function createInitialValues(
  initialValues?: Partial<ProjectFormValues>
): ProjectFormValues {
  return {
    id: initialValues?.id,
    name: initialValues?.name ?? "",
    shortName: initialValues?.shortName ?? "",
    type: initialValues?.type ?? "",
    platform: initialValues?.platform ?? "",
    status: initialValues?.status ?? "筹备中",
    progressPercent: initialValues?.progressPercent ?? 0,
    currentVersion: initialValues?.currentVersion ?? "",
    owner: initialValues?.owner ?? "",
    operatorOwner: initialValues?.operatorOwner ?? "",
    testOwner: initialValues?.testOwner ?? "",
    launchPlanDate: normalizeDate(initialValues?.launchPlanDate),
    actualLaunchDate: normalizeDate(initialValues?.actualLaunchDate),
    riskLevel: initialValues?.riskLevel ?? "低",
    blocker: initialValues?.blocker ?? "",
    summary: initialValues?.summary ?? "",
  };
}

export function ProjectForm({
  mode,
  initialValues,
}: {
  mode: ProjectFormMode;
  initialValues?: Partial<ProjectFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>(
    createInitialValues(initialValues)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLabel = useMemo(() => {
    return mode === "create" ? "创建项目" : "保存修改";
  }, [mode]);

  const fieldIds = useMemo(() => {
    const prefix = values.id ? `project-${values.id}` : "project-new";

    return {
      name: `${prefix}-name`,
      shortName: `${prefix}-short-name`,
      type: `${prefix}-type`,
      platform: `${prefix}-platform`,
      status: `${prefix}-status`,
      riskLevel: `${prefix}-risk-level`,
      currentVersion: `${prefix}-current-version`,
      progressPercent: `${prefix}-progress-percent`,
      owner: `${prefix}-owner`,
      operatorOwner: `${prefix}-operator-owner`,
      testOwner: `${prefix}-test-owner`,
      launchPlanDate: `${prefix}-launch-plan-date`,
      actualLaunchDate: `${prefix}-actual-launch-date`,
      blocker: `${prefix}-blocker`,
      summary: `${prefix}-summary`,
    };
  }, [values.id]);

  function setField<K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!values.name.trim()) {
      setErrorMessage("项目名称不能为空。");
      return;
    }

    setSubmitting(true);

    try {
      const url =
        mode === "create" ? "/api/projects" : `/api/projects/${values.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          progressPercent: Number(values.progressPercent) || 0,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "保存失败。");
      }

      const nextId = result.data?.id || values.id;

      if (nextId) {
        router.push(`/projects/${nextId}`);
        router.refresh();
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "保存失败，请稍后重试。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">基础信息</h2>
          <p className="mt-1 text-sm text-slate-500">
            先把核心字段录进去，后面再逐步扩展。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={fieldIds.name} label="项目名称 *">
            <input
              id={fieldIds.name}
              name="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：六界仙尊"
            />
          </Field>

          <Field id={fieldIds.shortName} label="项目简称">
            <input
              id={fieldIds.shortName}
              name="shortName"
              value={values.shortName}
              onChange={(e) => setField("shortName", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：六界"
            />
          </Field>

          <Field id={fieldIds.type} label="项目类型">
            <input
              id={fieldIds.type}
              name="type"
              value={values.type}
              onChange={(e) => setField("type", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：小游戏 / 联运APK / H5"
            />
          </Field>

          <Field id={fieldIds.platform} label="平台">
            <input
              id={fieldIds.platform}
              name="platform"
              value={values.platform}
              onChange={(e) => setField("platform", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：安卓 / 微信小游戏 / H5"
            />
          </Field>

          <Field id={fieldIds.status} label="状态">
            <select
              id={fieldIds.status}
              name="status"
              value={values.status}
              onChange={(e) => setField("status", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.riskLevel} label="风险等级">
            <select
              id={fieldIds.riskLevel}
              name="riskLevel"
              value={values.riskLevel}
              onChange={(e) => setField("riskLevel", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              {riskOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.currentVersion} label="当前版本">
            <input
              id={fieldIds.currentVersion}
              name="currentVersion"
              value={values.currentVersion}
              onChange={(e) => setField("currentVersion", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：0.1.8"
            />
          </Field>

          <Field id={fieldIds.progressPercent} label="进度百分比">
            <input
              id={fieldIds.progressPercent}
              name="progressPercent"
              type="number"
              min={0}
              max={100}
              value={values.progressPercent}
              onChange={(e) =>
                setField("progressPercent", Number(e.target.value) || 0)
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="0 - 100"
            />
          </Field>

          <Field id={fieldIds.owner} label="项目负责人">
            <input
              id={fieldIds.owner}
              name="owner"
              value={values.owner}
              onChange={(e) => setField("owner", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：张三"
            />
          </Field>

          <Field id={fieldIds.operatorOwner} label="运营负责人">
            <input
              id={fieldIds.operatorOwner}
              name="operatorOwner"
              value={values.operatorOwner}
              onChange={(e) => setField("operatorOwner", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：李四"
            />
          </Field>

          <Field id={fieldIds.testOwner} label="测试负责人">
            <input
              id={fieldIds.testOwner}
              name="testOwner"
              value={values.testOwner}
              onChange={(e) => setField("testOwner", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：王五"
            />
          </Field>

          <Field id={fieldIds.launchPlanDate} label="计划上线日期">
            <input
              id={fieldIds.launchPlanDate}
              name="launchPlanDate"
              type="date"
              value={values.launchPlanDate}
              onChange={(e) => setField("launchPlanDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <Field id={fieldIds.actualLaunchDate} label="实际上线日期">
            <input
              id={fieldIds.actualLaunchDate}
              name="actualLaunchDate"
              type="date"
              value={values.actualLaunchDate}
              onChange={(e) => setField("actualLaunchDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <div className="md:col-span-2">
            <Field id={fieldIds.blocker} label="当前卡点">
              <textarea
                id={fieldIds.blocker}
                name="blocker"
                value={values.blocker}
                onChange={(e) => setField("blocker", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="例如：渠道素材待确认 / SDK 文档未更新"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field id={fieldIds.summary} label="项目说明">
              <textarea
                id={fieldIds.summary}
                name="summary"
                value={values.summary}
                onChange={(e) => setField("summary", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="简单描述当前项目情况"
              />
            </Field>
          </div>
        </div>

        {errorMessage ? (
          <div
            className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "提交中..." : submitLabel}
          </button>

          <Link
            href={values.id ? `/projects/${values.id}` : "/projects"}
            className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            取消
          </Link>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
