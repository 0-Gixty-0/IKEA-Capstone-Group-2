import prisma from "@/db";
import { NextResponse } from 'next/server';
import {auth} from "@/auth";
import {SubmittablePost, UserRole} from "@/types";

interface PutRequestPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

interface PostRequestPost {
    title: string;
    content: string;
    published: boolean;
    authorId: number | null;
}
export async function DELETE(request: Request) {
    console.log("Reading post WORKS!!!Reading post WORKS!!!Reading post WORKS!!!Reading post WORKS!!!Reading post WORKS!!!Reading post WORKS!!!");
    try {
        const session = await auth();
        if (session) {
            const { searchParams } = new URL(request.url);
            const postId = searchParams.get('id');
            const userId = Number(session.user.id);

            if (!postId) {
                return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
            }

            // Fetch the post
            const post = await prisma.post.findUnique({
                where: { id: Number(postId) }
            });

            if (!post) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }

            // Remove the post from the user's reading list
            await prisma.user.update({
                where: { id: userId },
                data: {
                    readingList: {
                        disconnect: { id: Number(postId) }
                    }
                }
            });

            return NextResponse.json({
                message: `Successfully retrieved post with id: ${postId} and removed it from the reading list`,
                post: post
            }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 });
        }
    } catch (error) {
        console.error("Failed to retrieve post or update reading list:", error);
        return NextResponse.json({ error: 'Something went wrong when fetching post!' }, { status: 500 });
    }
}