"use client";

import { useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "recorded";

export default function VoiceRecorder({
  onSubmit,
  isProcessing,
}: {
  onSubmit: (audio: Blob) => void;
  isProcessing: boolean;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        blobRef.current = blob;
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setState("recorded");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError(
        "Microphone access was denied. Please allow microphone access and try again."
      );
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }

  function reset() {
    blobRef.current = null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    setState("idle");
  }

  function submit() {
    if (blobRef.current) onSubmit(blobRef.current);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && (
        <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        {state === "recording" && (
          <div className="flex items-center gap-2 text-rose-600">
            <span className="h-3 w-3 animate-pulse rounded-full bg-rose-600" />
            <span className="font-mono text-lg tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        )}

        {state === "idle" && (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50"
          >
            <MicIcon /> Start recording
          </button>
        )}

        {state === "recording" && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-medium text-white shadow hover:bg-rose-700"
          >
            <StopIcon /> Stop recording
          </button>
        )}

        {state === "recorded" && (
          <div className="flex w-full flex-col items-center gap-4">
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full max-w-sm" />
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={submit}
                disabled={isProcessing}
                className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50"
              >
                {isProcessing ? "Analysing…" : "Submit for feedback"}
              </button>
              <button
                onClick={reset}
                disabled={isProcessing}
                className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Re-record
              </button>
            </div>
          </div>
        )}

        {state === "idle" && (
          <p className="text-center text-sm text-slate-500">
            Read the scenario above, then record your spoken response. You can
            re-record before submitting.
          </p>
        )}
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
