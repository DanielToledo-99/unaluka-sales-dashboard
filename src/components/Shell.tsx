import Link from "next/link";

export default function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          UNALUKA
        </div>

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
        </nav>
      </aside>

      <main className="main">
        <div className="top">
          <div>
            <strong>
              Dashboard Comercial
            </strong>

            <div className="muted">
              Enero - Mayo 2026
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}