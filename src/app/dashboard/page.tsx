import Shell from "@/components/Shell";
import { getDashboardData } from "@/lib/analytics";

function money(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const maxSeller = Math.max(
    ...data.sellers.map(
      (seller) => seller.total
    ),
    1
  );

  const maxMonth = Math.max(
    ...data.monthly.map(
      (month) => month.total
    ),
    1
  );

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1>
            Dashboard comercial
          </h1>

          <p className="muted">
            Información consolidada de enero a mayo de
            2026
          </p>
        </div>
      </div>

      <div className="grid4">
        <div className="card">
          <div className="muted">
            Ventas acumuladas
          </div>

          <div className="metric">
            {money(data.totalSales)}
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Pedidos únicos
          </div>

          <div className="metric">
            {data.uniqueOrders.toLocaleString(
              "es-PE"
            )}
          </div>
        </div>

        <div className="card">
          <div className="muted">
            SKU únicos
          </div>

          <div className="metric">
            {data.uniqueSkus.toLocaleString(
              "es-PE"
            )}
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Vendedores
          </div>

          <div className="metric">
            {data.sellerCount}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h2>
            Evolución mensual
          </h2>

          {data.monthly.map((item) => {
            const percentage =
              (item.total / maxMonth) * 100;

            return (
              <div
                className="barrow"
                key={item.month}
              >
                <span>
                  {item.month}
                </span>

                <div className="bar">
                  <span
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <strong>
                  {money(item.total)}
                </strong>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h2>
            Ventas por vendedor
          </h2>

          {data.sellers.map((item) => {
            const percentage =
              (item.total / maxSeller) * 100;

            return (
              <div
                className="barrow"
                key={item.seller}
              >
                <span>
                  {item.seller}
                </span>

                <div className="bar">
                  <span
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <strong>
                  {money(item.total)}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card table-card">
        <div className="section-title">
          <div>
            <h2>
              Top 10 productos / SKU
            </h2>

            <p className="muted">
              Ordenados por unidades vendidas
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>
                  SKU
                </th>

                <th>
                  Producto
                </th>

                <th>
                  Unidades
                </th>

                <th>
                  Facturación
                </th>
              </tr>
            </thead>

            <tbody>
              {data.products.map(
                (product) => (
                  <tr key={product.sku}>
                    <td>
                      {product.sku}
                    </td>

                    <td>
                      {product.product}
                    </td>

                    <td>
                      {product.units.toLocaleString(
                        "es-PE"
                      )}
                    </td>

                    <td>
                      {money(
                        product.revenue
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}