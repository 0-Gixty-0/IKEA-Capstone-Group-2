import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Header from "@/app/components/Header/Header";

export const metadata: Metadata = {
  title: "GUIDA",
  description: "Guidelines and User Information Dashboard Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body>
          <Header></Header>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
