# Unaluka Sales Dashboard
Dashboard para centralizar ventas de enero a mayo de 2026.

## Stack
Next.js + TypeScript + Auth.js + Prisma + SQLite + SheetJS.

## Funcionalidades
- Total de ventas
- Evolución mensual
- Top productos/SKU
- Venta por vendedor
- Login con Google
- Roles ADMIN / VIEWER
- Gestión de usuarios

Admins iniciales: `gasto@unaluka.com` y `tech@unaluka.com`.

## Instalación
```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:import
npm run dev
```
Abre `http://localhost:3000`.

## Google OAuth
Crea un OAuth Client Web en Google Cloud Console.
- Origin: `http://localhost:3000`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

Completa `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` y `AUTH_SECRET` en `.env`.

## Datos
`control_ventas_2026.xlsx` alimenta ventas mensuales/por vendedor. `detalle_pedidos_2026.xlsx` alimenta pedidos y productos. `npm run db:import` normaliza ambos en SQLite.
