import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["500", "400", "300"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
const robotoMono = Roboto_Mono({
  weight: ["500", "400", "300"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Next Resume",
  /*description: "Generated by create next app",*/
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
