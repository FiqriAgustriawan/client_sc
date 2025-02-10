// app/login/layout.tsx
import type { Metadata } from "next";
// import "./globals.css";

export const metadata: Metadata = {
  title: "Login - SummitCess",
  description: "Login to SummitCess and explore mountain adventures",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased bg-[#f5f5f5]">
        <main>{children}</main>
      </body>
    </html>
  );
}