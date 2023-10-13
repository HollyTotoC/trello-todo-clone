import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Troto : Trello 2.0 AI Clone",
    description: "A clone project of Trello to learn Next.js and Tailwind CSS",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`bg-[#f5f6f8] ${inter.className}`}>
                {children}
            </body>
        </html>
    );
}
