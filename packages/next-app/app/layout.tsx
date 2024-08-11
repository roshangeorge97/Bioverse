import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppKit } from "../context/web3modal";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AppKit",
  description: "AppKit Example",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <AppKit>{children}</AppKit>
      </body>
    </html>
  );
}
