// src/app/api/posts/route.ts
import prisma from "@/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/types";
import { tupleExpression } from "@babel/types";
import { Prisma } from "@prisma/client";

interface PutRequestPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
  tags: number[];
  pdfUrl: string;
  roles: number[];
  roleId: number | null;
}

interface PostRequestPost {
  title: string;
  content: string;
  published: boolean;
  authorId: number | null;
  tags: number[];
  pdfUrl: string;
  roles: number[];
  roleId: number | null;
}

/**
 * GET method returns post with specified post id. Otherwise, returns all posts
 * @param request Request URL can specify specific post id as api/posts?id=1
 * @constructor
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (session) {
      const { searchParams } = new URL(request.url);
      const postId = searchParams.get("id");
      const authorId = Number(searchParams.get("authorId"));
      const published = searchParams.get("published");
      const assignerId = Number(searchParams.get("assignerId"));
      const includeRoles = searchParams.get("includeRoles") === "true";

      if (postId && includeRoles) {
        const post = await prisma.post.findUnique({
          where: { id: Number(postId) },
          include: {
            roles: includeRoles,
          },
        });

        if (post) {
          return NextResponse.json(
            {
              message: `Successfully retrieved roles for post with id: ${postId}`,
              roles: post.roles,
            },
            { status: 200 },
          );
        } else {
          return NextResponse.json(
            {
              message: `Post with: ${postId} not found`,
            },
            { status: 200 },
          );
        }
      }

      if (postId) {
        const post = await prisma.post.findUnique({
          where: { id: Number(postId) },
        });

        if (!post) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 },
          );
        }

        return NextResponse.json(
          {
            message: `Successfully retrieved post with id: ${postId}`,
            post: post,
          },
          { status: 200 },
        );
      }

      const where: {
        authorId?: { equals: number };
        published?: { equals: boolean };
        assignerId?: { equals: number };
      } = {};

      if (authorId) {
        where.authorId = { equals: authorId };
      }
      if (published !== null) {
        where.published = { equals: published === "true" }; // Convert string to boolean
      }
      if (assignerId) {
        where.assignerId = { equals: assignerId };
      }

      const posts = await prisma.post.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: {
          tags: true, // Include tags associated with the post
        },
      });
      return NextResponse.json(
        {
          message: `Successfully retrieved ${posts.length} posts`,
          posts: posts,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 405 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong when fetching post!" },
      { status: 500 },
    );
  }
}

/**
 * PUT method: Update an existing post from post id.
 * Updates only title, content, published status, and roles
 * @param request Body must contain article object.
 * @constructor
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (session) {
      const {
        id,
        title,
        content,
        published,
        roles,
        pdfUrl,
        tags,
        roleId,
      }: PutRequestPost = await request.json();

      if (!id) {
        return NextResponse.json(
          { error: "Post ID is required" },
          { status: 400 },
        );
      }

      const data: any = {
        title,
        content,
        published,
        pdfUrl,
        ...(tags &&
          tags.length > 0 && {
            tags: {
              set: tags.map((tagId) => ({ id: tagId })), // Replaces existing tags with new tags
            },
          }),
        ...(roles &&
          roles.length > 0 && {
            assigner: { connect: { id: Number(session.user.id) } },
          }),
        ...(roles &&
          roles.length > 0 && {
            roles: {
              set: roles.map((roleId) => ({ id: roleId })), // Replaces all roles with the new ones
            },
          }),
      };

      if (roleId) {
        data.role = {
          connect: { id: roleId },
        };
      }

      // Update the post in the databases
      await prisma.post.update({
        where: { id: Number(id) },
        data: data,
      });

      const updatedPostWithTags = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
          tags: true,
        },
      });

      // Retrieve users with the selected roles
      const usersWithSelectedRoles = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              id: {
                in: roles, // Use role IDs
              },
            },
          },
        },
      });

      // Add the post to the reading list of users with the selected roles
      for (const user of usersWithSelectedRoles) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            readingList: {
              connect: { id: Number(id) },
            },
          },
        });
      }

      return NextResponse.json(
        {
          message: "Successfully updated post and added to reading lists",
          post: updatedPostWithTags,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 405 },
      );
    }
  } catch (error) {
    console.error("Failed to update post or add to reading lists:", error);
    return NextResponse.json(
      { error: "Failed to update the post!" },
      { status: 500 },
    );
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
      const post: PostRequestPost = await request.json(); // Parse the request body

      // Create the post in the database
      const data: any = {
        title: post.title,
        content: post.content,
        published: post.published,
        author: {
          connect: { id: Number(session.user.id) },
        },
        pdfUrl: post.pdfUrl,
        role: null,
        ...(post.roles &&
          post.roles.length > 0 && {
            roles: {
              connect: post.roles.map((roleId) => ({ id: roleId })), // Connects each role
            },
          }),
        ...(post.roles && {
          assigner: { connect: { id: Number(session.user.id) } },
        }),
        tags: {
          connect: post.tags
            ? post.tags.map((tagId: number) => ({
                id: tagId,
              }))
            : [],
        },
      };

      if (post.roleId) {
        data.role = {
          connect: { id: post.roleId },
        };
      }

      const createdPost = await prisma.post.create({ data });

      // Retrieve users with the selected roles
      const usersWithSelectedRoles = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              id: {
                in: post.roles, // Use role IDs
              },
            },
          },
        },
      });

      // Add the post to the reading list of users with the selected roles
      for (const user of usersWithSelectedRoles) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            readingList: {
              connect: { id: createdPost.id },
            },
          },
        });
      }

      return NextResponse.json(
        {
          message: "Successfully created post and updated reading lists",
          post: createdPost,
        },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 405 },
      );
    }
  } catch (error) {
    console.error("Failed to create post or update reading lists:", error);
    return NextResponse.json(
      { error: "Failed to create the post!" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (session) {
      if (session.user.roles.includes(UserRole.ADMIN)) {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("id");

        const deletedPost = await prisma.post.delete({
          where: { id: Number(postId) },
        });

        return NextResponse.json(
          {
            message: "Successfully deleted post",
            post: deletedPost,
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
      }
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 405 },
      );
    }
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete the post!" },
      { status: 500 },
    );
  }
}
