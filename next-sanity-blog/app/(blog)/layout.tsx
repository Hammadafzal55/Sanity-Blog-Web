import "../globals.css";

import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || "TechVerse";
  const description = settings?.description;
  const descriptionText = description
    ? toPlainText(description)
    : "TechVerse — a modern technology blog for thoughtful readers and creators.";

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: descriptionText,
    icons: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "apple-touch-icon", url: "/favicon.jpg" },
    ],
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function SiteHeader({ siteTitle }: { siteTitle: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-900 shadow-sm backdrop-blur">
      <div className="container mx-auto flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group inline-flex items-center gap-3 transition hover:opacity-90">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-white shadow-lg shadow-amber-300/30">
            T
          </span>
          <div>
            <p className="text-lg font-black uppercase tracking-[0.35em] text-slate-950">
              {siteTitle}
            </p>
            <p className="text-sm text-slate-500">
              A bold tech blog for sharp ideas and real-world innovation.
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
            <Link href="/" className="transition hover:text-slate-900">
              Blog
            </Link>
            <a
              href="https://github.com/Hammadafzal55"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-slate-900"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-slate-900"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function AppFooter({ footer }: { footer: PortableTextBlock[] }) {
  if (footer.length > 0) {
    return (
      <footer className="bg-slate-950 text-slate-100">
        <div className="container mx-auto px-5 py-16">
          <PortableText
            className="prose-sm max-w-none text-slate-100"
            value={footer as PortableTextBlock[]}
          />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="container mx-auto space-y-12 px-5 py-16 text-sm">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              TechVerse
            </p>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              TechVerse delivers next-level tech stories, deep dives, and product guides for curious minds.
            </p>
            <div className="mt-6 inline-flex rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
              <span className="mr-2 h-2 w-2 rounded-full bg-cyan-400"></span>
              Weekly updates on AI, dev tools, and digital design.
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.35em] text-slate-400">
              Blog links
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Latest stories
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Hammadafzal55"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-slate-500">
          Built for modern tech publishing with bold content, sharp design, and seamless preview.
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const siteTitle = data?.title || "TechVerse";
  const footer = (data?.footer || []) as PortableTextBlock[];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} bg-slate-50 text-slate-900`}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SiteHeader siteTitle={siteTitle} />
        <section className="min-h-screen bg-slate-50">
          {isDraftMode && <AlertBanner />}
          <main className="relative z-10">{children}</main>
          <AppFooter footer={footer} />
        </section>
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
