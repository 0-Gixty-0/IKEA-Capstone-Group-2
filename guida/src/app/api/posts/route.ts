// src/app/api/posts/route.js
import prisma from "@/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const post = await prisma.post.findFirst({
            where: { id: 2 }
        });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
    }
}

// PUT method: Update an existing post
export async function PUT(request: Request) {
    try {
        const { id, title, content, published } = await request.json(); // Parse the request body

        // Update the post in the database
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) }, // Update post by ID
            data: { title, content, published } // The fields to update
        });

        return NextResponse.json({status: 200}); // Return the updated post
    } catch (error) {
        console.error("Failed to update post:", error);
        return NextResponse.json({ error: 'Failed to update the post!' }, { status: 500 });
    }
}
