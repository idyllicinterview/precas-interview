"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-[#17212b]">
      <header className="border-b border-[#e5e5e0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580]">
              Pre-CAS Interview Simulator
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-[#243f9f]">
              Share Your Feedback
            </h1>
          </div>

          <Link
            href="/interview/start"
            className="text-sm font-semibold text-[#243f9f] transition hover:text-[#1d3485]"
          >
            Back to Interview
          </Link>
        </div>
      </header>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-sm sm:p-8">
            {!submitted ? (
              <>
                <div className="mb-7">
                  <div className="mb-5 h-[2px] w-10 bg-[#39a845]" />

                  <h2 className="text-2xl font-bold tracking-tight text-[#17212b] sm:text-3xl">
                    Help Us Improve
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#66727d] sm:text-base">
                    Your suggestions and feedback help us improve the
                    Pre-CAS interview experience for future students.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-[#17212b]"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl border border-[#d9ddd8] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9aa3aa] focus:border-[#243f9f] focus:ring-2 focus:ring-[#243f9f]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#17212b]"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      className="w-full rounded-xl border border-[#d9ddd8] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9aa3aa] focus:border-[#243f9f] focus:ring-2 focus:ring-[#243f9f]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feedback"
                      className="mb-2 block text-sm font-semibold text-[#17212b]"
                    >
                      Your Feedback
                    </label>

                    <textarea
                      id="feedback"
                      name="feedback"
                      rows={7}
                      placeholder="Tell us what you think, what we could improve, or what features you would like to see..."
                      required
                      className="w-full resize-y rounded-xl border border-[#d9ddd8] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#9aa3aa] focus:border-[#243f9f] focus:ring-2 focus:ring-[#243f9f]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#243f9f] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#243f9f]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1d3485] hover:shadow-xl hover:shadow-[#243f9f]/20 active:translate-y-0"
                  >
                    <span>Submit Feedback</span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#39a845]/10 text-2xl text-[#25833a]">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#17212b]">
                  Thank You!
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66727d]">
                  Thank you for sharing your feedback. Your suggestions
                  are valuable and will help us improve the experience.
                </p>

                <Link
                  href="/interview/start"
                  className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#243f9f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1d3485]"
                >
                  Return to Interview
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-[#7a858d]">
            We appreciate your time and suggestions.
          </p>
        </div>
      </section>
    </main>
  );
}
