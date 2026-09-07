import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAdminSessionCookieName,
  verifyAdminSession,
} from "@/app/lib/adminAuth";

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
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    getAdminSessionCookieName()
  )?.value;

  const session = verifyAdminSession(sessionToken);

  if (!session) {
    redirect("/admin/login");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const host =
    process.env.VERCEL_URL ??
    "localhost:3000";

  const response = await fetch(
    `${protocol}://${host}/api/admin/interviews`,
    {
      cache: "no-store",
      headers: {
        Cookie: `${getAdminSessionCookieName()}=${sessionToken}`,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return Array.isArray(data?.interviews)
    ? data.interviews
    : [];
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Secure Administration
              </p>

              <h1 className="mt-1 text-3xl font-semibold">
                Master Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Signed in as {session.username}
              </p>
            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Admin session active
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Applicants
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Interview records received by the system.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
                {interviews.length}{" "}
                {interviews.length === 1
                  ? "interview"
                  : "interviews"}
              </div>
            </div>

            {interviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
                <p className="text-base font-medium text-slate-300">
                  No interview records found.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Completed interviews will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Applicant
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Mobile
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          University
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Course
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Intake
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Interview Date & Time
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Videos
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {interviews.map((interview) => (
                        <tr
                          key={interview.interviewId}
                          className="transition hover:bg-white/[0.03]"
                        >
                          <td className="whitespace-nowrap px-5 py-5">
                            <div className="font-medium text-white">
                              {interview.fullName}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                              {interview.email}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-300">
                            {interview.phone || "—"}
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-300">
                            {interview.university || "—"}
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-300">
                            {interview.course || "—"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-300">
                            {interview.intake || "—"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-300">
                            {formatInterviewDate(
                              interview.startedAt
                            )}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-300">
                            {interview.totalVideos}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-right">
                            <a
                              href={`/admin/interviews/${interview.interviewId}`}
                              className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}