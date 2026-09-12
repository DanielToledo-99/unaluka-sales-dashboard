import Shell from "@/components/Shell";
import { prisma } from "@/lib/prisma";

function money(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function SellersPage() {
  const sellers =
    await prisma.salesSummary.groupBy({
      by: ["seller"],

      _sum: {
        totalPen: true,
      },

      orderBy: {
        _sum: {
          totalPen: "desc",
        },
      },
    });

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1>
            Vendedores
          </h1>

          <p className="muted">
            Venta acumulada por vendedor
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>
                  #
                </th>

                <th>
                  Vendedor
                </th>

                <th>
                  Venta acumulada
                </th>
              </tr>
            </thead>

            <tbody>
              {sellers.map(
                (seller, index) => (
                  <tr key={seller.seller}>
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {seller.seller}
                      </strong>
                    </td>

                    <td>
                      {money(
                        seller._sum
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
