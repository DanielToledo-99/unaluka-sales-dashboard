import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/auth";
import { requireUser } from "@/lib/auth-guard";

export default async function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="shell">
      <aside className="sidebar">
        {/* LOGO */}
        <div className="brand">
          <Link
            href="/dashboard"
            className="brand-link"
            aria-label="Ir al dashboard"
          >
            <Image
              src="/logo.png"
              alt="Unaluka"
              width={170}
              height={60}
              priority
              className="brand-logo"
            />
          </Link>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="nav">
          <Link href="/dashboard">
            Dashboard
          </Link>

          <Link href="/productos">
            Productos / SKU
          </Link>

          <Link href="/vendedores">
            Vendedores
          </Link>

          {user.role === "ADMIN" && (
            <>
              <div className="nav-separator" />

              <div className="nav-label">
                Administración
              </div>

              <Link href="/admin/usuarios">
                Usuarios
              </Link>
            </>
          )}
        </nav>

        {/* USUARIO */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.name
              ?.charAt(0)
              .toUpperCase() ??
              user.email
                .charAt(0)
                .toUpperCase()}
          </div>

          <div className="sidebar-user-data">
            <strong>
              {user.name ?? user.email}
            </strong>

            <span>
              {user.role === "ADMIN"
                ? "Administrador"
                : "Solo lectura"}
            </span>
          </div>

          {/* LOGOUT */}
          <form
            action={async () => {
              "use server";

              await signOut({
                redirectTo: "/login",
              });
            }}
          >
            <button
              className="logout-button"
              type="submit"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="main">
        {/* HEADER */}
        <div className="top">
          <div>
            <strong>
              Dashboard Comercial
            </strong>

            <div className="muted">
              Enero - Mayo 2026
            </div>
          </div>

          <div className="top-user">
            <div>
              <strong>
                {user.name ?? "Usuario"}
              </strong>

              <span>
                {user.email}
              </span>
            </div>

            <span
              className={`role-badge ${
                user.role === "ADMIN"
                  ? "role-admin"
                  : "role-viewer"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* PÁGINAS */}
        {children}
      </main>
    </div>
  );
}