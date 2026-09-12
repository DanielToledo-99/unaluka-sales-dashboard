import Shell from "@/components/Shell";
import { prisma } from "@/lib/prisma";

function money(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function ProductsPage() {
  const products =
    await prisma.orderLine.groupBy({
      by: ["sku", "product"],

      _sum: {
        quantity: true,
        totalPen: true,
      },

      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },

      take: 100,
    });

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1>
            Productos / SKU
          </h1>

          <p className="muted">
            Productos con mayor volumen de venta
          </p>
        </div>
      </div>

      <div className="card">
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
                  Ventas
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map(
                (product, index) => (
                  <tr key={index}>
                    <td>
                      {product.sku ??
                        "Sin SKU"}
                    </td>

                    <td>
                      {product.product ??
                        "Sin nombre"}
                    </td>

                    <td>
                      {(
                        product._sum
                          .quantity ?? 0
                      ).toLocaleString(
                        "es-PE"
                      )}
                    </td>

                    <td>
                      {money(
                        product._sum
                          .totalPen ?? 0
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