// src/app/api/posts/route.js
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

/**
 * GET method returns post with specified post id. Otherwise, returns all posts
 * @param request Request URL can specify specific post id as api/posts?id=1
 * @constructor
 */
export async function GET(request : Request) {
    try {
        const session = await auth()

        if (session) {
            const { searchParams } = new URL(request.url)
            const postId = searchParams.get('id')
            const authorId = Number(searchParams.get('authorId'))
            const published = searchParams.get('published')
            const pdfUrl = searchParams.get('pdfUrl')

            if (postId) {
                const post = await prisma.post.findUnique({
                    where: {id: Number(postId)}
                })

                if (!post) {
                    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
                }

                return NextResponse.json({
                    message: `Successfully retrieved post with id: ${postId}`,
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
            if (published !== null) {
                where.published = { equals: published === 'true' }; // Convert string to boolean
            }

            const posts = await prisma.post.findMany({
                where: Object.keys(where).length ? where : undefined
            })
            return NextResponse.json({
                message: `Successfully retrieved ${posts.length} posts`,
                posts: posts
            }, {status: 200})
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 })
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
        const session = await auth();
        if (session) {
            const { id, title, content, published, authorId } : SubmittablePost = await request.json();

            if (session.user.roles.includes(UserRole.ADMIN) || session.user.id === authorId?.toString()) {

                // Update the post in the database
                const updatedPost = await prisma.post.update({
                    where: { id: Number(id) }, // Update post by ID
                    data: { title, content, published } // The fields to update
                });

                return NextResponse.json({
                    message: `Successfully updated post with id: ${id}`,
                    post: updatedPost
                }, {status: 200}); // Return the updated post
            } else {
                return NextResponse.json({ error: 'Not allowed!' }, { status: 405 })
            }
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 })
        }
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
        const session = await auth();
        if (session) {
            const post : PostRequestPost = await request.json(); // Parse the request body

            // Create the post in the database
            const createdPost = await prisma.post.create({
                data: {
                    title: post.title,
                    content: post.content,
                    published: post.published,
                    author: {
                        connect: { id: Number(session.user.id) }
                    }
                } // The fields to update
            });

            return NextResponse.json({
                message: "Successfully created post",
                post: createdPost
            }, {status: 200}); // Return the updated post
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 })
        }
    } catch (error) {
        console.error("Failed to create post:", error);
        return NextResponse.json({ error: 'Failed to create the post!' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (session) {
            if (session.user.roles.includes(UserRole.ADMIN)) {
                const { searchParams } = new URL(request.url)
                const postId = searchParams.get('id')

                const deletedPost = await prisma.post.delete({
                    where: {id: Number(postId)}
                })

                return NextResponse.json({
                    message: "Successfully deleted post",
                    post: deletedPost
                }, {status: 200})
            } else {
                return NextResponse.json({ error: 'Not allowed!' }, { status: 405 })
            }
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 })
        }
    } catch (error) {
        console.error("Failed to delete post:", error);
        return NextResponse.json({ error: 'Failed to delete the post!' }, { status: 500 });
    }
}


