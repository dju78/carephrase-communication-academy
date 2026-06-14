import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Lead is stored in Supabase (pilot_access_requests). To also receive an
    // admin notification email, wire an email provider (e.g. Resend) here or
    // add a Supabase Database Webhook / Edge Function on insert.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Pilot request error:", err);
    return NextResponse.json(
      { error: "Could not submit your request." },
      { status: 500 }
    );
  }
}
