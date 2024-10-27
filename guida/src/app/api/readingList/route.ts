import prisma from "@/db";
import { NextResponse } from 'next/server';
import {auth} from "@/auth";

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

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (session) {
            const { searchParams } = new URL(request.url)
            const postId = Number(searchParams.get('postId'))
            const roles = searchParams.get('roles')

            if (postId && roles) {
                const selectStatement = {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    roles: {
                        select: {
                            name: true,
                        },
                    },
                }

                const usersWithPostInReadingList = await prisma.user.findMany({
                    where: {
                        readingList: {
                            some: {
                                id: postId, // Filter users who have the specified post ID in their reading list
                            },
                        },
                    },
                    select: selectStatement
                });

                const usersWithMatchingRoles = await prisma.user.findMany({
                    where: {
                        roles: {
                            some: {
                                posts: { some: { id: postId } } // Matches any user roles that are associated with the given post ID
                            },
                        },
                    },
                    select: selectStatement
                });

                const usersWithPostInReadingListIds = new Set(usersWithPostInReadingList.map(user => user.id));

                const readUsers = usersWithMatchingRoles.filter(user =>
                    !usersWithPostInReadingListIds.has(user.id)
                );

                return NextResponse.json({
                    message: `Successfully retrieved users for post`,
                    totalAssigned: usersWithMatchingRoles.length,
                    numRead: readUsers.length,
                    nonReadUsers: usersWithPostInReadingList,
                    readUsers: readUsers,
                }, { status: 200 });
            } else {
                const userId = Number(session.user.id);

                // Fetch the user's reading list
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        readingList: true, // Include the reading list in the response
                    },
                });

                if (!user) {
                    return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const readingList = user.readingList;

                return NextResponse.json({
                    message: `Successfully retrieved ${readingList.length} posts from the reading list`,
                    posts: readingList,
                }, { status: 200 });
            }
        } else {
            return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 });
        }
    } catch (error) {
        console.error("Failed to retrieve reading list:", error);
        return NextResponse.json({ error: 'Something went wrong when fetching the reading list!' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
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