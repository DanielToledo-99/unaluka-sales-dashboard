# Unaluka Sales Dashboard

Sistema web desarrollado como solución al reto técnico de Unaluka para centralizar y consultar la información comercial correspondiente al periodo enero-mayo de 2026.

## Funcionalidades

- Autenticación mediante Google.
- Dashboard de ventas.
- Total acumulado de ventas.
- Evolución mensual.
- Ventas por vendedor.
- Ranking de productos y SKU.
- Gestión de usuarios.
- Roles ADMIN y VIEWER.
- Importación automática de archivos Excel.
- Ejecución completamente mediante Docker.

## Administradores iniciales

Los siguientes correos reciben automáticamente permisos de administrador:

- gasto@unaluka.com
- tech@unaluka.com

Los demás usuarios registrados mediante Google reciben inicialmente permisos de solo lectura.

## Stack

- Next.js 15
- React 19
- TypeScript
- Auth.js / NextAuth
- Prisma ORM
- SQLite
- SheetJS
- Docker
- pnpm

## Arquitectura

Los archivos Excel se procesan mediante un script de importación y su información se almacena en SQLite.

Flujo:

Excel -> Import Script -> Prisma -> SQLite -> Next.js

Los archivos utilizados son:

- `data/control_ventas_2026.xlsx`
- `data/detalle_pedidos_2026.xlsx`

## Variables de entorno

Copiar el archivo:

```bash
cp .env.example .env