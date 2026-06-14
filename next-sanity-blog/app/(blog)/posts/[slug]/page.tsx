import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../avatar";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import MoreStories from "../../more-stories";
import PortableText from "../../portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const post = await sanityFetch({ query: postQuery, params });

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5 py-12">
      <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.15)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:text-slate-900">
            ← Back to TechVerse
          </Link>
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Featured read
          </span>
        </div>
      </div>

      <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_90px_-45px_rgba(15,23,42,0.14)]">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-10 sm:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.35em] text-slate-500">
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-700">Deep analysis</span>
            <span>{post.date && <DateComponent dateString={post.date} />}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">{post.excerpt}</p>}
          {post.author && (
            <div className="mt-8 flex items-center gap-4">
              <Avatar name={post.author.name} picture={post.author.picture} />
            </div>
          )}
        </div>

        <div className="px-6 pt-10 sm:px-8">
          <CoverImage image={post.coverImage} priority />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-16 pt-12 sm:px-8">
          {post.content?.length && (
            <PortableText className="text-slate-700" value={post.content as PortableTextBlock[]} />
          )}
        </div>
      </article>

      <aside className="mt-20">
        <div className="mb-10 flex items-center gap-4">
          <span className="text-sm uppercase tracking-[0.35em] text-slate-500">More stories</span>
          <hr className="flex-1 border-slate-200" />
        </div>
        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
