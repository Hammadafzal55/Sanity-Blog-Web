import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => (
        <h2 className="mt-12 scroll-mt-28 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-10 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-10 text-xl font-semibold tracking-tight text-slate-900">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="text-base leading-8 text-slate-700">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mt-10 border-l-4 border-slate-200 bg-slate-50 px-6 py-5 text-slate-800 italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mt-6 ml-6 list-disc space-y-3 text-slate-700">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mt-6 ml-6 list-decimal space-y-3 text-slate-700">{children}</ol>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value?.href}
          className="font-semibold text-slate-950 underline decoration-amber-300 decoration-2 underline-offset-4 transition hover:text-amber-600"
          rel="noreferrer noopener"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div
      className={[
        "prose prose-slate prose-a:text-slate-950 prose-a:font-semibold prose-a:no-underline prose-blockquote:border-slate-200 prose-blockquote:bg-slate-50 prose-blockquote:text-slate-800 prose-ol:marker:text-slate-600 prose-ul:marker:text-slate-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
