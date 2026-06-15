"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Comment = {
  id: string;
  username: string;
  comment: string;
  createdAt: string;
};

const CommentSection = () => {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const savedComments = localStorage.getItem("comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !comment.trim()) return;

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username: username.trim(),
      comment: comment.trim(),
      createdAt: new Date().toLocaleString(),
    };

    setComments([newComment, ...comments]);
    setUsername("");
    setComment("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 overflow-x-hidden">
      <div className="container mx-auto max-w-full px-5 overflow-x-hidden">
        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.15)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:text-slate-900">
              ← Back to TechVerse
            </Link>
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              Comments
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Share your thoughts
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Add a comment below and keep the conversation going. Your comments are saved locally in the browser for this demo.
          </p>
        </div>

        <main className="min-w-0 grid gap-10 items-start max-w-full overflow-x-hidden lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <section className="min-w-0 w-full max-w-full overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_24px_74px_-44px_rgba(15,23,42,0.16)] sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Live comments</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Recent activity</h2>
              </div>
            </div>

            {comments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No comments yet. Be the first to comment.
              </div>
            ) : (
              <ul className="space-y-6">
                {comments.map((item) => (
                  <li key={item.id} className="min-w-0 w-full max-w-full rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 w-full sm:max-w-[65%]">
                        <p className="text-lg font-semibold text-slate-900 truncate">{item.username}</p>
                        <p className="text-sm text-slate-500">{item.createdAt}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                        <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 whitespace-nowrap">
                          Comment
                        </span>
                      </div>
                    </div>
                    <p className="mt-5 break-words text-slate-700 leading-7">{item.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="min-w-0 w-full rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_74px_-44px_rgba(15,23,42,0.4)] sm:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Add your voice</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Write a new comment</h2>
            <p className="mt-4 text-slate-300 leading-7">
              Keep the reply thoughtful and readable. This form saves your comments to local browser storage so you can see them instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-slate-200">
                  Name
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-semibold text-slate-200">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={6}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Share your thoughts"
                  className="w-full rounded-[1.75rem] border border-slate-700 bg-slate-900/90 px-4 py-4 text-sm text-white outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Post comment
              </button>
            </form>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default function page() {
  return <CommentSection />;
}
