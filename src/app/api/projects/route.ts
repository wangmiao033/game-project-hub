import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createProject } from "@/lib/data/project-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createProject(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "创建项目失败。",
        },
        { status: 400 }
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    if (result.data?.id) {
      revalidatePath(`/projects/${result.data.id}`);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "创建项目失败。",
      },
      { status: 500 }
    );
  }
}
