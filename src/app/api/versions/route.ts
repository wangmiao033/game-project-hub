import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createVersion } from "@/lib/data/project-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createVersion(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "创建版本失败。",
        },
        { status: 400 }
      );
    }

    revalidatePath("/versions");
    revalidatePath("/dashboard");

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
        message: error instanceof Error ? error.message : "创建版本失败。",
      },
      { status: 500 }
    );
  }
}
