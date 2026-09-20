"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const stats = [
  { final: 5, suffix: "+", label: "Years of experience" },
  { final: 200, suffix: "+", label: "Students guided" },
  { final: 150, suffix: "+", label: "Visas granted" },
  { final: 30, suffix: "+", label: "Universities" },
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

function AnimatedNumber({
  final,
  suffix,
  start,
}: {
  final: number;
  suffix: string;
  start: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }

    let frame = 0;
    const duration = 1500;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * final));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setValue(final);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [final, start]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function CounsellorPage() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const element = statsRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f2eb] text-[#17191c]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <img
          src="/counsellor/hero-cinematic.png"
          alt="Ashok Kumar Yadav, UK Education Counsellor"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="absolute left-6 top-7 z-10 sm:left-10 sm:top-9 lg:left-16 xl:left-24">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
            Pre-CAS Interview
          </p>
          <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-white/45">
            Idyllic Education Consultants
          </p>
        </div>

        <div className="absolute right-6 top-8 z-10 hidden text-right text-[8px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:block lg:right-16 xl:right-24">
          Guidance · Opportunity · A Brighter Future
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1700px] items-end px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20 xl:px-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55 sm:text-xs">
              UK Education Counsellor
            </p>

            <h1 className="max-w-4xl text-[3.8rem] font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem] xl:text-[8.5rem]">
              Meet your
              <br />
              <span className="text-white/70">UK counsellor.</span>
            </h1>

            <div className="mt-7 flex flex-col gap-6 sm:mt-9 sm:flex-row sm:items-end sm:gap-10">
              <div>
                <p className="text-xl font-medium sm:text-2xl">
                  Ashok Kumar Yadav
                </p>
                <p className="mt-1 text-sm text-white/55">
                  UK Education Counsellor
                </p>
              </div>

              <p className="max-w-md text-sm leading-6 text-white/60">
                Helping students understand their choices, prepare with
                confidence and move forward with purpose.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 text-xl">
                ↓
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section
        ref={statsRef}
        className="relative min-h-[78vh] overflow-hidden bg-[#15191e] text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(62,86,120,0.32),transparent_52%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/75" />

          <div className="absolute -bottom-10 left-1/2 h-[55%] w-[110%] -translate-x-1/2 opacity-[0.12]">
            <div className="absolute bottom-0 left-[12%] h-[55%] w-[7%] bg-white/20" />
            <div className="absolute bottom-0 left-[25%] h-[75%] w-[10%] bg-white/10" />
            <div className="absolute bottom-0 left-[43%] h-[92%] w-[8%] bg-white/15" />
            <div className="absolute bottom-0 left-[62%] h-[65%] w-[11%] bg-white/10" />
            <div className="absolute bottom-0 right-[12%] h-[100%] w-[9%] bg-white/20" />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1700px] flex-col justify-between px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-24">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45">
                02 · By the numbers
              </p>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Experience you can see.
              </h2>
            </div>

            <div className="flex max-w-md items-start gap-5 lg:pt-3">
              <span className="mt-1 h-14 w-px bg-white/25" />
              <p className="text-sm leading-6 text-white/55">
                A growing body of experience built through working directly
                with students pursuing higher education in the UK.
              </p>
            </div>
          </div>

          <div className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-white/15 px-1 py-9 sm:border-r sm:px-7 lg:border-b-0 lg:py-10 lg:first:pl-0"
              >
                <p className="text-6xl font-semibold tracking-[-0.06em] sm:text-7xl lg:text-[6.2rem]">
                  <AnimatedNumber
                    final={stat.final}
                    suffix={stat.suffix}
                    start={statsVisible}
                  />
                </p>

                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL BLEED PORTRAIT / JOURNEY */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <img
          src="/counsellor/portrait-cinematic.png"
          alt="Ashok Kumar Yadav"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] grayscale"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] items-end px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16 xl:px-24">
          <div className="grid w-full gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/55">
                03 · The journey
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Five years of learning from the people behind the paperwork.
              </h2>
            </div>

            <div className="max-w-xl lg:justify-self-end">
              <div className="border-l border-white/30 pl-6">
                <p className="text-lg leading-8 text-white/85">
                  Over the years, one lesson has remained consistent: no two
                  students arrive with exactly the same story.
                </p>

                <p className="mt-6 text-sm leading-6 text-white/60">
                  Effective counselling is not simply about presenting a list
                  of universities. It is about asking the right questions,
                  understanding the student's goals and helping them make
                  choices they can genuinely understand and explain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-[#e8e3d9]">
        <div className="mx-auto max-w-[1700px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/45">
                04 · The approach
              </p>

              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Four steps.
                <br />
                One purpose.
              </h2>

              <p className="mt-7 max-w-sm text-sm leading-6 text-black/50">
                Helping students move from uncertainty to a study plan they
                understand.
              </p>
            </div>

            <div className="divide-y divide-black/10 border-y border-black/10">
              {approach.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-4 py-8 sm:grid-cols-[70px_190px_1fr] sm:items-start lg:py-10"
                >
                  <span className="text-[9px] font-semibold tracking-[0.22em] text-black/35">
                    {item.number}
                  </span>

                  <h3 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="max-w-xl text-sm leading-6 text-black/55">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FULL BLEED LIFESTYLE */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <img
          src="/counsellor/lifestyle-cinematic.png"
          alt="Ashok Kumar Yadav in London"
          className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] items-end px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/60">
              05 · Beyond the desk
            </p>

            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[7rem]">
              Guidance should
              <br />
              feel human.
            </h2>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/25 pt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60">
              <span>Real people</span>
              <span>Real conversations</span>
              <span>Real opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-[#f5f2eb]">
        <div className="mx-auto max-w-[1700px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40 xl:px-24">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/45">
            06 · My vision
          </p>

          <blockquote className="mt-10 max-w-7xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[3.8rem]">
            “My vision is to make UK education guidance more personal,
            informed and purposeful — helping every student understand not
            only where they can study, but why that choice matters to their
            future.”
          </blockquote>

          <div className="mt-14 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
                Continuous learning
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">
                Ongoing professional development across UK education,
                counselling, admissions and international student recruitment.
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
                Professional credentials
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">
                MBA · ICEF Certified Agent · British Council Certified Agent
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">
                The principle
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">
                Better preparation begins with better understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT STORIES */}
      <section className="bg-[#171a1e] text-white">
        <div className="mx-auto max-w-[1700px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
                07 · Student stories
              </p>

              <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Every number represents a person.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">
                Verified student journeys can be featured here — their goals,
                decisions, preparation and outcomes.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group min-h-[230px] border border-white/10 p-6 transition duration-500 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-semibold tracking-[0.22em] text-white/30">
                      0{item}
                    </span>

                    <span className="text-xl text-white/20 transition group-hover:translate-x-1 group-hover:text-white/60">
                      ↗
                    </span>
                  </div>

                  <div className="mt-24">
                    <p className="text-lg font-medium">Student story</p>
                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Verified story to be added.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRE-CAS CTA */}
      <section className="relative overflow-hidden bg-[#f5f2eb]">
        <div className="mx-auto grid min-h-[72vh] max-w-[1700px] items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:py-32 xl:px-24">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/45">
              08 · Prepare before you progress
            </p>

            <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.91] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem]">
              Your journey should be something you can confidently explain.
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-md text-base leading-7 text-black/55">
              The Pre-CAS Interview Simulator gives students a chance to
              practise explaining their university, course, motivations and
              future plans before the real conversation.
            </p>

            <Link
              href="/interview/start"
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#243f9f] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1d3485]"
            >
              Start Pre-CAS Interview
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-[#111315] text-white">
        <div className="mx-auto min-h-[70vh] max-w-[1700px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
          <div className="flex min-h-[55vh] flex-col justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
                09 · Let's talk
              </p>

              <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[7rem]">
                Have a question
                <br />
                about your UK
                <br />
                study journey?
              </h2>
            </div>

            <div className="mt-14 flex flex-col justify-between gap-10 border-t border-white/10 pt-7 sm:flex-row sm:items-end">
              <div>
                <p className="text-xl font-medium">Ashok Kumar Yadav</p>
                <p className="mt-1 text-sm text-white/40">
                  UK Education Counsellor
                </p>
              </div>

              <div className="space-y-2 text-right text-sm text-white/60">
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
      <footer className="bg-[#0b0d0f] px-6 py-7 text-white/30 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-3 text-[8px] font-semibold uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between">
          <span>Pre-CAS Interview · Idyllic Education Consultants</span>

          <Link
            href="/interview/start"
            className="transition hover:text-white"
          >
            Back to Pre-CAS Interview
          </Link>
        </div>
      </footer>
    </main>
  );
}



