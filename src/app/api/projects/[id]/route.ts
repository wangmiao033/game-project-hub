import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { updateProject } from "@/lib/data/project-repository";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateProject(id, body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "更新项目失败。",
        },
        { status: 400 }
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath(`/projects/${id}/edit`);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "更新项目失败。",
      },
      { status: 500 }
    );
  }
}
