import {
  NextResponse,
} from "next/server";

import { z } from "zod";

import {
  INITIAL_ADMINS,
} from "@/auth";

import {
  getCurrentUser,
} from "@/lib/auth-guard";

import {
  prisma,
} from "@/lib/prisma";

const schema = z.object({
  role: z.enum([
    "ADMIN",
    "VIEWER",
  ]),
});

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error:
          "No autenticado.",
      },
      {
        status: 401,
      }
    );
  }

  if (
    currentUser.role !== "ADMIN"
  ) {
    return NextResponse.json(
      {
        error:
          "No tienes permisos para realizar esta acción.",
      },
      {
        status: 403,
      }
    );
  }

  const body =
    await request.json();

  const result =
    schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error:
          "Rol inválido.",
      },
      {
        status: 400,
      }
    );
  }

  const {
    id,
  } = await context.params;

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!targetUser) {
    return NextResponse.json(
      {
        error:
          "Usuario no encontrado.",
      },
      {
        status: 404,
      }
    );
  }

  if (
    INITIAL_ADMINS.includes(
      targetUser.email.toLowerCase()
    ) &&
    result.data.role !== "ADMIN"
  ) {
    return NextResponse.json(
      {
        error:
          "Los administradores iniciales no pueden ser degradados.",
      },
      {
        status: 400,
      }
    );
  }

  const updatedUser =
    await prisma.user.update({
      where: {
        id,
      },

      data: {
        role:
          result.data.role,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

  return NextResponse.json(
    updatedUser
  );
}