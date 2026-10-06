import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skolkök · Sổ tay bếp trường",
  description: "Công thức, quy trình và định lượng cho bếp trường học.",
  applicationName: "Skolkök",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Skolkök", statusBarStyle: "default" },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#153e34",
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
