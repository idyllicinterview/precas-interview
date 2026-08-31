"use client";

import Image from "next/image";
import Link from "next/link";

const studySteps = [
  {
    number: "01",
    title: "Choose Your Course",
    note: "Select a course that matches your academic background, interests, and future career plans.",
  },
  {
    number: "02",
    title: "Choose Your University",
    note: "Research suitable UK universities and compare courses, location, fees, and entry requirements.",
  },
  {
    number: "03",
    title: "Submit Your Application",
    note: "Complete the required application and provide your academic and personal information and supporting documents.",
  },
  {
    number: "04",
    title: "Receive Your Offer",
    note: "The university reviews your application and may issue a conditional or unconditional offer.",
  },
  {
    number: "05",
    title: "Meet Your Conditions",
    note: "Complete any outstanding requirements, such as academic results, English-language requirements, or requested documents.",
  },
  {
    number: "06",
    title: "Receive Your CAS",
    note: "Once the university's requirements are satisfied, the university can issue your Confirmation of Acceptance for Studies (CAS).",
  },
  {
    number: "07",
    title: "Apply for Your Student Visa",
    note: "Use your CAS and required documents to make your Student visa application.",
  },
  {
    number: "08",
    title: "Prepare for the UK",
    note: "Arrange accommodation, finances, travel, documents, and other essentials before departure.",
  },
  {
    number: "09",
    title: "Arrive in the UK",
    note: "Travel to the UK, complete your university's arrival and enrolment process, and begin your studies.",
  },
];

export default function UKStudyGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#17212b]">
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

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-14">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Idyllic Education
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            UK Study Guide
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Your step-by-step guide to studying in the UK, from choosing
            your course to arriving and starting your studies.
          </p>
        </div>

        <div className="space-y-4">
          {studySteps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-[#e5e5e0] bg-white p-6 shadow-sm transition hover:border-[#b9d9c0] hover:shadow-md sm:p-7"
            >
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
                  {step.number}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#17212b] sm:text-xl">
                    {step.title}
                  </h2>

                  <p className="mt-2 leading-7 text-[#66727d]">
                    {step.note}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-sm">
          <p className="text-sm leading-6 text-[#66727d]">
            <span className="font-semibold text-[#25833a]">
              Please note:
            </span>{" "}
            UK university and visa requirements may change. Always check
            the latest official guidance before making an application.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/interview/start"
            className="rounded-xl border border-[#b9d9c0] bg-white px-6 py-3 font-semibold text-[#25833a] shadow-sm transition hover:bg-[#f3faf4]"
          >
            Back to Interview Simulator
          </Link>
        </div>
      </section>
    </main>
  );
}






