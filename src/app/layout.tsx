import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Unaluka Sales Dashboard",
  description: "Dashboard comercial de Unaluka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}