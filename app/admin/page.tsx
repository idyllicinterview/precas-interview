import { get, list } from "@vercel/blob";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAdminSessionCookieName,
  verifyAdminSession,
} from "@/app/lib/adminAuth";
import LogoutButton from "./components/LogoutButton";

type Interview = {
  interviewId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  intake: string;
  startedAt: string;
  totalVideos: number;
  blobPaths: string[];
  createdAt: string;
};

async function getInterviews(): Promise<Interview[]> {
  const result = await list({
    prefix: "interviews/",
  });

  const manifestBlobs = result.blobs.filter(
    (blob) =>
      blob.pathname.startsWith("interviews/") &&
      blob.pathname.endsWith("/manifest.json")
  );

  const interviews: Interview[] = [];

  for (const blob of manifestBlobs) {
    try {
      const stored = await get(blob.pathname, {
        access: "private",
      });

      if (!stored) {
        continue;
      }

      const text = await new Response(stored.stream).text();

      const manifest = JSON.parse(text) as Partial<Interview>;

      if (
        typeof manifest.interviewId !== "string" ||
        typeof manifest.fullName !== "string" ||
        typeof manifest.email !== "string" ||
        typeof manifest.phone !== "string" ||
        typeof manifest.university !== "string" ||
        typeof manifest.course !== "string" ||
        typeof manifest.intake !== "string" ||
        typeof manifest.startedAt !== "string" ||
        !Array.isArray(manifest.blobPaths)
      ) {
        continue;
      }

      interviews.push({
        interviewId: manifest.interviewId,
        fullName: manifest.fullName,
        email: manifest.email,
        phone: manifest.phone,
        university: manifest.university,
        course: manifest.course,
        intake: manifest.intake,
        startedAt: manifest.startedAt,
        totalVideos: manifest.blobPaths.length,
        blobPaths: manifest.blobPaths,
        createdAt:
          typeof manifest.createdAt === "string"
            ? manifest.createdAt
            : blob.uploadedAt.toISOString(),
      });
    } catch (error) {
      console.error(
        `Unable to read interview manifest ${blob.pathname}:`,
        error
      );
    }
  }

  interviews.sort(
    (a, b) =>
      new Date(b.startedAt).getTime() -
      new Date(a.startedAt).getTime()
  );

  return interviews;
}

function formatInterviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminPage() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  const session = verifyAdminSession(sessionToken);

  if (!session) {
    redirect("/admin/login");
  }

  const interviews = await getInterviews();

  const totalVideos = interviews.reduce(
    (total, interview) => total + interview.totalVideos,
    0
  );

  return (
    <main className="min-h-screen bg-[#071525] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <header className="group mb-6 rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.14]">
          <div className="flex flex-col gap-5 px-5 py-4 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] shadow-lg">
                <img
                  src="/admin/vertical-logo.jpg"
                  alt="Idyllic Education"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200/65 sm:text-[11px]">
                  Idyllic Education
                </p>

                <h1 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
                  Pre-CAS Mock Interview
                </h1>

                <p className="mt-0.5 text-xs text-slate-400">
                  Secure administration portal
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Administrator
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {session.username}
                </p>
              </div>

              <div className="hidden h-9 w-px bg-white/10 md:block" />

              <div className="flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-2 text-xs font-medium text-emerald-200 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.7)]" />
                Secure session
              </div>

              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Dashboard introduction */}
        <section className="relative mb-7 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.045] to-white/[0.025] shadow-2xl backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[58%] opacity-[0.16]"
            style={{
              backgroundImage: "url('/admin/super-admin-background.png')",
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#101e2e] via-[#101e2e]/95 via-[55%] to-[#101e2e]/35" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#071525]/10 via-transparent to-[#071525]/25" />

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-20 h-48 w-48 rounded-full bg-amber-200/5 blur-3xl" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                Secure Administration
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Master Dashboard
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage completed Pre-CAS mock interviews, review applicant
                records, and access securely stored interview recordings.
              </p>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {/* Total Interviews */}
          <div className="group relative overflow-hidden rounded-2xl border border-sky-300/10 bg-gradient-to-br from-sky-300/[0.09] via-white/[0.055] to-white/[0.035] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-300/[0.11] hover:shadow-2xl">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-300/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100/55">
                  Total Interviews
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {interviews.length}
                </p>

                <p className="mt-1.5 text-sm text-slate-400">
                  Completed records
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-200/15 bg-sky-200/10 text-sky-100 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 8a4 4 0 0 0-3-3.87M16 5.13a3 3 0 0 1 0 5.74"
                  />
                </svg>
              </div>
            </div>

            <div className="relative mt-5 h-px w-full bg-gradient-to-r from-sky-200/20 via-sky-200/5 to-transparent" />
          </div>

          {/* Videos Available */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-200/10 bg-gradient-to-br from-amber-200/[0.08] via-white/[0.055] to-white/[0.035] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/20 hover:bg-amber-200/[0.1] hover:shadow-2xl">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100/55">
                  Videos Available
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {totalVideos}
                </p>

                <p className="mt-1.5 text-sm text-slate-400">
                  Securely stored recordings
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-200/10 text-amber-100 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15 10-4-2.5v9L15 14m4 3.5A2.5 2.5 0 0 0 21.5 15V9A2.5 2.5 0 0 0 19 6.5H5A2.5 2.5 0 0 0 2.5 9v6A2.5 2.5 0 0 0 5 17.5h14Z"
                  />
                </svg>
              </div>
            </div>

            <div className="relative mt-5 h-px w-full bg-gradient-to-r from-amber-200/20 via-amber-200/5 to-transparent" />
          </div>

          {/* System Status */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-300/10 bg-gradient-to-br from-emerald-300/[0.08] via-white/[0.055] to-white/[0.035] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.1] hover:shadow-2xl">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-300/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/55">
                  System Status
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-200">
                  Operational
                </p>

                <p className="mt-1.5 text-sm text-slate-400">
                  Administration portal active
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-200 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]" />
              </div>
            </div>

            <div className="relative mt-5 h-px w-full bg-gradient-to-r from-emerald-300/20 via-emerald-300/5 to-transparent" />
          </div>
        </section>

        {/* Applicants section */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200/60">
                  Interview Records
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Applicants
                </h3>

                <p className="mt-1.5 text-sm text-slate-400">
                  Completed interview records received by the system.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_7px_rgba(125,211,252,0.55)]" />
                {interviews.length}{" "}
                {interviews.length === 1 ? "interview" : "interviews"}
              </div>
            </div>
          </div>

          {interviews.length === 0 ? (
            <div className="p-12 text-center sm:p-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h6m7 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  />
                </svg>
              </div>

              <p className="mt-5 text-base font-medium text-slate-300">
                No interview records found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Completed interviews will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile table hint */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/10 px-5 py-3 text-xs text-slate-500 sm:hidden">
                <span>Swipe horizontally to view all columns</span>

                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 text-slate-600"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h14m-4-4 4 4-4 4"
                  />
                </svg>
              </div>

              <div className="relative overflow-x-auto overscroll-x-contain">
                <table className="w-full min-w-[1120px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#06111f]/95">
                      <th className="sticky left-0 z-30 whitespace-nowrap border-r border-white/[0.06] bg-[#06111f]/98 px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[8px_0_18px_-16px_rgba(0,0,0,0.9)]">
                        Applicant
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Mobile
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        University
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Course
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Intake
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Interview
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Videos
                      </th>

                      <th className="sticky right-0 z-30 whitespace-nowrap border-l border-white/[0.06] bg-[#06111f]/98 px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[-8px_0_18px_-16px_rgba(0,0,0,0.9)]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.065]">
                    {interviews.map((interview) => (
                      <tr
                        key={interview.interviewId}
                        className="group transition-colors duration-200 hover:bg-sky-200/[0.025]"
                      >
                        <td className="sticky left-0 z-20 border-r border-white/[0.06] bg-[#0b1a2b] px-6 py-5 shadow-[8px_0_18px_-16px_rgba(0,0,0,0.9)] transition-colors duration-200 group-hover:bg-[#102235]">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-gradient-to-br from-sky-300/15 to-blue-500/10 text-sm font-semibold text-sky-100 shadow-sm transition-transform duration-200 group-hover:scale-105">
                              {interview.fullName
                                .trim()
                                .charAt(0)
                                .toUpperCase() || "A"}
                            </div>

                            <div className="min-w-0">
                              <div className="font-semibold tracking-tight text-white">
                                {interview.fullName}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {interview.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-300">
                          {interview.phone || "—"}
                        </td>

                        <td className="max-w-[190px] px-5 py-5 text-sm text-slate-300">
                          <div
                            className="truncate"
                            title={interview.university}
                          >
                            {interview.university || "—"}
                          </div>
                        </td>

                        <td className="max-w-[190px] px-5 py-5 text-sm text-slate-300">
                          <div
                            className="truncate"
                            title={interview.course}
                          >
                            {interview.course || "—"}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="text-sm text-slate-300">
                            {interview.intake || "—"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-slate-400">
                              <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className="h-4 w-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 5v5l3 2m4-2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                />
                              </svg>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-slate-300">
                                {formatInterviewDate(
                                  interview.startedAt
                                )}
                              </div>

                              <div className="mt-0.5 text-[11px] text-slate-600">
                                Started
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5">
                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="h-3.5 w-3.5 text-slate-500"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m12.5 8.5-5-2.75v9.5l5-2.75m4 3A2.5 2.5 0 0 0 19 13V7a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 3 7v6a2.5 2.5 0 0 0 2.5 2.5h11Z"
                              />
                            </svg>

                            <span className="text-sm font-semibold text-slate-200">
                              {interview.totalVideos}
                            </span>

                            <span className="text-[11px] text-slate-500">
                              videos
                            </span>
                          </div>
                        </td>

                        <td className="sticky right-0 z-20 border-l border-white/[0.06] bg-[#0b1a2b] px-6 py-5 text-right shadow-[-8px_0_18px_-16px_rgba(0,0,0,0.9)] transition-colors duration-200 group-hover:bg-[#102235]">
                          <a
                            href={`/admin/interviews/${interview.interviewId}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-sky-200/10 bg-gradient-to-r from-sky-200/[0.08] to-blue-400/[0.06] px-4 py-2.5 text-sm font-semibold text-sky-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200/25 hover:bg-sky-200/[0.13] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300/30"
                          >
                            View Details

                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="border-t border-white/10 px-6 py-4 sm:px-8">
            <p className="text-xs leading-5 text-slate-600">
              Interview recordings are securely stored and are accessible
              through authorized administration controls only.
            </p>
          </div>
        </section>

        <footer className="px-2 py-6 text-center text-xs text-slate-600">
          Pre-CAS Mock Interview • Idyllic Education
        </footer>
      </div>
    </main>
  );
}