import BackgroundWrapper from "@/components/BackgroundWrapper";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundWrapper>
          <div className="min-h-screen">{children}

          </div>
        </BackgroundWrapper>
      </body>
    </html>
  );
}
