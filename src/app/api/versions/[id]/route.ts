import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { updateVersion } from "@/lib/data/project-repository";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateVersion(id, body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "更新版本失败。",
        },
        { status: 400 }
      );
    }

    revalidatePath("/versions");
    revalidatePath("/dashboard");
    revalidatePath(`/versions/${id}/edit`);

    if (result.data?.projectId) {
      revalidatePath(`/projects/${result.data.projectId}`);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "更新版本失败。",
      },
      { status: 500 }
    );
  }
}
