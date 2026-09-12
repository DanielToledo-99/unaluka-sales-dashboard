import Shell from "@/components/Shell";
import RoleSelect from "@/components/RoleSelect";

import {
  INITIAL_ADMINS,
} from "@/auth";

import {
  requireAdmin,
} from "@/lib/auth-guard";

import {
  prisma,
} from "@/lib/prisma";

export default async function UsersPage() {
  await requireAdmin();

  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1>
            Gestión de usuarios
          </h1>

          <p className="muted">
            Administra los permisos
            de acceso al dashboard.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="admin-summary">
          <div>
            <span className="muted">
              Usuarios registrados
            </span>

            <strong>
              {users.length}
            </strong>
          </div>

          <div>
            <span className="muted">
              Administradores
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                    "ADMIN"
                ).length
              }
            </strong>
          </div>

          <div>
            <span className="muted">
              Solo lectura
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                    "VIEWER"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>
                  Usuario
                </th>

                <th>
                  Email
                </th>

                <th>
                  Rol
                </th>

                <th>
                  Registro
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map(
                (user) => {
                  const locked =
                    INITIAL_ADMINS.includes(
                      user.email.toLowerCase()
                    );

                  return (
                    <tr
                      key={user.id}
                    >
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ??
                              user.email
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {user.name ??
                                "Usuario"}
                            </strong>

                            {locked && (
                              <span className="initial-admin">
                                Administrador inicial
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <RoleSelect
                          userId={
                            user.id
                          }
                          currentRole={
                            user.role
                          }
                          locked={
                            locked
                          }
                        />
                      </td>

                      <td>
                        {new Intl.DateTimeFormat(
                          "es-PE",
                          {
                            dateStyle:
                              "medium",
                          }
                        ).format(
                          user.createdAt
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}