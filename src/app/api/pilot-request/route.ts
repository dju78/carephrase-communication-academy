import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Lead {
  fullName: string;
  jobTitle: string;
  organisationName: string;
  workEmail: string;
  phoneNumber: string;
  organisationType: string;
  staffCount: string;
  academyInterest: string;
  additionalInformation: string;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the "New CarePhrase Pilot Access Request" email via Resend.
 * No-ops if RESEND_API_KEY is not configured. From/To are env-configurable so
 * the sender can switch to a verified domain address without a code change.
 */
async function notifyAdmin(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return; // not configured — skip silently

  const to = process.env.PILOT_NOTIFY_TO || "dju78@omoyelejd.co.uk";
  // Until the sending domain is verified in Resend, fall back to Resend's
  // shared test sender. Set PILOT_NOTIFY_FROM to e.g.
  // "CarePhrase <noreply@carephrase.com>" after DNS verification.
  const from = process.env.PILOT_NOTIFY_FROM || "CarePhrase <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Organisation", lead.organisationName],
    ["Job title", lead.jobTitle],
    ["Email", lead.workEmail],
    ["Phone", lead.phoneNumber || "—"],
    ["Organisation type", lead.organisationType],
    ["Staff count", lead.staffCount],
    ["Academy interest", lead.academyInterest],
    ["Additional information", lead.additionalInformation || "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2>New CarePhrase Pilot Access Request</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="color:#475569"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`
  )
  .join("\n")}
</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.workEmail, // replying goes straight to the enquirer
      subject: "New CarePhrase Pilot Access Request",
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see/fill this. If a bot fills it, pretend
  // success (so it doesn't retry) but store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const fullName = str(body.fullName);
  const jobTitle = str(body.jobTitle);
  const organisationName = str(body.organisationName);
  const workEmail = str(body.workEmail);
  const organisationType = str(body.organisationType);
  const staffCount = str(body.staffCount);
  const academyInterest = str(body.academyInterest);
  const phoneNumber = str(body.phoneNumber);
  const additionalInformation = str(body.additionalInformation);
  const consent = body.consent === true;

  if (
    !fullName ||
    !jobTitle ||
    !organisationName ||
    !workEmail ||
    !organisationType ||
    !staffCount ||
    !academyInterest
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(workEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid work email address." },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Consent is required to submit this request." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("pilot_access_requests").insert({
      full_name: fullName,
      job_title: jobTitle,
      organisation_name: organisationName,
      work_email: workEmail,
      phone_number: phoneNumber || null,
      organisation_type: organisationType,
      staff_count: staffCount,
      academy_interest: academyInterest,
      additional_information: additionalInformation || null,
      consent: true,
    });

    if (error) {
      console.error("Pilot request insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not submit your request." },
        { status: 500 }
      );
    }

    // Best-effort admin notification — the lead is already saved, so an email
    // failure (or missing config) must never fail the request.
    try {
      await notifyAdmin({
        fullName,
        jobTitle,
        organisationName,
        workEmail,
        phoneNumber,
        organisationType,
        staffCount,
        academyInterest,
        additionalInformation,
      });
    } catch (notifyErr) {
      console.error("Admin notification failed:", notifyErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Pilot request error:", err);
    return NextResponse.json(
      { error: "Could not submit your request." },
      { status: 500 }
    );
  }
}
