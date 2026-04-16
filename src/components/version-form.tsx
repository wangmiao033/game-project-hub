"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VersionFormMode = "create" | "edit";

export interface VersionFormValues {
  id?: string;
  projectId: string;
  versionNo: string;
  versionName: string;
  status: string;
  progressPercent: number;
  startDate: string;
  testDate: string;
  reviewDate: string;
  planLaunchDate: string;
  actualLaunchDate: string;
  goal: string;
  remark: string;
}

interface VersionProjectOption {
  id: string;
  name: string;
}

const versionStatusOptions = [
  "需求整理",
  "开发中",
  "联调中",
  "测试中",
  "提审中",
  "待上线",
  "已上线",
  "已关闭",
];

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
  initialValues?: Partial<VersionFormValues>
): VersionFormValues {
  return {
    id: initialValues?.id,
    projectId: initialValues?.projectId ?? "",
    versionNo: initialValues?.versionNo ?? "",
    versionName: initialValues?.versionName ?? "",
    status: initialValues?.status ?? "开发中",
    progressPercent: initialValues?.progressPercent ?? 0,
    startDate: normalizeDate(initialValues?.startDate),
    testDate: normalizeDate(initialValues?.testDate),
    reviewDate: normalizeDate(initialValues?.reviewDate),
    planLaunchDate: normalizeDate(initialValues?.planLaunchDate),
    actualLaunchDate: normalizeDate(initialValues?.actualLaunchDate),
    goal: initialValues?.goal ?? "",
    remark: initialValues?.remark ?? "",
  };
}

export function VersionForm({
  mode,
  projects,
  initialValues,
}: {
  mode: VersionFormMode;
  projects: VersionProjectOption[];
  initialValues?: Partial<VersionFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<VersionFormValues>(
    createInitialValues(initialValues)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLabel = useMemo(() => {
    return mode === "create" ? "创建版本" : "保存修改";
  }, [mode]);

  const fieldIds = useMemo(() => {
    const prefix = values.id ? `version-${values.id}` : "version-new";

    return {
      projectId: `${prefix}-project-id`,
      versionNo: `${prefix}-version-no`,
      versionName: `${prefix}-version-name`,
      status: `${prefix}-status`,
      progressPercent: `${prefix}-progress-percent`,
      startDate: `${prefix}-start-date`,
      testDate: `${prefix}-test-date`,
      reviewDate: `${prefix}-review-date`,
      planLaunchDate: `${prefix}-plan-launch-date`,
      actualLaunchDate: `${prefix}-actual-launch-date`,
      goal: `${prefix}-goal`,
      remark: `${prefix}-remark`,
    };
  }, [values.id]);

  function setField<K extends keyof VersionFormValues>(
    key: K,
    value: VersionFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!values.projectId) {
      setErrorMessage("请选择所属项目。");
      return;
    }

    if (!values.versionNo.trim()) {
      setErrorMessage("版本号不能为空。");
      return;
    }

    setSubmitting(true);

    try {
      const url =
        mode === "create" ? "/api/versions" : `/api/versions/${values.id}`;
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

      router.push("/versions");
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
          <h2 className="text-lg font-semibold text-slate-900">版本信息</h2>
          <p className="mt-1 text-sm text-slate-500">
            先维护项目版本主表，后面再补更多细节。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={fieldIds.projectId} label="所属项目 *">
            <select
              id={fieldIds.projectId}
              name="projectId"
              value={values.projectId}
              onChange={(e) => setField("projectId", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">请选择项目</option>
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.versionNo} label="版本号 *">
            <input
              id={fieldIds.versionNo}
              name="versionNo"
              value={values.versionNo}
              onChange={(e) => setField("versionNo", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：1.0.0"
            />
          </Field>

          <Field id={fieldIds.versionName} label="版本名称">
            <input
              id={fieldIds.versionName}
              name="versionName"
              value={values.versionName}
              onChange={(e) => setField("versionName", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：首发提审版"
            />
          </Field>

          <Field id={fieldIds.status} label="版本状态">
            <select
              id={fieldIds.status}
              name="status"
              value={values.status}
              onChange={(e) => setField("status", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              {versionStatusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.progressPercent} label="完成度">
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

          <Field id={fieldIds.startDate} label="开始时间">
            <input
              id={fieldIds.startDate}
              name="startDate"
              type="date"
              value={values.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <Field id={fieldIds.testDate} label="提测时间">
            <input
              id={fieldIds.testDate}
              name="testDate"
              type="date"
              value={values.testDate}
              onChange={(e) => setField("testDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <Field id={fieldIds.reviewDate} label="提审时间">
            <input
              id={fieldIds.reviewDate}
              name="reviewDate"
              type="date"
              value={values.reviewDate}
              onChange={(e) => setField("reviewDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <Field id={fieldIds.planLaunchDate} label="计划上线时间">
            <input
              id={fieldIds.planLaunchDate}
              name="planLaunchDate"
              type="date"
              value={values.planLaunchDate}
              onChange={(e) => setField("planLaunchDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <Field id={fieldIds.actualLaunchDate} label="实际上线时间">
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
            <Field id={fieldIds.goal} label="版本目标">
              <textarea
                id={fieldIds.goal}
                name="goal"
                value={values.goal}
                onChange={(e) => setField("goal", e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="例如：完成登录、支付、公告、活动接入"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field id={fieldIds.remark} label="备注">
              <textarea
                id={fieldIds.remark}
                name="remark"
                value={values.remark}
                onChange={(e) => setField("remark", e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="例如：支付回调要复核"
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
            href="/versions"
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
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
