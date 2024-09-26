import prisma from "@/db";
import User from '@prisma/client'
import { NextResponse } from 'next/server';



/**
 * Fetch a user based on it's id
 * @param req 
 * @returns Response with the users id, email and name.
 */


export async function GET(req: Request) {
    try {
        const userid = getId(req)

        if (!userid) {
            return NextResponse.json({error: 'not a valid id'}, {status: 400})
        }
        const user = await prisma.user.findFirst({
            where: {id: userid}
        })
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
    }  
}

/**
 * Creates a new user in the data base
 * @param req 
 * @returns a response with the users id, name and email
 */

export async function POST(req: Request) {
    try {
        const {email, name} = await req.json()

        if (!email || !name) {
            return NextResponse.json({error: "not valid name or email"}, {status: 400 })
        }
        const newUser = await prisma.user.create({
            data: {email: email, name: name}
        })
        return NextResponse.json(newUser, {status: 201});
        
    } catch (error) {
        return NextResponse.json({error: `could not create user}` + error}, {status: 500})
    }
}


/**
 * Updates a user's email and name based on its id
 * @param req 
 * @returns a response with the updated users id, email and name
 */
export async function PUT(req: Request) {
    try {
        const {id, email, name} = await req.json()
        console.log(id)
        if (Number.isNaN(Number(id))) {
            return NextResponse.json({error: 'not a valid id'}, {status: 400})
        }
        const updatedUser = await prisma.user.update({
            where: {id: Number(id)},
            data: {email: email, name: name}
        })
        return NextResponse.json(updatedUser, {status: 201})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'could not update user}'}, {status: 500})
    }
}

/**
 * Detelets a user based on it's id
 * @param req 
 * @returns A message if it was successfull and the deleted user.
 */
export async function DELETE(req: Request) {
    try {
        const userid = getId(req)

        if (!userid) {
            return NextResponse.json({error: 'not a valid id'}, {status: 400})
        }
        const user = await prisma.user.delete({
            where: {id: userid}
        })
        return NextResponse.json({message: "User deleted succesfully", user: user})
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong! Could not delete user' }, { status: 500 });
    }
}

/**
 * Utility function for getting a users id and checking whether it's valid, i.e. a number. Does not guarantee that it exists a user with that id.
 * @param req 
 * @returns userid of a request or undefined if the id from the request was not a number.
 */

function getId(req: Request) {
    const {searchParams } = new URL(req.url)
    const userid = Number(searchParams.get("id"))
    return Number.isNaN(userid) ? undefined : userid
}