"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FileFormMode = "create" | "edit";

export interface FileFormValues {
  id?: string;
  projectId: string;
  versionId: string;
  fileName: string;
  fileType: string;
  fileCategory: string;
  fileUrl: string;
  sourcePlatform: string;
  uploader: string;
  isPinned: boolean;
  remark: string;
}

interface FileProjectOption {
  id: string;
  name: string;
}

interface FileVersionOption {
  id: string;
  projectId: string;
  versionNo: string;
  versionName: string;
}

function createInitialValues(
  initialValues?: Partial<FileFormValues>
): FileFormValues {
  return {
    id: initialValues?.id,
    projectId: initialValues?.projectId ?? "",
    versionId: initialValues?.versionId ?? "",
    fileName: initialValues?.fileName ?? "",
    fileType: initialValues?.fileType ?? "",
    fileCategory: initialValues?.fileCategory ?? "",
    fileUrl: initialValues?.fileUrl ?? "",
    sourcePlatform: initialValues?.sourcePlatform ?? "",
    uploader: initialValues?.uploader ?? "",
    isPinned: initialValues?.isPinned ?? false,
    remark: initialValues?.remark ?? "",
  };
}

export function FileForm({
  mode,
  projects,
  versions,
  initialValues,
}: {
  mode: FileFormMode;
  projects: FileProjectOption[];
  versions: FileVersionOption[];
  initialValues?: Partial<FileFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FileFormValues>(
    createInitialValues(initialValues)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLabel = useMemo(() => {
    return mode === "create" ? "创建文件" : "保存修改";
  }, [mode]);

  const fieldIds = useMemo(() => {
    const prefix = values.id ? `file-${values.id}` : "file-new";

    return {
      projectId: `${prefix}-project-id`,
      versionId: `${prefix}-version-id`,
      fileName: `${prefix}-file-name`,
      fileType: `${prefix}-file-type`,
      fileCategory: `${prefix}-file-category`,
      fileUrl: `${prefix}-file-url`,
      sourcePlatform: `${prefix}-source-platform`,
      uploader: `${prefix}-uploader`,
      isPinned: `${prefix}-is-pinned`,
      remark: `${prefix}-remark`,
    };
  }, [values.id]);

  const filteredVersions = useMemo(() => {
    if (!values.projectId) {
      return versions;
    }

    return versions.filter((item) => item.projectId === values.projectId);
  }, [values.projectId, versions]);

  function setField<K extends keyof FileFormValues>(
    key: K,
    value: FileFormValues[K]
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

    if (!values.fileName.trim()) {
      setErrorMessage("文件名称不能为空。");
      return;
    }

    if (!values.fileUrl.trim()) {
      setErrorMessage("文件链接不能为空。");
      return;
    }

    setSubmitting(true);

    try {
      const url = mode === "create" ? "/api/files" : `/api/files/${values.id}`;
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

      router.push("/files");
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
          <h2 className="text-lg font-semibold text-slate-900">文件信息</h2>
          <p className="mt-1 text-sm text-slate-500">
            先挂项目文件链接，后面再补真正上传能力。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={fieldIds.projectId} label="所属项目 *">
            <select
              id={fieldIds.projectId}
              name="projectId"
              value={values.projectId}
              onChange={(e) => {
                setField("projectId", e.target.value);
                setField("versionId", "");
              }}
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

          <Field id={fieldIds.versionId} label="所属版本">
            <select
              id={fieldIds.versionId}
              name="versionId"
              value={values.versionId}
              onChange={(e) => setField("versionId", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">不关联版本</option>
              {filteredVersions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.versionNo} {item.versionName ? `· ${item.versionName}` : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fieldIds.fileName} label="文件名称 *">
            <input
              id={fieldIds.fileName}
              name="fileName"
              value={values.fileName}
              onChange={(e) => setField("fileName", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：六界仙尊进度表.xlsx"
            />
          </Field>

          <Field id={fieldIds.fileType} label="文件类型">
            <input
              id={fieldIds.fileType}
              name="fileType"
              value={values.fileType}
              onChange={(e) => setField("fileType", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：xlsx / docx / pdf"
            />
          </Field>

          <Field id={fieldIds.fileCategory} label="文件分类">
            <input
              id={fieldIds.fileCategory}
              name="fileCategory"
              value={values.fileCategory}
              onChange={(e) => setField("fileCategory", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：进度表 / 上线计划 / 渠道接入"
            />
          </Field>

          <Field id={fieldIds.sourcePlatform} label="来源平台">
            <input
              id={fieldIds.sourcePlatform}
              name="sourcePlatform"
              value={values.sourcePlatform}
              onChange={(e) => setField("sourcePlatform", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：WPS / 飞书 / 网盘"
            />
          </Field>

          <Field id={fieldIds.uploader} label="上传人">
            <input
              id={fieldIds.uploader}
              name="uploader"
              value={values.uploader}
              onChange={(e) => setField("uploader", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
              placeholder="例如：张三"
            />
          </Field>

          <div className="flex items-center pt-7">
            <label
              htmlFor={fieldIds.isPinned}
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
            >
              <input
                id={fieldIds.isPinned}
                name="isPinned"
                type="checkbox"
                checked={values.isPinned}
                onChange={(e) => setField("isPinned", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              设为置顶文件
            </label>
          </div>

          <div className="md:col-span-2">
            <Field id={fieldIds.fileUrl} label="文件链接 *">
              <input
                id={fieldIds.fileUrl}
                name="fileUrl"
                value={values.fileUrl}
                onChange={(e) => setField("fileUrl", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900"
                placeholder="例如：https://..."
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
                placeholder="例如：当前主进度表"
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
            href="/files"
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
