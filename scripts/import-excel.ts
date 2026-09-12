import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

const prisma = new PrismaClient();

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function nullable(value: unknown): string | null {
  const result = clean(value);

  return result || null;
}

function numberValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = clean(value)
    .replace(/S\/?\.?/gi, "")
    .replace(/,/g, "")
    .replace(/\s/g, "");

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeKey(value: unknown): string {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);

    if (date) {
      return new Date(
        date.y,
        date.m - 1,
        date.d,
        date.H ?? 0,
        date.M ?? 0,
        Math.floor(date.S ?? 0)
      );
    }
  }

  const result = new Date(clean(value));

  if (Number.isNaN(result.getTime())) {
    return null;
  }

  return result;
}

function rowToObject(
  headers: unknown[],
  row: unknown[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  headers.forEach((header, index) => {
    result[normalizeKey(header)] = row[index];
  });

  return result;
}

async function importSalesSummary() {
  console.log("Importando control comercial...");

  const filePath = path.join(
    process.cwd(),
    "data",
    "control_ventas_2026.xlsx"
  );

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  });

  const worksheet = workbook.Sheets["Totales"];

  if (!worksheet) {
    throw new Error(
      "No existe la hoja Totales en control_ventas_2026.xlsx"
    );
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  await prisma.salesSummary.deleteMany();

  let imported = 0;

  for (const row of rows) {
    for (let index = 0; index < row.length; index++) {
      const value = clean(row[index]);

      const match = value.match(
        /^total\s+(.+?)\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)$/i
      );

      if (!match) {
        continue;
      }

      const seller = match[1]
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

      const month = MONTHS[match[2].toLowerCase()];

      let totalPen = 0;

      for (
        let next = index + 1;
        next < Math.min(index + 5, row.length);
        next++
      ) {
        const candidate = numberValue(row[next]);

        if (candidate !== 0) {
          totalPen = candidate;
          break;
        }
      }

      if (!totalPen) {
        continue;
      }

      await prisma.salesSummary.upsert({
        where: {
          seller_month_year: {
            seller,
            month,
            year: 2026,
          },
        },
        update: {
          totalPen,
        },
        create: {
          seller,
          month,
          year: 2026,
          totalPen,
        },
      });

      imported++;
    }
  }

  console.log(`SalesSummary importados: ${imported}`);
}

async function importOrders() {
  console.log("Importando detalle de pedidos...");

  const filePath = path.join(
    process.cwd(),
    "data",
    "detalle_pedidos_2026.xlsx"
  );

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  });

  const worksheet = workbook.Sheets["Detalle"];

  if (!worksheet) {
    throw new Error(
      "No existe la hoja Detalle en detalle_pedidos_2026.xlsx"
    );
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  const headerIndex = rows.findIndex((row) => {
    const normalized = row.map(normalizeKey);

    return (
      normalized.includes("vendedor") &&
      normalized.includes("pedido")
    );
  });

  if (headerIndex < 0) {
    throw new Error(
      "No se encontraron los encabezados del detalle de pedidos."
    );
  }

  const headers = rows[headerIndex];

  const records: {
    seller: string | null;
    sellerCode: string | null;
    orderNumber: string;
    date: Date;
    client: string | null;
    channel: string | null;
    status: string | null;
    sku: string | null;
    product: string | null;
    brand: string | null;
    category: string | null;
    quantity: number;
    unitPrice: number;
    totalPen: number;
    paymentMethod: string | null;
    district: string | null;
  }[] = [];

  let currentSeller: string | null = null;
  let currentSellerCode: string | null = null;

  for (const row of rows.slice(headerIndex + 1)) {
    const record = rowToObject(headers, row);

    if (nullable(record.vendedor)) {
      currentSeller = nullable(record.vendedor);
    }

    if (nullable(record.codigo)) {
      currentSellerCode = nullable(record.codigo);
    }

    const orderNumber = clean(record.pedido);
    const date = parseDate(record.fecha);

    if (!orderNumber || !date) {
      continue;
    }

    records.push({
      seller: currentSeller,
      sellerCode: currentSellerCode,
      orderNumber,
      date,
      client: nullable(record.cliente),
      channel: nullable(record.canal),
      status: nullable(record.estado),
      sku: nullable(record.sku),
      product: nullable(record.producto),
      brand: nullable(record.marca),
      category: nullable(record.categoria),
      quantity: Math.round(
        numberValue(record.cantidad)
      ),
      unitPrice: numberValue(
        record.precio_unit ?? record.precio_unitario
      ),
      totalPen: numberValue(
        record.total_pen ?? record.total
      ),
      paymentMethod: nullable(record.medio_pago),
      district: nullable(record.distrito),
    });
  }

  await prisma.orderLine.deleteMany();

  const chunkSize = 500;

  for (
    let index = 0;
    index < records.length;
    index += chunkSize
  ) {
    await prisma.orderLine.createMany({
      data: records.slice(index, index + chunkSize),
    });
  }

  console.log(`OrderLine importados: ${records.length}`);
}

async function main() {
  console.log("Iniciando importación...");

  await importSalesSummary();
  await importOrders();

  console.log("Importación terminada.");
}

main()
  .catch((error) => {
    console.error("Error importando información:");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });