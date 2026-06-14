"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";

import { disableDraftMode } from "./actions";

const emptySubscribe = () => () => {};

export default function AlertBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    () => window.top === window,
    () => false,
  );

  if (!shouldShow) return null;

  return (
    <div
      className={`${
        pending ? "animate-pulse" : ""
      } fixed top-0 left-0 z-50 w-full border-b border-slate-700 bg-slate-950/95 text-slate-100 backdrop-blur-xl`}
    >
      <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 text-sm sm:flex-row">
        <div className="font-medium">
          {pending ? "Disabling draft mode..." : "Preview mode is enabled."}
        </div>
        {!pending && (
          <button
            type="button"
            onClick={() =>
              startTransition(() =>
                disableDraftMode().then(() => {
                  router.refresh();
                }),
              )
            }
            className="rounded-full bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to published
          </button>
        )}
      </div>
    </div>
  );
}
