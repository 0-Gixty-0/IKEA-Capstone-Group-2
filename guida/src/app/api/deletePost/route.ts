import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";

export async function DELETE(req: NextRequest) {
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const deletePost = await prisma.page.delete({
      where: { id: Number(postId) },
    });
    return NextResponse.json({
      message: "Post deleted successfully",
      deletePost,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
