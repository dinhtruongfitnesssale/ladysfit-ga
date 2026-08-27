import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Nunito — font chữ duy nhất của app: bo tròn, thân thiện, có subset tiếng Việt.
// Là variable font nên không cần khai báo `weight`, dùng được cả 400 → 800.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ladysfit Plan - Máy Tính Dinh Dưỡng",
  description: "Tính toán dinh dưỡng chuyên sâu và lên thực đơn cho khách hàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
