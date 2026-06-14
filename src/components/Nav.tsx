"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FEEDBACK_FORM_URL } from "@/lib/constants";

export default function Nav({ email }: { email?: string | null }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="CarePhrase Communication Academy" className="h-9 w-auto" />
          <span className="hidden text-sm font-semibold leading-tight text-slate-800 sm:inline sm:text-base">
            CarePhrase Communication Academy
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-slate-900"
          >
            Dashboard
          </Link>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900"
          >
            💬 Feedback
          </a>
          {email && (
            <span className="hidden text-slate-400 sm:inline">{email}</span>
          )}
          <button
            onClick={signOut}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
