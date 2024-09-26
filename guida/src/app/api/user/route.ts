import prisma from "@/db";
import User from '@prisma/client'
import { NextResponse } from 'next/server';



// 
export async function GET(req: Request) {
    try {
        const userid = getId(req)

        if (!Number.isNaN(userid)) {
            const user = await prisma.user.findFirst({
                where: {id: userid}
            })
            return NextResponse.json(user)
        } else {
            return NextResponse.json({error: 'not a valid id'})
        }
        
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
    }  

}

export async function POST(req: Request) {
    try {
        const {email, name} = await req.json()
        console.log(email + ' ' + name)
        const _ = await prisma.user.create({
            data: {email: email, name: name}
        })
    } catch (error) {
        return NextResponse.json({error: `could not create user}` + error}, {status: 500})
    }
}



export async function PUT(req: Request) {
    console.log(await req.text)
    try {
        const {id, email, name} = await req.json()
        console.log(id)
        if (!Number.isNaN(Number(id))) {
            const _ = await prisma.user.update({
                where: {id: Number(id)},
                data: {email: email, name: name}
            })
        } else {
            return NextResponse.json({error: 'not a valid id'})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'could not update user}'}, {status: 500})
    }
}

export async function DELETE(req: Request) {
    try {
        const userid = getId(req)

        if (!Number.isNaN(userid)) {
            const user = await prisma.user.delete({
                where: {id: userid}
            })
            return NextResponse.json(user)
        } else {
            return NextResponse.json({error: 'not a valid id'})
        }
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong! Could not delete user' }, { status: 500 });
    }
}



function getId(req: Request) {
    const {searchParams } = new URL(req.url)
    const userid = Number(searchParams.get("id"))
    return userid
}