import {
  ProjectFileItem,
  ProjectItem,
  ProjectRiskItem,
  ProjectTaskItem,
  ProjectVersionItem,
} from "@/types/project";

export const mockProjects: ProjectItem[] = [
  {
    id: "p1",
    name: "六界仙尊",
    shortName: "六界",
    type: "小游戏",
    platform: "微信小游戏",
    status: "开发中",
    progressPercent: 72,
    currentVersion: "0.1.8",
    owner: "张三",
    operatorOwner: "李四",
    testOwner: "王五",
    launchPlanDate: "2026-05-10",
    actualLaunchDate: null,
    riskLevel: "中",
    blocker: "渠道素材待确认",
    summary: "当前主线在版本联调阶段，支付与埋点待最终核验。",
    updatedAt: "2026-04-16 15:20",
  },
  {
    id: "p2",
    name: "一起来修仙",
    shortName: "修仙",
    type: "联运APK",
    platform: "安卓",
    status: "提审中",
    progressPercent: 88,
    currentVersion: "1.0.3",
    owner: "陈晨",
    operatorOwner: "小杨",
    testOwner: "阿杰",
    launchPlanDate: "2026-04-25",
    actualLaunchDate: null,
    riskLevel: "高",
    blocker: "实名合规接口待渠道确认",
    summary: "提审材料已提交，等待渠道侧反馈。",
    updatedAt: "2026-04-16 11:05",
  },
  {
    id: "p3",
    name: "云上征途",
    shortName: "征途",
    type: "联运H5",
    platform: "H5",
    status: "待上线",
    progressPercent: 95,
    currentVersion: "2.0.0",
    owner: "小周",
    operatorOwner: "阿敏",
    testOwner: "测试A",
    launchPlanDate: "2026-04-20",
    actualLaunchDate: null,
    riskLevel: "低",
    blocker: "无",
    summary: "已完成上线前准备，等待定档。",
    updatedAt: "2026-04-15 18:00",
  },
];

export const mockVersions: ProjectVersionItem[] = [
  {
    id: "v1",
    projectId: "p1",
    versionNo: "0.1.8",
    versionName: "首发联调版",
    status: "开发中",
    progressPercent: 72,
    startDate: "2026-04-01",
    testDate: "2026-04-20",
    reviewDate: "2026-04-28",
    planLaunchDate: "2026-05-10",
    actualLaunchDate: null,
    goal: "完成登录、支付、公告、活动接入",
    remark: "支付回调要复核",
  },
  {
    id: "v2",
    projectId: "p2",
    versionNo: "1.0.3",
    versionName: "提审修复版",
    status: "提审中",
    progressPercent: 88,
    startDate: "2026-04-03",
    testDate: "2026-04-10",
    reviewDate: "2026-04-13",
    planLaunchDate: "2026-04-25",
    actualLaunchDate: null,
    goal: "完成渠道适配和实名校验",
    remark: "等渠道驳回点确认",
  },
  {
    id: "v3",
    projectId: "p3",
    versionNo: "2.0.0",
    versionName: "正式上线版",
    status: "待上线",
    progressPercent: 95,
    startDate: "2026-03-20",
    testDate: "2026-04-01",
    reviewDate: "2026-04-05",
    planLaunchDate: "2026-04-20",
    actualLaunchDate: null,
    goal: "全量上线",
    remark: "上线时间待商务最终确认",
  },
];

export const mockTasks: ProjectTaskItem[] = [
  {
    id: "t1",
    projectId: "p1",
    versionId: "v1",
    title: "微信支付联调",
    module: "支付",
    assignee: "张三",
    startDate: "2026-04-12",
    dueDate: "2026-04-18",
    status: "进行中",
    priority: "高",
    progressPercent: 60,
    riskNote: "回调签名偶发异常",
    remark: "需要服务端复核",
  },
  {
    id: "t2",
    projectId: "p1",
    versionId: "v1",
    title: "首发素材确认",
    module: "运营",
    assignee: "李四",
    startDate: "2026-04-13",
    dueDate: "2026-04-17",
    status: "待确认",
    priority: "中",
    progressPercent: 40,
    riskNote: "渠道KV未定稿",
    remark: "等美术出图",
  },
  {
    id: "t3",
    projectId: "p2",
    versionId: "v2",
    title: "实名认证适配",
    module: "SDK",
    assignee: "陈晨",
    startDate: "2026-04-08",
    dueDate: "2026-04-16",
    status: "已阻塞",
    priority: "高",
    progressPercent: 75,
    riskNote: "渠道文档未更新",
    remark: "等待渠道确认",
  },
];

export const mockFiles: ProjectFileItem[] = [
  {
    id: "f1",
    projectId: "p1",
    versionId: "v1",
    fileName: "六界仙尊进度表.xlsx",
    fileType: "xlsx",
    fileCategory: "进度表",
    fileUrl: "#",
    sourcePlatform: "WPS",
    uploader: "李四",
    isPinned: true,
    remark: "当前主进度表",
    updatedAt: "2026-04-16 15:23",
  },
  {
    id: "f2",
    projectId: "p1",
    versionId: "v1",
    fileName: "上线计划.docx",
    fileType: "docx",
    fileCategory: "上线计划",
    fileUrl: "#",
    sourcePlatform: "WPS",
    uploader: "张三",
    isPinned: false,
    remark: "最新提审节点",
    updatedAt: "2026-04-16 10:00",
  },
  {
    id: "f3",
    projectId: "p2",
    versionId: "v2",
    fileName: "接入进度项目10.xlsx",
    fileType: "xlsx",
    fileCategory: "渠道接入",
    fileUrl: "#",
    sourcePlatform: "WPS",
    uploader: "阿杰",
    isPinned: true,
    remark: "SDK接入版本",
    updatedAt: "2026-04-15 18:20",
  },
];

export const mockRisks: ProjectRiskItem[] = [
  {
    id: "r1",
    projectId: "p1",
    title: "首发素材延期",
    level: "中",
    type: "素材风险",
    description: "KV、ICON、启动图未全部确认，可能影响提审时间。",
    owner: "李四",
    status: "处理中",
    dueDate: "2026-04-18",
    createdAt: "2026-04-15 09:00",
    updatedAt: "2026-04-16 14:30",
  },
  {
    id: "r2",
    projectId: "p2",
    title: "实名接口卡点",
    level: "高",
    type: "渠道风险",
    description: "渠道最新实名参数未同步，提审可能被打回。",
    owner: "陈晨",
    status: "未解决",
    dueDate: "2026-04-17",
    createdAt: "2026-04-14 11:00",
    updatedAt: "2026-04-16 10:20",
  },
];

export function getProjectById(id: string) {
  return mockProjects.find((item) => item.id === id) ?? null;
}

export function getVersionsByProjectId(projectId: string) {
  return mockVersions.filter((item) => item.projectId === projectId);
}

export function getTasksByProjectId(projectId: string) {
  return mockTasks.filter((item) => item.projectId === projectId);
}

export function getFilesByProjectId(projectId: string) {
  return mockFiles.filter((item) => item.projectId === projectId);
}

export function getRisksByProjectId(projectId: string) {
  return mockRisks.filter((item) => item.projectId === projectId);
}
