"use client";

import Link from "next/link";
import { useState } from "react";

import { interviewQuestions } from "@/data/questions";
import { answerReferences } from "@/data/answerReferences";

export default function AnswerReferencePage() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const questionsWithAnswers = answerReferences
    .map((reference) => {
      const question = interviewQuestions.find(
        (item) => item.id === reference.questionId
      );

      return {
        reference,
        question,
      };
    })
    .filter((item) => item.question);

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestion((current) =>
      current === questionId ? null : questionId
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#17212b]">
      {/* Fixed official Idyllic top bar */}
      <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-gradient-to-r from-[#1d3040] via-[#173d4b] to-[#126d68] shadow-lg">
        <div className="mx-auto flex h-full w-full items-center justify-between px-6 sm:px-10 lg:px-14">
          {/* Logo */}
          <Link
            href="/interview/start"
            className="flex h-full items-center"
            aria-label="Back to Interview"
          >
            <img
              src="/idyllic-logo-white.png"
              alt="Idyllic Education Consultants"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-1 md:flex">
            <Link
              href="/interview/start"
              className="group flex h-full items-center gap-2 border-b-2 border-transparent px-5 text-sm font-semibold text-white/85 transition hover:text-white"
            >
              <span className="text-base">⌂</span>
              <span>Interview</span>
            </Link>

            <Link
              href="/interview/answers"
              className="group flex h-full items-center gap-2 border-b-2 border-[#39a845] px-5 text-sm font-semibold text-[#39a845] transition"
            >
              <span className="text-base">▢</span>
              <span>Sample Answers</span>
            </Link>
          </nav>

          {/* Simulator title */}
          <div className="ml-auto">
            <p className="text-right text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm lg:text-base">
              Pre-CAS Interview Simulator
            </p>
          </div>
        </div>
      </header>

      {/* Page content */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-[104px] sm:px-10 lg:px-14 lg:pt-[112px]">
        {/* Back to Interview */}
        <div className="mb-8">
          <Link
            href="/interview/start"
            className="inline-flex items-center gap-2 rounded-xl border border-[#39a845]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#246b3a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#39a845] hover:bg-[#f7fff8] hover:shadow-md"
          >
            <span className="text-base">←</span>
            <span>Back to Interview</span>
          </Link>
        </div>

        {/* Page heading */}
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580]">
            Preparation Support
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#17212b] sm:text-5xl">
            Sample Answers
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#687580] sm:text-base">
            Explore sample answers for questions used in the Pre-CAS
            Interview Simulator. These examples are designed to help you
            understand how to structure a clear, natural, and relevant
            response.
          </p>
        </div>

        {/* Guidance notice */}
        <div className="mt-9 max-w-4xl rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-500">
              i
            </div>

            <div>
              <p className="text-sm font-semibold text-[#303b45]">
                Important guidance
              </p>

              <p className="mt-2 text-sm leading-7 text-[#687580]">
                These sample answers are provided for preparation and
                guidance only. Your actual interview answers should be
                truthful, personal, and based on your own circumstances.
                Do not memorize these answers word-for-word.
              </p>
            </div>
          </div>
        </div>

        {/* Question count */}
        <div className="mt-7 max-w-4xl">
          <p className="text-sm font-medium text-[#687580]">
            {questionsWithAnswers.length} questions available
          </p>
        </div>

        {/* Questions */}
        <div className="mt-4 max-w-4xl space-y-4">
          {questionsWithAnswers.map(
            ({ reference, question }, questionNumber) => {
              if (!question) {
                return null;
              }

              const isExpanded =
                expandedQuestion === reference.questionId;

              return (
                <section
                  key={reference.questionId}
                  className="overflow-hidden rounded-2xl border border-[#dfe2e4] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Question header */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleQuestion(reference.questionId)
                    }
                    className="w-full text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[#eaf7ed] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#267441]">
                              Question {questionNumber + 1}
                            </span>

                            <span className="text-xs font-medium text-[#7a878f]">
                              {question.category}
                            </span>
                          </div>

                          <h2 className="mt-4 pr-2 text-lg font-semibold leading-7 text-[#17212b] sm:text-xl">
                            {question.question}
                          </h2>
                        </div>

                        <div
                          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                            isExpanded
                              ? "border-[#39a845]/40 bg-[#f2fbf4] text-[#267441]"
                              : "border-[#dfe2e4] bg-[#fafafa] text-[#52606d]"
                          }`}
                        >
                          <span className="text-lg leading-none">
                            {isExpanded ? "⌃" : "⌄"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Sample answers */}
                  {isExpanded && (
                    <div className="border-t border-[#edf0f1] px-5 pb-6 pt-4 sm:px-6 sm:pb-7">
                      <div className="space-y-3">
                        {reference.answers.map((answer, index) => (
                          <article
                            key={index}
                            className="rounded-xl border border-[#dcefe0] bg-[#f7fcf8] p-4 sm:p-5"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9f1df] text-sm font-bold text-[#267441]">
                                {index + 1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-[#303b45]">
                                  Sample Answer {index + 1}
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-[#52606d]">
                                  {answer}
                                </p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            }
          )}
        </div>

        {/* Bottom navigation */}
        <div className="mt-10 max-w-4xl">
          <Link
            href="/interview/start"
            className="inline-flex items-center gap-2 rounded-xl bg-[#243f9f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#243f9f]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1d3485] hover:shadow-xl hover:shadow-[#243f9f]/20"
          >
            <span>Back to Interview</span>
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
