import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import {
  getFilesByProjectId,
  getProjectById,
  getRisksByProjectId,
  getTasksByProjectId,
  getVersionsByProjectId,
  mockFiles,
  mockProjects,
  mockRisks,
  mockVersions,
} from "@/lib/mock";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ProjectFileItem,
  ProjectItem,
  ProjectRiskItem,
  ProjectTaskItem,
  ProjectVersionItem,
} from "@/types/project";

export interface ProjectDetailData {
  project: ProjectItem;
  versions: ProjectVersionItem[];
  tasks: ProjectTaskItem[];
  files: ProjectFileItem[];
  risks: ProjectRiskItem[];
}

export interface ProjectFormInput {
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

export interface RepositoryWriteResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

type ProjectRow = {
  id: string;
  name: string;
  short_name: string | null;
  type: string | null;
  platform: string | null;
  status: string | null;
  progress_percent: number | null;
  current_version: string | null;
  owner: string | null;
  operator_owner: string | null;
  test_owner: string | null;
  launch_plan_date: string | null;
  actual_launch_date: string | null;
  risk_level: string | null;
  blocker: string | null;
  summary: string | null;
  updated_at: string | null;
};

type VersionRow = {
  id: string;
  project_id: string;
  version_no: string;
  version_name: string | null;
  status: string | null;
  progress_percent: number | null;
  start_date: string | null;
  test_date: string | null;
  review_date: string | null;
  plan_launch_date: string | null;
  actual_launch_date: string | null;
  goal: string | null;
  remark: string | null;
};

type TaskRow = {
  id: string;
  project_id: string;
  version_id: string | null;
  title: string;
  module: string | null;
  assignee: string | null;
  start_date: string | null;
  due_date: string | null;
  status: string | null;
  priority: string | null;
  progress_percent: number | null;
  risk_note: string | null;
  remark: string | null;
};

type FileRow = {
  id: string;
  project_id: string;
  version_id: string | null;
  file_name: string;
  file_type: string | null;
  file_category: string | null;
  file_url: string;
  source_platform: string | null;
  uploader: string | null;
  is_pinned: boolean | null;
  remark: string | null;
  updated_at: string | null;
};

type RiskRow = {
  id: string;
  project_id: string;
  title: string;
  level: string | null;
  type: string | null;
  description: string | null;
  owner: string | null;
  status: string | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function nullableText(value: unknown) {
  const result = text(value).trim();
  return result ? result : null;
}

function numberValue(value: unknown, defaultValue = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function dateValue(value: unknown) {
  const result = text(value).trim();
  return result ? result : null;
}

function mapProjectRow(row: ProjectRow): ProjectItem {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name ?? "",
    type: row.type ?? "",
    platform: row.platform ?? "",
    status: row.status ?? "筹备中",
    progressPercent: row.progress_percent ?? 0,
    currentVersion: row.current_version ?? "",
    owner: row.owner ?? "",
    operatorOwner: row.operator_owner ?? "",
    testOwner: row.test_owner ?? "",
    launchPlanDate: row.launch_plan_date ?? "",
    actualLaunchDate: row.actual_launch_date,
    riskLevel: row.risk_level ?? "低",
    blocker: row.blocker ?? "",
    summary: row.summary ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

function mapVersionRow(row: VersionRow): ProjectVersionItem {
  return {
    id: row.id,
    projectId: row.project_id,
    versionNo: row.version_no,
    versionName: row.version_name ?? "",
    status: row.status ?? "",
    progressPercent: row.progress_percent ?? 0,
    startDate: row.start_date ?? "",
    testDate: row.test_date,
    reviewDate: row.review_date,
    planLaunchDate: row.plan_launch_date,
    actualLaunchDate: row.actual_launch_date,
    goal: row.goal ?? "",
    remark: row.remark ?? "",
  };
}

function mapTaskRow(row: TaskRow): ProjectTaskItem {
  return {
    id: row.id,
    projectId: row.project_id,
    versionId: row.version_id,
    title: row.title,
    module: row.module ?? "",
    assignee: row.assignee ?? "",
    startDate: row.start_date,
    dueDate: row.due_date,
    status: row.status ?? "",
    priority: row.priority ?? "",
    progressPercent: row.progress_percent ?? 0,
    riskNote: row.risk_note ?? "",
    remark: row.remark ?? "",
  };
}

function mapFileRow(row: FileRow): ProjectFileItem {
  return {
    id: row.id,
    projectId: row.project_id,
    versionId: row.version_id,
    fileName: row.file_name,
    fileType: row.file_type ?? "",
    fileCategory: row.file_category ?? "",
    fileUrl: row.file_url,
    sourcePlatform: row.source_platform ?? "",
    uploader: row.uploader ?? "",
    isPinned: Boolean(row.is_pinned),
    remark: row.remark ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

function mapRiskRow(row: RiskRow): ProjectRiskItem {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    level: (row.level ?? "低") as ProjectRiskItem["level"],
    type: row.type ?? "",
    description: row.description ?? "",
    owner: row.owner ?? "",
    status: row.status ?? "",
    dueDate: row.due_date,
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

function toProjectPayload(input: ProjectFormInput) {
  return {
    name: text(input.name).trim(),
    short_name: nullableText(input.shortName),
    type: nullableText(input.type),
    platform: nullableText(input.platform),
    status: nullableText(input.status) ?? "筹备中",
    progress_percent: numberValue(input.progressPercent),
    current_version: nullableText(input.currentVersion),
    owner: nullableText(input.owner),
    operator_owner: nullableText(input.operatorOwner),
    test_owner: nullableText(input.testOwner),
    launch_plan_date: dateValue(input.launchPlanDate),
    actual_launch_date: dateValue(input.actualLaunchDate),
    risk_level: nullableText(input.riskLevel) ?? "低",
    blocker: nullableText(input.blocker),
    summary: nullableText(input.summary),
  };
}

function fallbackProjectDetail(id: string): ProjectDetailData | null {
  const project = getProjectById(id);
  if (!project) {
    return null;
  }

  return {
    project,
    versions: getVersionsByProjectId(id),
    tasks: getTasksByProjectId(id),
    files: getFilesByProjectId(id),
    risks: getRisksByProjectId(id),
  };
}

export async function getProjects(): Promise<ProjectItem[]> {
  noStore();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return mockProjects;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as ProjectRow[]).map(mapProjectRow);
  } catch {
    return mockProjects;
  }
}

export async function getProjectDetail(
  id: string
): Promise<ProjectDetailData | null> {
  noStore();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackProjectDetail(id);
  }

  try {
    const [projectRes, versionsRes, tasksRes, filesRes, risksRes] =
      await Promise.all([
        supabase.from("projects").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("project_versions")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_tasks")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_files")
          .select("*")
          .eq("project_id", id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("project_risks")
          .select("*")
          .eq("project_id", id)
          .order("updated_at", { ascending: false }),
      ]);

    if (projectRes.error) {
      throw projectRes.error;
    }

    if (!projectRes.data) {
      return null;
    }

    if (versionsRes.error) {
      throw versionsRes.error;
    }

    if (tasksRes.error) {
      throw tasksRes.error;
    }

    if (filesRes.error) {
      throw filesRes.error;
    }

    if (risksRes.error) {
      throw risksRes.error;
    }

    return {
      project: mapProjectRow(projectRes.data as ProjectRow),
      versions: ((versionsRes.data ?? []) as VersionRow[]).map(mapVersionRow),
      tasks: ((tasksRes.data ?? []) as TaskRow[]).map(mapTaskRow),
      files: ((filesRes.data ?? []) as FileRow[]).map(mapFileRow),
      risks: ((risksRes.data ?? []) as RiskRow[]).map(mapRiskRow),
    };
  } catch {
    return fallbackProjectDetail(id);
  }
}

export async function getVersions(): Promise<ProjectVersionItem[]> {
  noStore();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return mockVersions;
  }

  try {
    const { data, error } = await supabase
      .from("project_versions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as VersionRow[]).map(mapVersionRow);
  } catch {
    return mockVersions;
  }
}

export async function getFiles(): Promise<ProjectFileItem[]> {
  noStore();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return mockFiles;
  }

  try {
    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as FileRow[]).map(mapFileRow);
  } catch {
    return mockFiles;
  }
}

export async function getRisks(): Promise<ProjectRiskItem[]> {
  noStore();

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return mockRisks;
  }

  try {
    const { data, error } = await supabase
      .from("project_risks")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as RiskRow[]).map(mapRiskRow);
  } catch {
    return mockRisks;
  }
}

export async function createProject(
  input: ProjectFormInput
): Promise<RepositoryWriteResult<ProjectItem>> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase 环境变量未配置，无法写入项目。",
    };
  }

  const payload = toProjectPayload(input);

  if (!payload.name) {
    return {
      success: false,
      message: "项目名称不能为空。",
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data: mapProjectRow(data as ProjectRow),
  };
}

export async function updateProject(
  id: string,
  input: ProjectFormInput
): Promise<RepositoryWriteResult<ProjectItem>> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase 环境变量未配置，无法更新项目。",
    };
  }

  const payload = toProjectPayload(input);

  if (!payload.name) {
    return {
      success: false,
      message: "项目名称不能为空。",
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data: mapProjectRow(data as ProjectRow),
  };
}
