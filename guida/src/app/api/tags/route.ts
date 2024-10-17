import prisma from "@/db";
import { NextResponse } from 'next/server';

// This function handles GET requests
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId'); // Extract postId from query parameters

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  }

  try {
    const postWithTags = await prisma.post.findUnique({
      where: {
        id: Number(postId), // Ensure postId is a number
      },
      include: {
        tags: true, // Include tags associated with the post
      },
    });

    if (!postWithTags) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(postWithTags.tags); // Return the tags
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
