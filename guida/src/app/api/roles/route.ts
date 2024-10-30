import prisma from "@/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/types";

interface RoleRequest {
  id?: number;
  name: string;
}

/**
 * GET method returns role with specified role id. Otherwise, returns all roles
 * @param request Request URL can specify specific role id as api/roles?id=1
 * @constructor
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (session) {
      const { searchParams } = new URL(request.url);
      const roleId = searchParams.get("id");

      if (roleId) {
        const role = await prisma.role.findUnique({
          where: { id: Number(roleId) },
        });

        if (!role) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 404 },
          );
        }

        return NextResponse.json(
          {
            message: `Successfully retrieved role with id: ${roleId}`,
            role: role,
          },
          { status: 200 },
        );
      }

      const roles = await prisma.role.findMany();
      return NextResponse.json(
        {
          message: `Successfully retrieved ${roles.length} roles`,
          roles: roles,
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
      { error: "Something went wrong when fetching roles!" },
      { status: 500 },
    );
  }
}

/**
 * POST method: Creates role record.
 * @param request Body must contain role object.
 * @constructor
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session && session.user.roles.includes(UserRole.ADMIN)) {
      const role: RoleRequest = await request.json(); // Parse the request body

      // Create the role in the database
      const createdRole = await prisma.role.create({
        data: {
          name: role.name,
        },
      });

      return NextResponse.json(
        {
          message: "Successfully created role",
          role: createdRole,
        },
        { status: 200 },
      ); // Return the created role
    } else {
      return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
    }
  } catch (error) {
    console.error("Failed to create role:", error);
    return NextResponse.json(
      { error: "Failed to create the role!" },
      { status: 500 },
    );
  }
}

/**
 * PUT method: Update an existing role from role id.
 * Updates only name
 * @param request Body must contain role object.
 * @constructor
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (session && session.user.roles.includes(UserRole.ADMIN)) {
      const { id, name }: RoleRequest = await request.json();

      // Update the role in the database
      const updatedRole = await prisma.role.update({
        where: { id: Number(id) }, // Update role by ID
        data: { name }, // The fields to update
      });

      return NextResponse.json(
        {
          message: `Successfully updated role with id: ${id}`,
          role: updatedRole,
        },
        { status: 200 },
      ); // Return the updated role
    } else {
      return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
    }
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json(
      { error: "Failed to update the role!" },
      { status: 500 },
    );
  }
}

/**
 * DELETE method: Deletes a role by id.
 * @param request Request URL must specify role id as api/roles?id=1
 * @constructor
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (session && session.user.roles.includes(UserRole.ADMIN)) {
      const { searchParams } = new URL(request.url);
      const roleId = searchParams.get("id");

      const deletedRole = await prisma.role.delete({
        where: { id: Number(roleId) },
      });

      return NextResponse.json(
        {
          message: "Successfully deleted role",
          role: deletedRole,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
    }
  } catch (error) {
    console.error("Failed to delete role:", error);
    return NextResponse.json(
      { error: "Failed to delete the role!" },
      { status: 500 },
    );
  }
}
