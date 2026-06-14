import Link from "next/link";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";

import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
}) {
  const data = await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <div className="mb-32 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-10 lg:gap-x-12">
      {data?.map((post) => {
        const { _id, title, slug, coverImage, excerpt, author } = post;
        return (
          <article
            key={_id}
            className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Link href={`/posts/${slug}`} className="block overflow-hidden rounded-[1.5rem]">
              <CoverImage image={coverImage} priority={false} />
            </Link>
            <div className="mt-6 space-y-4">
              <h3 className="text-3xl font-bold tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-cyan-600">
                <Link href={`/posts/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
              <div className="text-sm uppercase tracking-[0.35em] text-slate-500">
                <DateComponent dateString={post.date} />
              </div>
              {excerpt && (
                <p className="text-base leading-relaxed text-slate-700">
                  {excerpt}
                </p>
              )}
              {author && <Avatar name={author.name} picture={author.picture} />}
            </div>
          </article>
        );
      })}
    </div>
  );
}
