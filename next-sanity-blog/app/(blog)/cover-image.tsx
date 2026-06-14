import { Image } from "next-sanity/image";

import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority } = props;
  const image = source?.asset?._ref ? (
    <Image
      className="h-auto w-full rounded-[1.75rem] object-cover"
      width={2000}
      height={1000}
      alt={source?.alt || ""}
      src={urlForImage(source)?.height(1000).width(2000).url() as string}
      sizes="100vw"
      priority={priority}
    />
  ) : (
    <div className="h-full w-full rounded-[1.75rem] bg-slate-100" style={{ minHeight: 260 }} />
  );

  return (
    <div className="overflow-hidden rounded-[1.75rem] shadow-2xl transition duration-200 group-hover:shadow-2xl sm:mx-0">
      {image}
    </div>
  );
}
