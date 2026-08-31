"use client";

import Link from "next/link";

import { interviewQuestions } from "@/data/questions";
import { answerReferences } from "@/data/answerReferences";

export default function AnswerReferencePage() {
  const references = [...answerReferences].sort(
    (a, b) => a.questionId - b.questionId
  );

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#17212b]">
      {/* Official Idyllic top bar */}
      <div className="relative h-[72px] w-full overflow-hidden">
        <img
          src="/top-bar.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <img
          src="/idyllic-logo-white.png"
          alt="Idyllic Education"
          className="absolute left-6 top-1/2 h-12 w-auto -translate-y-1/2 object-contain sm:left-10 lg:left-14"
        />

        <div className="absolute right-6 top-1/2 -translate-y-1/2 sm:right-10 lg:right-14">
          <p className="text-right text-sm font-bold uppercase tracking-[0.16em] text-white drop-shadow-[0_0_7px_rgba(57,168,69,0.75)] sm:text-base">
            Pre-CAS Interview Simulator
          </p>
        </div>
      </div>

      {/* Page content */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="max-w-3xl">
          <div className="mb-5 h-[2px] w-10 bg-[#39a845]" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580]">
            Preparation Support
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#17212b] sm:text-5xl">
            Answer Reference
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#687580] sm:text-base">
            Explore example answers for the questions used in the
            Pre-CAS Interview Simulator. These references are designed
            to help you understand how to structure a strong and natural
            response.
          </p>
        </div>

        {/* Guidance notice */}
        <div className="mt-10 max-w-4xl rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-[#303b45]">
            Important guidance
          </p>

          <p className="mt-3 text-sm leading-7 text-[#687580]">
            Reference answers are provided for preparation and guidance.
            Your actual interview answers should be truthful, personal,
            and based on your own circumstances. Do not memorize these
            answers word-for-word.
          </p>
        </div>

        {/* All Answer References */}
        <section className="mt-10 max-w-4xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-[#687580]">
              {references.length} questions available
            </p>
          </div>

          <div className="space-y-10">
            {references.map((reference) => {
              const question = interviewQuestions.find(
                (item) => item.id === reference.questionId
              );

              if (!question) {
                return null;
              }

              return (
                <section
                  key={reference.questionId}
                  className="scroll-mt-8"
                >
                  {/* Question */}
                  <div className="rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#243f9f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#243f9f]">
                        Question {reference.questionId}
                      </span>

                      <span className="text-xs font-medium text-[#8a9298]">
                        {question.category}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-semibold leading-8 text-[#17212b] sm:text-2xl">
                      {question.question}
                    </h2>
                  </div>

                  {/* Reference Answers */}
                  <div className="mt-6 space-y-5">
                    {reference.answers.map((answer, index) => (
                      <article
                        key={index}
                        className="rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-8"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#39a845]/10 text-sm font-bold text-[#39a845]">
                            {index + 1}
                          </div>

                          <h3 className="text-base font-semibold text-[#303b45]">
                            Reference Answer {index + 1}
                          </h3>
                        </div>

                        <p className="mt-5 text-sm leading-8 text-[#52606d] sm:text-base">
                          {answer}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {/* Back to interview */}
        <div className="mt-10">
          <Link
            href="/interview/start"
            className="inline-flex items-center gap-2 rounded-xl bg-[#243f9f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#243f9f]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1d3485] hover:shadow-xl hover:shadow-[#243f9f]/20"
          >
            <span>Back to Interview</span>
            <span className="text-lg">
              &rarr;
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
