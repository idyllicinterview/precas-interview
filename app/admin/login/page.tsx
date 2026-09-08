"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Unable to log in."
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/admin/super-admin-background.png')",
        }}
      />

      <div className="absolute inset-0 bg-white/[0.015]" />

      <div className="relative min-h-screen">
        {/* Official logo */}
        <div className="absolute left-7 top-7 sm:left-10 sm:top-9 md:left-14 md:top-11 lg:left-16 lg:top-12">
          <img
            src="/admin/idyllic-education-logo.png"
            alt="Idyllic Education Consultants"
            className="h-auto w-[190px] object-contain object-left sm:w-[235px] md:w-[275px] lg:w-[300px]"
          />
        </div>

        {/* Branding and login */}
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 px-7 sm:px-10 md:px-14 lg:px-16">
          <div className="w-full max-w-[520px]">
            <h1
              className="
                max-w-[500px]
                font-serif
                text-[2.35rem]
                font-normal
                leading-[1.02]
                tracking-[-0.025em]
                text-slate-900
                drop-shadow-[0_2px_8px_rgba(255,255,255,0.38)]
                sm:text-[2.8rem]
                md:text-[3.2rem]
                lg:text-[3.55rem]
              "
            >
              Pre-CAS
              <br />
              Mock Interview
            </h1>

            <p
              className="
                mt-5
                text-[0.7rem]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-slate-800
                drop-shadow-[0_1px_5px_rgba(255,255,255,0.35)]
                sm:text-xs
              "
            >
              SECURE ADMIN PORTAL
            </p>

            {/* Invisible login interaction area */}
            <div
              className="relative mt-3 w-full max-w-[405px] py-5"
              onMouseEnter={() => setLoginVisible(true)}
              onMouseLeave={() => setLoginVisible(false)}
              onFocus={() => setLoginVisible(true)}
            >
              <div
                className={`
                  transition-all
                  duration-500
                  ease-out
                  ${
                    loginVisible
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }
                `}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="sr-only"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                      disabled={loading}
                      required
                      className="
                        w-full
                        border-0
                        border-b
                        border-slate-700/45
                        bg-transparent
                        px-1
                        py-3
                        text-[15px]
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-600/75
                        focus:border-slate-900
                        focus:ring-0
                        disabled:opacity-60
                      "
                      placeholder="Username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="sr-only"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={loading}
                      required
                      className="
                        w-full
                        border-0
                        border-b
                        border-slate-700/45
                        bg-transparent
                        px-1
                        py-3
                        text-[15px]
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-600/75
                        focus:border-slate-900
                        focus:ring-0
                        disabled:opacity-60
                      "
                      placeholder="Password"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="
                        border-l
                        border-red-700/60
                        bg-white/25
                        px-3
                        py-2
                        text-sm
                        text-red-800
                        backdrop-blur-sm
                      "
                    >
                      {error}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        inline-flex
                        items-center
                        border-b
                        border-slate-800/70
                        px-1
                        pb-1
                        text-sm
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-slate-900
                        transition
                        hover:border-slate-950
                        hover:text-slate-950
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      <span>
                        {loading ? "Signing In..." : "Sign In"}
                      </span>

                      {!loading && (
                        <span
                          aria-hidden="true"
                          className="ml-2 transition-transform duration-300"
                        >
                          →
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}