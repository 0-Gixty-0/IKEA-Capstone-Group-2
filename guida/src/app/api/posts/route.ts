import prisma from "@/db";
import { NextResponse } from 'next/server';

interface PutRequestPost {
    id: number
    title: string;
    content: string;
    published: boolean;
}

interface PostRequestPost {
    title: string;
    content: string;
    published: boolean;
    authorId: number;
}

/**
 * GET method returns post with specified post id. Otherwise, returns all posts
 * @param request Request URL can specify specific post id as api/posts?id=1
 * @constructor
 */
export async function GET(request : Request) {
    try {
        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('id')
        const authorId = Number(searchParams.get('author'))
        const published = searchParams.get('published')

        if (postId) {
            const post = await prisma.post.findUnique({
                where: {id: Number(postId)}
            })

            if (!post) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }

            return NextResponse.json({
                message: `Successfully retrieved post: ${postId}`,
                post: post
            }, {status: 200})

        }

        const where: {
            authorId?: { equals: number };
            published?: { equals: boolean };
        } = {};

        if (authorId) {
            where.authorId = { equals: authorId };
        }
        if (published !== undefined) {
            where.published = { equals: published === 'true' }; // Convert string to boolean
        }

        else {
            const posts = await prisma.post.findMany({
                where: Object.keys(where).length ? where : undefined
            })
            return NextResponse.json({
                message: `Successfully retrieved ${posts.length} posts`,
                posts: posts
                }, {status: 200})
        }
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong when fetching post!' }, { status: 500 });
    }
}

/**
 * PUT method: Update an existing post from post id.
 * Updates only title, content, and published status
 * @param request Body must contain article object.
 * @constructor
 */
export async function PUT(request: Request) {
    try {
        const { id, title, content, published } : PutRequestPost = await request.json(); // Parse the request body

        // Update the post in the database
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) }, // Update post by ID
            data: { title, content, published } // The fields to update
        });

        return NextResponse.json({
            message: `Successfully updated post: ${id}`,
            post: updatedPost
        }, {status: 200}); // Return the updated post
    } catch (error) {
        console.error("Failed to update post:", error);
        return NextResponse.json({ error: 'Failed to update the post!' }, { status: 500 });
    }
}

/**
 * POST method: Creates post record.
 * @param request Body must contain article object.
 * @constructor
 */
export async function POST(request: Request) {
    try {
        const post : PostRequestPost = await request.json(); // Parse the request body

        // Update the post in the database
        const createdPost = await prisma.post.create({
            data: post // The fields to update
        });

        return NextResponse.json({
            message: "Successfully created post",
            post: createdPost
        }, {status: 200}); // Return the updated post
    } catch (error) {
        console.error("Failed to create post:", error);
        return NextResponse.json({ error: 'Failed to create the post!' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('id')

        const deletedPost = await prisma.post.delete({
            where: {id: Number(postId)}
        })

        return NextResponse.json({
            message: "Successfully deleted post",
            post: deletedPost
        }, {status: 200})
    } catch (error) {
        console.error("Failed to delete post:", error);
        return NextResponse.json({ error: 'Failed to delete the post!' }, { status: 500 });
    }
}