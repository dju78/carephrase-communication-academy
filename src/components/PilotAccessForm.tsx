"use client";

import { useState } from "react";

const ORGANISATION_TYPES = [
  "Care Home",
  "Supported Living",
  "Home Care",
  "NHS / Healthcare",
  "Training Provider",
  "Local Authority",
  "Charity",
  "Other",
];

const STAFF_COUNTS = ["1–10", "11–25", "26–50", "51–100", "101–250", "251+"];

const ACADEMIES = [
  "Handover Communication Academy",
  "Escalation Skills Academy",
  "Safeguarding Communication Academy",
  "Care English Academy",
  "All Academies",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function PilotAccessForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("submitting");

    const payload = {
      fullName: fd.get("fullName"),
      jobTitle: fd.get("jobTitle"),
      organisationName: fd.get("organisationName"),
      workEmail: fd.get("workEmail"),
      phoneNumber: fd.get("phoneNumber"),
      organisationType: fd.get("organisationType"),
      staffCount: fd.get("staffCount"),
      academyInterest: fd.get("academyInterest"),
      additionalInformation: fd.get("additionalInformation"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900"
      >
        <h3 className="text-lg font-semibold">
          Thank you for your interest in CarePhrase.
        </h3>
        <p className="mt-1">
          Your pilot enquiry has been received and we will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from users and assistive tech; bots tend to fill it. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" autoComplete="name" required />
        <Field
          label="Job title"
          name="jobTitle"
          autoComplete="organization-title"
          required
        />
        <Field
          label="Organisation name"
          name="organisationName"
          autoComplete="organization"
          required
        />
        <Field
          label="Work email"
          name="workEmail"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Phone number"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
        />
        <SelectField
          label="Organisation type"
          name="organisationType"
          options={ORGANISATION_TYPES}
          required
        />
        <SelectField
          label="Number of staff"
          name="staffCount"
          options={STAFF_COUNTS}
          required
        />
        <SelectField
          label="Academy of interest"
          name="academyInterest"
          options={ACADEMIES}
          required
        />
      </div>

      <TextAreaField
        label="Additional information"
        name="additionalInformation"
      />

      <div className="flex items-start gap-2">
        <input
          id="consent"
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <label htmlFor="consent" className="text-sm text-slate-600">
          I consent to being contacted regarding CarePhrase pilot access. My
          information will only be used for this enquiry and handled in
          accordance with applicable data protection requirements.{" "}
          <span className="text-rose-600">*</span>
        </label>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          We were unable to submit your request. Please try again or contact us
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Request Pilot Access"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      >
        <option value="" disabled>
          Please select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
