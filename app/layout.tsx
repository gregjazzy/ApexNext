import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX Next | GPS de la Mutation Professionnelle",
  description: "Votre GPS stratégique pour naviguer la transformation professionnelle face à l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

