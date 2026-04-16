"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RiskFormMode = "create" | "edit";

export interface RiskFormValues {
  id?: string;
  projectId: string;
  title: string;
  level: string;
  type: string;
  description: string;
  owner: string;
  status: string;
  dueDate: string;
}

interface RiskProjectOption {
  id: string;
  name: string;
}

const levelOptions = ["低", "中", "高", "严重"];
const statusOptions = ["未解决", "处理中", "已解决", "已忽略"];

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
  initialValues?: Partial<RiskFormValues>
): RiskFormValues {
  return {
    id: initialValues?.id,
    projectId: initialValues?.projectId ?? "",
    title: initialValues?.title ?? "",
    level: initialValues?.level ?? "低",
    type: initialValues?.type ?? "",
    description: initialValues?.description ?? "",
    owner: initialValues?.owner ?? "",
    status: initialValues?.status ?? "未解决",
    dueDate: normalizeDate(initialValues?.dueDate),
  };
}

export function RiskForm({
  mode,
  projects,
  initialValues,
}: {
  mode: RiskFormMode;
  projects: RiskProjectOption[];
  initialValues?: Partial<RiskFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<RiskFormValues>(
    createInitialValues(initialValues)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLabel = useMemo(() => {
    return mode === "create" ? "创建风险" : "保存修改";
  }, [mode]);

  const fieldIds = useMemo(() => {
    const prefix = values.id ? `risk-${values.id}` : "risk-new";

    return {
      projectId: `${prefix}-project-id`,
      title: `${prefix}-title`,
      level: `${prefix}-level`,
      type: `${prefix}-type`,
      description: `${prefix}-description`,
      owner: `${prefix}-owner`,
      status: `${prefix}-status`,
      dueDate: `${prefix}-due-date`,
    };
  }, [values.id]);

  function setField<K extends keyof RiskFormValues>(
    key: K,
    value: RiskFormValues[K]
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

    if (!values.title.trim()) {
      setErrorMessage("风险标题不能为空。");
      return;
    }

    setSubmitting(true);

    try {
      const url = mode === "create" ? "/api/risks" : `/api/risks/${values.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "保存失败。");
      }

      router.push("/risks");
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
          <h2 className="text-lg font-semibold text-slate-900">风险信息</h2>
          <p className="mt-1 text-sm text-slate-500">
            先录入风险主表字段，后面再补处理记录。
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

          <Field id={fieldIds.title} label="风险标题 *">
            <input
              id={fieldIds.title}
              name="title"
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：实名接口卡点"
            />
          </Field>

          <Field id={fieldIds.level} label="风险等级">
            <select
              id={fieldIds.level}
              name="level"
              value={values.level}
              onChange={(e) => setField("level", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              {levelOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.status} label="处理状态">
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

          <Field id={fieldIds.type} label="风险类型">
            <input
              id={fieldIds.type}
              name="type"
              value={values.type}
              onChange={(e) => setField("type", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：渠道风险 / 技术风险 / 素材风险"
            />
          </Field>

          <Field id={fieldIds.owner} label="责任人">
            <input
              id={fieldIds.owner}
              name="owner"
              value={values.owner}
              onChange={(e) => setField("owner", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：张三"
            />
          </Field>

          <Field id={fieldIds.dueDate} label="预计解决时间">
            <input
              id={fieldIds.dueDate}
              name="dueDate"
              type="date"
              value={values.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            />
          </Field>

          <div className="md:col-span-2">
            <Field id={fieldIds.description} label="风险描述">
              <textarea
                id={fieldIds.description}
                name="description"
                value={values.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="例如：渠道最新实名参数未同步，提审可能被打回"
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
            href="/risks"
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
