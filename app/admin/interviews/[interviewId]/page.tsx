"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ApplicantDetailsPage() {
  const params = useParams();
  const interviewId = String(params.interviewId);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInterview() {
      try {
        const response = await fetch("/api/admin/interviews", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? "Unable to load interview."
          );
        }

        const found = data.interviews?.find(
          (item: Interview) =>
            item.interviewId === interviewId
        );

        if (!found) {
          throw new Error("Interview not found.");
        }

        setInterview(found);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load interview."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInterview();
  }, [interviewId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">
            Loading applicant...
          </p>
        </div>
      </main>
    );
  }

  if (error || !interview) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <a
            href="/admin"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Dashboard
          </a>

          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <h1 className="text-lg font-semibold">
              Unable to load applicant
            </h1>

            <p className="mt-2 text-sm text-red-200">
              {error || "Interview not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/admin"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Applicant Details
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              {interview.fullName}
            </h1>

            <p className="mt-2 text-slate-400">
              {interview.email}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Phone
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {interview.phone || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                University
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {interview.university || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Course
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {interview.course || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Intake
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {interview.intake || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Interview Date & Time
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {new Date(
                  interview.startedAt
                ).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Recorded Videos
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {interview.totalVideos} of 16
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Interview Recordings
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {interview.totalVideos} recording
                  {interview.totalVideos === 1 ? "" : "s"}{" "}
                  available for this interview.
                </p>
              </div>

              <a
                href={`/api/admin/interviews/${encodeURIComponent(
                  interview.interviewId
                )}/download-all`}
                className="inline-flex items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/20 hover:text-emerald-200"
              >
                Download All Available Videos
              </a>
            </div>

            <div className="mt-6 space-y-3">
              {interview.blobPaths.map((path) => (
                <div
                  key={path}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <p className="text-sm text-slate-300">
                    {path.split("/").pop()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}