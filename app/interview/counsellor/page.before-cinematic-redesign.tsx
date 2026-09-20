"use client";

import Link from "next/link";

const stats = [
  { value: "5+", label: "Years of experience" },
  { value: "200+", label: "Students guided" },
  { value: "150+", label: "Visas granted" },
  { value: "30+", label: "Universities" },
];

const approach = [
  {
    number: "01",
    title: "Understand",
    text: "Every student's academic background, ambitions and circumstances are different. The first step is understanding the person behind the application.",
  },
  {
    number: "02",
    title: "Prepare",
    text: "Good preparation means knowing your course, university, reasons for choosing the UK and how your studies connect to your future.",
  },
  {
    number: "03",
    title: "Guide",
    text: "From university selection to the application journey, students receive practical guidance designed around their individual goals.",
  },
  {
    number: "04",
    title: "Support",
    text: "The relationship does not end when an application is submitted. Students need support and confidence throughout the journey.",
  },
];

export default function CounsellorPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#17191c]">
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden bg-[#17191c] text-white">
        <img
          src="/counsellor/hero-office.JPG"
          alt="Ashok Kumar Yadav, UK Education Counsellor"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1800px] items-end px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20 xl:px-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65 sm:text-xs">
              Pre-CAS Interview · Idyllic Education Consultants
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[7.5rem]">
              Meet your
              <br />
              <span className="text-white/65">UK counsellor.</span>
            </h1>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10">
              <div>
                <p className="text-xl font-medium sm:text-2xl">
                  Ashok Kumar Yadav
                </p>
                <p className="mt-1 text-sm text-white/60">
                  UK Education Counsellor
                </p>
              </div>

              <p className="max-w-md text-sm leading-6 text-white/65">
                Guidance designed to help students understand their choices,
                prepare with confidence and move forward with purpose.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 hidden items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-white/50 sm:flex lg:right-16">
          <span className="h-px w-12 bg-white/30" />
          Scroll to explore
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16 lg:py-32 xl:px-24">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
            01 · The person behind the guidance
          </p>

          <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            More than an application.
          </h2>
        </div>

        <div className="max-w-2xl lg:pt-10">
          <p className="text-xl leading-8 text-black/70 sm:text-2xl sm:leading-9">
            A UK study journey begins long before a student arrives at an
            airport. It begins with understanding what you want, why you want
            it and how your chosen path connects to your future.
          </p>

          <p className="mt-7 text-base leading-7 text-black/55">
            Ashok Kumar Yadav works with students at that important stage,
            helping them navigate university choices, course decisions,
            applications and the preparation required to confidently explain
            their study plans.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
            <span>MBA</span>
            <span>ICEF Certified Agent</span>
            <span>British Council Certified Agent</span>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bg-[#20242a] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-24">
          <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                02 · By the numbers
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Experience you can see.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/50">
              A growing body of experience built through working directly with
              students pursuing higher education in the UK.
            </p>
          </div>

          <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-white/10 px-2 py-9 sm:border-r sm:px-6 lg:border-b-0 lg:first:pl-0"
              >
                <p className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  {stat.value}
                </p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTRAIT / STORY */}
      <section className="mx-auto grid max-w-[1500px] gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:py-32 xl:px-24">
        <div className="relative min-h-[520px] overflow-hidden bg-black">
          <img
            src="/counsellor/portrait-bw.jpg"
            alt="Ashok Kumar Yadav"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
            03 · The journey
          </p>

          <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Five years of learning from the people behind the paperwork.
          </h2>

          <div className="mt-10 max-w-xl border-l border-black/15 pl-6">
            <p className="text-lg leading-8 text-black/65">
              Over the years, one lesson has remained consistent: no two
              students arrive with exactly the same story.
            </p>

            <p className="mt-6 text-base leading-7 text-black/50">
              That is why effective counselling is not simply about presenting
              a list of universities. It is about asking the right questions,
              understanding the student's goals and helping them make choices
              they can genuinely understand and explain.
            </p>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-[#e8e3d9]">
        <div className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
                04 · The approach
              </p>

              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
                Four steps. One clear purpose.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-6 text-black/50">
                Helping students move from uncertainty to a study plan they
                understand.
              </p>
            </div>

            <div className="divide-y divide-black/10 border-y border-black/10">
              {approach.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-4 py-8 sm:grid-cols-[80px_180px_1fr] sm:items-start"
                >
                  <span className="text-xs font-semibold tracking-[0.2em] text-black/35">
                    {item.number}
                  </span>

                  <h3 className="text-2xl font-semibold tracking-[-0.025em]">
                    {item.title}
                  </h3>

                  <p className="max-w-lg text-sm leading-6 text-black/55">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIFESTYLE IMAGE */}
      <section className="relative min-h-[72vh] overflow-hidden bg-black">
        <img
          src="/counsellor/lifestyle.JPG"
          alt="Ashok Kumar Yadav"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/15" />

        <div className="relative mx-auto flex min-h-[72vh] max-w-[1500px] items-end px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
              05 · Beyond the desk
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Guidance should feel human.
            </h2>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-[#f5f2eb]">
        <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40 xl:px-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
            06 · My vision
          </p>

          <blockquote className="mt-10 max-w-6xl text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            “My vision is to make UK education guidance more personal,
            informed and purposeful — helping every student understand not
            only where they can study, but why that choice matters to their
            future.”
          </blockquote>

          <div className="mt-12 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                Continuous learning
              </p>
              <p className="mt-3 text-sm leading-6 text-black/55">
                Ongoing professional training across UK education, counselling,
                admissions and international student recruitment.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                Professional credentials
              </p>
              <p className="mt-3 text-sm leading-6 text-black/55">
                MBA · ICEF Certified Agent · British Council Certified Agent
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                The principle
              </p>
              <p className="mt-3 text-sm leading-6 text-black/55">
                Better preparation begins with better understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT STORIES */}
      <section className="bg-[#20242a] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                07 · Student stories
              </p>

              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
                Every number represents a person.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">
                Real student journeys will be featured here — their goals,
                decisions, preparation and outcomes.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["Student story", "Student story", "Student story", "Student story"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="min-h-[220px] border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.06]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      0{index + 1}
                    </p>

                    <div className="mt-20">
                      <p className="text-lg font-medium">{item}</p>
                      <p className="mt-2 text-xs leading-5 text-white/40">
                        Verified student story to be added.
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRE-CAS */}
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_0.8fr] lg:px-16 lg:py-32 xl:px-24">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
            08 · Prepare before you progress
          </p>

          <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your journey should be something you can confidently explain.
          </h2>
        </div>

        <div className="flex flex-col justify-end lg:pb-2">
          <p className="max-w-md text-base leading-7 text-black/55">
            The Pre-CAS Interview Simulator gives students a chance to
            practise explaining their university, course, motivations and
            future plans before the real conversation.
          </p>

          <Link
            href="/interview/start"
            className="mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-[#243f9f] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#1d3485]"
          >
            Start Pre-CAS Interview
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-[#17191c] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                09 · Let's talk
              </p>

              <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Have a question about your UK study journey?
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-lg font-medium">Ashok Kumar Yadav</p>
              <p className="mt-1 text-sm text-white/45">
                UK Education Counsellor
              </p>

              <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/65">
                <a
                  href="tel:+9779802338648"
                  className="block transition hover:text-white"
                >
                  +977 980-2338648
                </a>

                <a
                  href="https://wa.me/9779802338648"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition hover:text-white"
                >
                  WhatsApp
                </a>

                <a
                  href="mailto:ashok@idyllicec.com"
                  className="block transition hover:text-white"
                >
                  ashok@idyllicec.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111315] px-6 py-7 text-white/35 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:justify-between">
          <span>Pre-CAS Interview · Idyllic Education Consultants</span>
          <Link href="/interview/start" className="transition hover:text-white">
            Back to Pre-CAS Interview
          </Link>
        </div>
      </footer>
    </main>
  );
}
