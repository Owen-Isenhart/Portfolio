import Providers from './providers';
import type { Metadata } from "next";
import { Pirata_One, Yellowtail, IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk} from "next/font/google";
import "./globals.css";

const pirata = Pirata_One({
  variable: "--font-pirata",
  subsets: ["latin"],
  weight: "400",
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: "400",
});


const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Owen Isenhart's Portfolio",
  description: "The portfolio for Owen Isenhart, a computer science student at The University of Texas at Dallas (UTD). Learn about me and check out my projects, experience, and notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" /> 
      </head>
      <body
        className={`${pirata.variable} ${yellowtail.variable} ${space.variable} ${sans.variable} ${mono.variable} antialiased relative flex min-h-svh flex-col overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
        
      </body>
    </html>
  );
}
