import { auth } from "@/auth"
import prisma from "@/db"
import { NextResponse } from "next/server"


/**
 * API endpoint for getting a role by id or name.
 * @param request 
 * @returns 
 */

export async function GET(request : Request) {
    try {
        const session = await auth()

        if (session) {
            const { searchParams } = new URL(request.url)
            const roleId = searchParams.get('id')
            const roleName = searchParams.get('name')
            

            if (roleId) {
                const role = await prisma.role.findUnique({
                    where: {id: Number(roleId)}
                })

                if (!role) {
                    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
                }

                return NextResponse.json({
                    message: `Successfully retrieved role with id: ${roleId}`,
                    role: role
                }, {status: 200})
            }
            if (roleName) {
                const role = await prisma.role.findUnique({
                    where: {name: roleName}
                })

                if (!role) {
                    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
                }

                return NextResponse.json({
                    message: `Successfully retrieved role with name: ${roleName}`,
                    role: role
                }, {status: 200})
            } 
            else {
                return NextResponse.json({ error: 'You must be logged in!' }, { status: 405 })
            }
        }
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong when fetching post!' }, { status: 500 });
    }
}