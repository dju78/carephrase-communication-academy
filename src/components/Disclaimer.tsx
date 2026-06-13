/**
 * Compliance disclaimer shown on every feedback screen.
 * Required by the brief: the platform is a training tool only.
 */
export default function Disclaimer() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Training tool only.</strong> CarePhrase provides communication
      practice and feedback for professional development. It does not give
      clinical advice, replace professional judgement, or create official care
      records, and it is not a medical device. Always follow your
      organisation&rsquo;s policies and escalate real concerns through proper
      channels.
    </div>
  );
}
