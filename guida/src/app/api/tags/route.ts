import prisma from "@/db";
import { NextResponse } from 'next/server';

// This function handles GET requests
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId'); // Extract postId from query parameters

  if (!postId) {
    try {
      const tags = await prisma.tag.findMany()
      return NextResponse.json(
          {
            message: `Successfully retrieved ${tags.length} tags`,
            tags: tags,
          },
          { status: 200 }
      );
    } catch (error) {
      console.error("Failed to fetch tags", error);
      return NextResponse.json(
          { error: "Failed to fetch tags!" },
          { status: 500 }
      );
    }
  } else {
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
}
