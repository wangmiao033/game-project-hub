export type ProjectStatus =
  | "筹备中"
  | "开发中"
  | "测试中"
  | "提审中"
  | "待上线"
  | "已上线"
  | "已暂停";

export type RiskLevel = "低" | "中" | "高" | "严重";

export interface ProjectItem {
  id: string;
  name: string;
  shortName: string;
  type: string;
  platform: string;
  status: ProjectStatus;
  progressPercent: number;
  currentVersion: string;
  owner: string;
  operatorOwner: string;
  testOwner: string;
  launchPlanDate: string;
  actualLaunchDate?: string | null;
  riskLevel: RiskLevel;
  blocker?: string;
  summary?: string;
  updatedAt: string;
}

export interface ProjectVersionItem {
  id: string;
  projectId: string;
  versionNo: string;
  versionName: string;
  status: string;
  progressPercent: number;
  startDate: string;
  testDate?: string | null;
  reviewDate?: string | null;
  planLaunchDate?: string | null;
  actualLaunchDate?: string | null;
  goal?: string;
  remark?: string;
}

export interface ProjectTaskItem {
  id: string;
  projectId: string;
  versionId?: string | null;
  title: string;
  module: string;
  assignee: string;
  startDate?: string | null;
  dueDate?: string | null;
  status: string;
  priority: string;
  progressPercent: number;
  riskNote?: string;
  remark?: string;
}

export interface ProjectFileItem {
  id: string;
  projectId: string;
  versionId?: string | null;
  fileName: string;
  fileType: string;
  fileCategory: string;
  fileUrl: string;
  sourcePlatform: string;
  uploader: string;
  isPinned: boolean;
  remark?: string;
  updatedAt: string;
}

export interface ProjectRiskItem {
  id: string;
  projectId: string;
  title: string;
  level: RiskLevel;
  type: string;
  description: string;
  owner: string;
  status: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
