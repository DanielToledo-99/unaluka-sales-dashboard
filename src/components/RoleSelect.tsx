"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RoleSelectProps = {
  userId: string;
  currentRole: string;
  locked?: boolean;
};

export default function RoleSelect({
  userId,
  currentRole,
  locked = false,
}: RoleSelectProps) {
  const router = useRouter();

  const [role, setRole] =
    useState(currentRole);

  const [loading, setLoading] =
    useState(false);

  async function updateRole(
    newRole: string
  ) {
    if (
      loading ||
      locked ||
      newRole === role
    ) {
      return;
    }

    const previousRole = role;

    setRole(newRole);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/user/${userId}/role`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (!response.ok) {
        const text =
          await response.text();

        let message =
          "No se pudo actualizar el rol.";

        if (text) {
          try {
            const result =
              JSON.parse(text);

            message =
              result.error ??
              message;
          } catch {
            message = text;
          }
        }

        throw new Error(message);
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Error actualizando rol:",
        error
      );

      setRole(previousRole);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el rol."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      className="role-select"
      value={role}
      disabled={loading || locked}
      onChange={(event) =>
        updateRole(
          event.target.value
        )
      }
    >
      <option value="VIEWER">
        Solo lectura
      </option>

      <option value="ADMIN">
        Administrador
      </option>
    </select>
  );
}