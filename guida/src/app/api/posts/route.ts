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
