import type { Metadata } from "next";
import "./globals.css";
import { LayoutProvider } from "@/components/layout/LayoutProvider";

export const metadata: Metadata = {
  title: "Rajesh Garments",
  description: "clothing store for man and kids",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
