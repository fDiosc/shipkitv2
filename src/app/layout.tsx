import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShipKit | Ship your idea in 5 minutes",
  description: "The complete toolkit for indie hackers to build and validate micro-SaaS landing pages without code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
