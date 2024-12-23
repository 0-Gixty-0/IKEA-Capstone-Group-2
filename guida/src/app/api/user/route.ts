import prisma from "@/db";
import { NextResponse } from "next/server";
import { SubmittableUser, UserRole } from "@/types";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

/**
 * Fetch a user based on it's id, if no id is provided, all users are returned
 * @param req
 * @returns Response with the users id, email and name.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = await new URL(req.url);

    const session = await auth();

    if (session) {
      let selectStatement: Prisma.UserSelect = {};

      if (
        session.user.roles.includes(UserRole.ADMIN) ||
        session.user.id === searchParams.get("id")
      ) {
        selectStatement = {
          id: true,
          email: true,
          password: true,
          username: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          roles: true,
          profilePicture: true,
        };
      } else {
        selectStatement = {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          roles: true,
          profilePicture: true,
        };
      }

      if (searchParams.get("id") == null) {
        const allUsers = await prisma.user.findMany({
          select: selectStatement,
        });
        return NextResponse.json(allUsers);
      }

      const userid = getId(req);

      if (!userid) {
        return NextResponse.json({ error: "not a valid id" }, { status: 400 });
      }
      const user = await prisma.user.findFirst({
        select: selectStatement,
        where: { id: userid },
      });
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 },
    );
  }
}

/**
 * Creates a new user in the data base
 * @param req
 * @returns a response with the users id, name and email
 */

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (session && session.user.roles.includes(UserRole.ADMIN)) {
      const user: SubmittableUser = await req.json();

      // Retrieve the Role records that match the roles provided in submittableUser
      const roles = await prisma.role.findMany({
        where: {
          name: {
            in: user.roles,
          },
        },
      });

      // If roles are not found, throw an error (optional)
      if (roles.length === 0) {
        throw new Error("No matching roles found for user.");
      }

      if (!user.email || !user.password || !user.username) {
        return NextResponse.json(
          { error: "Invalid or missing attributes for user" },
          { status: 400 },
        );
      }
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          password: user.password,
          name: user.name,
          roles: {
            connect: roles.map((role) => ({ id: role.id })),
          },
        },
      });
      return NextResponse.json(newUser, { status: 201 });
    } else {
      return NextResponse.json({ error: "Not allowed!" }, { status: 405 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `could not create user}` + error },
      { status: 500 },
    );
  }
}

/**
 * Updates a user's email and name based on its id
 * @param req
 * @returns a response with the updated users id, email and name
 */
export async function PUT(req: Request) {
  try {
    const user: SubmittableUser = await req.json();

    const session = await auth();

    if (session) {
      if (
        session.user.roles.includes(UserRole.ADMIN) ||
        session.user.id === user.id?.toString()
      ) {
        // Retrieve the Role records that match the roles provided in submittableUser
        const roles = await prisma.role.findMany({
          where: {
            name: {
              in: user.roles,
            },
          },
        });

        // If roles are not found, throw an error (optional)
        if (roles.length === 0) {
          throw new Error("No matching roles found for user.");
        }

        if (Number.isNaN(Number(user.id))) {
          return NextResponse.json(
            { error: "not a valid id" },
            { status: 400 },
          );
        }
        const updatedUser = await prisma.user.update({
          where: { id: Number(user.id) },
          data: {
            email: user.email,
            username: user.username,
            password: user.password,
            name: user.name,
            roles: {
              connect: roles.map((role) => ({ id: role.id })),
            },
          },
        });
        return NextResponse.json(updatedUser, { status: 201 });
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
    console.log(error);
    return NextResponse.json(
      { error: "could not update user}" },
      { status: 500 },
    );
  }
}

/**
 * Deletes a user based on it's id
 * @param req
 * @returns A message if it was successfully and the deleted user.
 */
export async function DELETE(req: Request) {
  try {
    const userid = getId(req);

    if (!userid) {
      return NextResponse.json({ error: "not a valid id" }, { status: 400 });
    }

    const session = await auth();

    if (session) {
      if (session.user.roles.includes(UserRole.ADMIN)) {
        const user = await prisma.user.delete({
          where: { id: userid },
        });
        return NextResponse.json({
          message: "User deleted successfully",
          user: user,
        });
      } else {
        return NextResponse.json({ error: "Not allowed" }, { status: 405 });
      }
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 405 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong! Could not delete user" },
      { status: 500 },
    );
  }
}

/**
 * Utility function for getting a users id and checking whether it's valid, i.e. a number. Does not guarantee that it exists a user with that id.
 * @param req
 * @returns userid of a request or undefined if the id from the request was not a number.
 */

function getId(req: Request) {
  const { searchParams } = new URL(req.url);
  const userid = Number(searchParams.get("id"));
  return Number.isNaN(userid) ? undefined : userid;
}
