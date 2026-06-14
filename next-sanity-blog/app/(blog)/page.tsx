import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult } from "@/sanity.types";
import type { PortableTextBlock } from "next-sanity";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";

type SettingsDescription = Array<{
  _key: string;
  _type: "block";
  children?: Array<{
    _key: string;
    _type: "span";
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: "link";
    href?: string;
  }>;
  style?: "normal";
  listItem?: never;
  level?: number;
}>;

function HeroSection({
  title,
  description,
}: {
  title: string | null | undefined;
  description: string | SettingsDescription | undefined;
}) {
  const heroTitle = title || demo.title;
  const heroDescription =
    Array.isArray(description) && description.length > 0
      ? description
      : typeof description === "string"
      ? description
      : demo.description;
  const isPortableText = Array.isArray(heroDescription);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)] px-6 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-sm">
            TechVerse
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          {isPortableText ? (
            <div className="mt-6 max-w-xl text-slate-700">
              <PortableText value={heroDescription as PortableTextBlock[]} />
            </div>
          ) : (
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {heroDescription}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Discover stories
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300"
            >
              Browse categories
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Today’s highlights</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Insights</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">AI trends to watch</p>
            </div>
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Guides</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Build smarter workflows</p>
            </div>
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Stories</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Future tech voices</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.12)] transition hover:-translate-y-1">
      <Link className="group block overflow-hidden rounded-t-[2rem]" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="space-y-6 px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.35em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Featured</span>
          <span>{date && <DateComponent dateString={date} />}</span>
        </div>
        <h3 className="text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
          <Link href={`/posts/${slug}`} className="hover:text-amber-500">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="text-lg leading-8 text-slate-600">{excerpt}</p>}
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ query: heroQuery }),
  ]);

  return (
    <div className="container mx-auto px-5 pb-16 pt-10">
      <HeroSection title={settings?.title} description={settings?.description} />
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <div className="mt-16">
          <Onboarding />
        </div>
      )}
      {heroPost?._id && (
        <aside className="mt-20">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Read more from our editorial</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">More Stories</h2>
            </div>
          </div>
          <Suspense>
            <MoreStories skip={heroPost._id} limit={100} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
