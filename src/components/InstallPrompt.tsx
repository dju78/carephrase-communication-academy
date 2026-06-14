"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "carephrase-install-dismissed";

type Variant = "hidden" | "android" | "ios" | "generic";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [variant, setVariant] = useState<Variant>("hidden");

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };

    // Already installed / running standalone — never show the prompt.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;
    if (isStandalone) return;

    // Respect a previous "Not now".
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const ua = nav.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);

    if (isIOS) {
      setVariant("ios");
      return;
    }

    // Non-iOS: show a generic help card until/unless the browser offers a
    // native install prompt, at which point we upgrade to the Install button.
    setVariant("generic");

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVariant("android");
    };
    const onInstalled = () => setVariant("hidden");

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage failures
    }
    setVariant("hidden");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      // ignore
    }
    setDeferred(null);
    setVariant("hidden");
  }

  if (variant === "hidden") return null;

  return (
    <section className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
      <h2 className="font-semibold text-brand-900">Install CarePhrase Comms</h2>

      {variant === "ios" ? (
        <div className="mt-1 text-sm text-brand-900">
          <p>Add the app to your iPhone or iPad:</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5">
            <li>
              Open this site in <strong>Safari</strong>.
            </li>
            <li>
              Tap the <strong>Share</strong> button.
            </li>
            <li>
              Choose <strong>Add to Home Screen</strong>.
            </li>
          </ol>
        </div>
      ) : (
        <p className="mt-1 text-sm text-brand-900">
          Add the app to your phone for quick access.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {variant === "android" && (
          <button
            onClick={install}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Install now
          </button>
        )}
        {variant === "generic" && (
          <Link
            href="/install"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            How to install
          </Link>
        )}
        {variant === "ios" && (
          <Link
            href="/install"
            className="rounded-full border border-brand-600 px-5 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
          >
            More help
          </Link>
        )}
        <button
          onClick={dismiss}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Not now
        </button>
      </div>
    </section>
  );
}
