"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-sm font-medium text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4 text-slate-500 transition-colors duration-200 group-hover:text-slate-300"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 3.5H5.5A2.5 2.5 0 0 0 3 6v8a2.5 2.5 0 0 0 2.5 2.5H8M12 6.5 15.5 10 12 13.5M8.5 10h7"
        />
      </svg>

      <span>{loggingOut ? "Signing out..." : "Logout"}</span>
    </button>
  );
}