import { prisma } from "./prisma";

const MONTH_NAMES = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export async function getDashboardData() {
  const summaries =
    await prisma.salesSummary.findMany();

  const orders =
    await prisma.orderLine.findMany();

  const totalSales = summaries.reduce(
    (total, item) => total + item.totalPen,
    0
  );

  const uniqueOrders = new Set(
    orders.map((item) => item.orderNumber)
  ).size;

  const uniqueSkus = new Set(
    orders
      .map((item) => item.sku)
      .filter(Boolean)
  ).size;

  const monthlyMap = new Map<number, number>();

  for (const item of summaries) {
    monthlyMap.set(
      item.month,
      (monthlyMap.get(item.month) ?? 0) +
        item.totalPen
    );
  }

  const monthly = [...monthlyMap.entries()]
    .sort(([monthA], [monthB]) => monthA - monthB)
    .map(([month, total]) => ({
      month: MONTH_NAMES[month],
      total,
    }));

  const sellerMap = new Map<string, number>();

  for (const item of summaries) {
    sellerMap.set(
      item.seller,
      (sellerMap.get(item.seller) ?? 0) +
        item.totalPen
    );
  }

  const sellers = [...sellerMap.entries()]
    .map(([seller, total]) => ({
      seller,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  const productMap = new Map<
    string,
    {
      sku: string;
      product: string;
      units: number;
      revenue: number;
    }
  >();

  for (const item of orders) {
    if (!item.sku) {
      continue;
    }

    const current =
      productMap.get(item.sku) ?? {
        sku: item.sku,
        product: item.product ?? "Sin nombre",
        units: 0,
        revenue: 0,
      };

    current.units += item.quantity;
    current.revenue += item.totalPen;

    productMap.set(item.sku, current);
  }

  const products = [...productMap.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, 10);

  return {
    totalSales,
    uniqueOrders,
    uniqueSkus,
    sellerCount: sellers.length,
    monthly,
    sellers,
    products,
  };
}