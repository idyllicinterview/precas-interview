"use client";

import Link from "next/link";

const preparationItems = [
  {
    icon: "💻",
    title: "Your device",
    text: "Use a laptop or desktop if possible.",
  },
  {
    icon: "🌐",
    title: "Stable internet",
    text: "Make sure your connection is reliable.",
  },
  {
    icon: "🔇",
    title: "Quiet space",
    text: "Choose a place where you can speak without interruptions.",
  },
  {
    icon: "💡",
    title: "Good lighting",
    text: "Make sure your face is clearly visible.",
  },
];

const interviewTips = [
  {
    icon: "💬",
    title: "Be natural",
    text: "Answer in your own words and let your personality come through.",
  },
  {
    icon: "🎯",
    title: "Answer the question",
    text: "Stay focused on what is being asked and keep your answer relevant.",
  },
  {
    icon: "🗣️",
    title: "Speak clearly",
    text: "Take your time and speak at a comfortable pace.",
  },
  {
    icon: "🧘",
    title: "Stay calm",
    text: "A small mistake is okay. Take a breath and continue.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Question",
    text: "Read the question carefully.",
  },
  {
    number: "02",
    title: "Prepare",
    text: "Use the preparation time to organise your thoughts.",
  },
  {
    number: "03",
    title: "Record",
    text: "Recording begins when the answer phase starts.",
  },
  {
    number: "04",
    title: "Answer",
    text: "Give your answer naturally and clearly.",
  },
  {
    number: "05",
    title: "Next",
    text: "Continue to the next question.",
  },
];

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#17212b]">
      {/* Header */}
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
              className="group flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold text-white/85 transition hover:text-white"
            >
              <span className="text-base">⌂</span>
              <span>Interview</span>
            </Link>

            <Link
              href="/interview/answers"
              className="group flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold text-white/85 transition hover:text-white"
            >
              <span className="text-base">▢</span>
              <span>Sample Answers</span>
            </Link>

            <Link
              href="/interview/uk-study"
              className="group flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold text-white/85 transition hover:text-white"
            >
              <span className="text-base">📚</span>
              <span>UK Study Support</span>
            </Link>

            <Link
              href="/interview/how-to-use"
              className="group flex h-full items-center gap-2 border-b-2 border-[#39a845] px-4 text-sm font-semibold text-[#39a845] transition"
            >
              <span className="text-base">ⓘ</span>
              <span>How to Use</span>
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

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8 lg:px-10">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580] sm:text-xs">
            Preparation Support
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#17212b] sm:text-5xl">
            How to Use
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#687580] sm:text-base">
            A simple guide to help you prepare for and complete your
            Pre-CAS Mock Interview with confidence.
          </p>
        </div>

        {/* 01 — Get Ready */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              01
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                Get Ready
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                A few simple checks before you begin.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {preparationItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#dfe2e4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9d9c0] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3faf4] text-xl">
                  {item.icon}
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#17212b]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#687580]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 02 — Camera & microphone */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              02
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                Check Your Camera &amp; Microphone
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                Your interview uses your camera and microphone.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-[#dfe2e4] bg-gradient-to-br from-[#edf7ef] to-white p-7 shadow-sm">
              <div className="flex h-full min-h-[230px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
                  🎥
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#17212b]">
                  Check your setup
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#687580]">
                  Make sure your camera preview is visible and your
                  microphone can capture your voice clearly.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-7">
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf7ef] text-lg">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#17212b]">
                      Camera
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#687580]">
                      Keep your face clearly visible and position yourself
                      comfortably.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf7ef] text-lg">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#17212b]">
                      Microphone
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#687580]">
                      Speak normally and make sure your voice can be heard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf7ef] text-lg">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#17212b]">
                      Browser permissions
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#687580]">
                      Allow camera and microphone access when your browser
                      asks for permission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#b9d9c0] bg-[#f7fff8] px-4 py-3">
                <p className="text-sm leading-6 text-[#4f6257]">
                  <span className="font-semibold text-[#25833a]">
                    Tip:
                  </span>{" "}
                  If your camera is not visible, check your browser
                  permissions before starting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — Start */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              03
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                Start Your Interview
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                Start when your setup is ready.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-xl">
                    ▶
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#17212b]">
                      Ready when you are
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#687580]">
                      Enter your required details, check your setup, and
                      select <strong>Start Interview</strong> when you are
                      ready to begin.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/interview/start"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#243f9f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1f368a] hover:shadow-md"
              >
                Go to Interview
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-[#dfe2e4] bg-[#f7f6f2] px-4 py-3">
              <p className="text-sm leading-6 text-[#687580]">
                Once you start, stay focused on the interview and avoid
                refreshing or closing the browser.
              </p>
            </div>
          </div>
        </section>

        {/* 04 — Interview process */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              04
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                Read, Prepare &amp; Answer
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                Each question follows a simple process.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe2e4] bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-3 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="rounded-2xl border border-[#e5e5e0] bg-[#fdfdfb] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.18em] text-[#25833a]">
                        {step.number}
                      </span>

                      {index < processSteps.length - 1 && (
                        <span className="hidden text-[#b9c3c8] md:block">
                          →
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-[#17212b]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#687580]">
                      {step.text}
                    </p>
                  </div>

                  {index < processSteps.length - 1 && (
                    <div className="my-2 text-center text-[#b9c3c8] md:hidden">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#b9d9c0] bg-[#f7fff8] px-5 py-4">
              <p className="text-sm leading-6 text-[#4f6257]">
                <span className="font-semibold text-[#25833a]">
                  Remember:
                </span>{" "}
                Use the preparation time to understand the question and
                organise your thoughts before giving your answer.
              </p>
            </div>
          </div>
        </section>

        {/* 05 — During interview */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              05
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                During the Interview
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                Keep your answers natural and genuine.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {interviewTips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-2xl border border-[#dfe2e4] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9d9c0] hover:shadow-md"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3faf4] text-xl">
                    {tip.icon}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#17212b]">
                      {tip.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#687580]">
                      {tip.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 06 — Finish */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-sm font-bold text-[#25833a]">
              06
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#17212b] sm:text-2xl">
                Finish Your Interview
              </h2>
              <p className="mt-1 text-sm text-[#687580]">
                Complete the questions to finish your mock interview.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe2e4] bg-white p-7 shadow-sm">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf7ef] text-3xl text-[#25833a]">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#17212b]">
                Interview Complete
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#687580] sm:text-base">
                Continue through the questions until your mock interview
                is complete. When you finish, you will see the completion
                screen and can review the available results and recordings.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mt-12">
          <div className="rounded-2xl border border-[#b9d9c0] bg-[#f7fff8] p-6 shadow-sm sm:p-7">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                💡
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#25833a]">
                  Quick Tips
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#17212b]">
                  Keep these in mind
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#dfe2e4] bg-white px-4 py-4">
                <p className="text-sm font-semibold text-[#17212b]">
                  Before
                </p>
                <p className="mt-1 text-sm leading-6 text-[#687580]">
                  Camera ✓ Microphone ✓ Internet ✓
                </p>
              </div>

              <div className="rounded-xl border border-[#dfe2e4] bg-white px-4 py-4">
                <p className="text-sm font-semibold text-[#17212b]">
                  During
                </p>
                <p className="mt-1 text-sm leading-6 text-[#687580]">
                  Be yourself • Stay calm • Speak clearly
                </p>
              </div>

              <div className="rounded-xl border border-[#dfe2e4] bg-white px-4 py-4">
                <p className="text-sm font-semibold text-[#17212b]">
                  Remember
                </p>
                <p className="mt-1 text-sm leading-6 text-[#687580]">
                  Answer genuinely and in your own words.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#dfe2e4] pt-5 text-center">
              <p className="text-sm font-medium leading-6 text-[#4f6257]">
                This is your opportunity to practise and improve before
                your actual Pre-CAS interview.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12 text-center">
          <p className="text-sm text-[#687580]">
            Ready to practise?
          </p>

          <Link
            href="/interview/start"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#243f9f] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1f368a] hover:shadow-md"
          >
            Start Your Interview
            <span className="ml-2">→</span>
          </Link>
        </section>
      </section>
    </main>
  );
}