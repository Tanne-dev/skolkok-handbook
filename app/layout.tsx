import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skolkök · Sổ tay bếp trường",
  description: "Công thức, quy trình và định lượng cho bếp trường học.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
