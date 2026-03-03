import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviation Disclaimer",
  description: "Important aviation safety disclaimer for I Want To Be A Pilot.",
  robots: { index: false, follow: false },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Aviation Disclaimer</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 mb-8">
        <p className="text-sm font-semibold text-amber-400 mb-1">Educational Use Only</p>
        <p className="text-sm text-muted-foreground">
          I Want To Be A Pilot is an educational resource only. Nothing on this site constitutes official FAA guidance, professional flight instruction, legal advice, or medical advice. Aviation is a safety-critical activity — always consult qualified professionals.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="font-semibold text-base mb-3">Not Official FAA Guidance</h2>
          <p className="text-muted-foreground">
            All cost estimates, time estimates, training requirements, career path information, and regulatory summaries presented on this site are approximations based on publicly available data and community reports. They may not reflect current FAA regulations, your specific aircraft type, individual school pricing, local conditions, or your personal circumstances.
          </p>
          <p className="text-muted-foreground mt-2">
            Always refer to official FAA publications — including the Aeronautical Information Manual (AIM), Federal Aviation Regulations (14 CFR), Airman Certification Standards (ACS), and applicable Advisory Circulars — for authoritative guidance. When in doubt, consult your Certificated Flight Instructor (CFI) or a Designated Pilot Examiner (DPE).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Cost and Timeline Estimates</h2>
          <p className="text-muted-foreground">
            Pilot training costs and timelines vary widely based on location, aircraft type and rental rates, instructor experience and hourly rates, student aptitude and scheduling frequency, weather, aircraft availability, and many other factors. The estimates on this site represent national averages and are intended for rough planning purposes only.
          </p>
          <p className="text-muted-foreground mt-2">
            Always obtain current quotes directly from accredited flight schools before making financial decisions. The FAA minimum hour requirements are floors, not ceilings — most students require more hours than the regulatory minimum.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">DPE and Flight School Information</h2>
          <p className="text-muted-foreground">
            DPE and flight school information on this site is sourced from publicly available FAA records, user submissions, and third-party databases. Examiner authorization levels, availability, geographic service areas, pricing, and contact information change frequently and may be outdated.
          </p>
          <p className="text-muted-foreground mt-2">
            Always verify a DPE&apos;s current authorization directly with the FAA or your local FSDO before scheduling a checkride. Always verify flight school information — including Part 141 certification status, aircraft availability, and pricing — directly with the school.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Pass Rate Data</h2>
          <p className="text-muted-foreground">
            Checkride pass rate statistics displayed on this site are aggregate data derived from FAA Civil Airmen Statistics records and are provided for general informational purposes only. Pass rates reflect historical outcomes across all applicants and do not predict your individual performance on any practical test. A DPE with a high pass rate is not a guarantee of passing; a DPE with a lower pass rate is not a reason to avoid them.
          </p>
          <p className="text-muted-foreground mt-2">
            The most important factor in passing your checkride is thorough preparation with a qualified CFI.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Medical Certificate Requirements</h2>
          <p className="text-muted-foreground">
            Aviation medical certification requirements are complex and vary by certificate type, the class of medical certificate sought, your medical history, medications, and other factors. The information on this site about medical requirements is a general overview only.
          </p>
          <p className="text-muted-foreground mt-2">
            Consult an FAA Aviation Medical Examiner (AME) directly — before investing significant time or money in flight training — to determine your eligibility for the appropriate class of medical certificate. The FAA&apos;s MedXPress system and BasicMed program have specific requirements; an AME can advise you on your particular situation.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Community Content</h2>
          <p className="text-muted-foreground">
            Pilot stories, discussion posts, school reviews, DPE reviews, and equipment ratings are submitted by community members and represent their personal experiences and opinions only. We do not verify the accuracy of user-submitted content. Individual training experiences, costs, and outcomes vary significantly.
          </p>
          <p className="text-muted-foreground mt-2">
            Reviews and ratings of flight schools and DPEs are opinions of individual users and do not constitute endorsements or recommendations by I Want To Be A Pilot.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Equipment Recommendations</h2>
          <p className="text-muted-foreground">
            Equipment listed on this site is provided for general reference. Product specifications, prices, availability, and FAA approval status change over time. Always verify that any avionics, headsets, or other equipment meets current FAA requirements for your intended use before purchasing. Some links are affiliate links — see our Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Salary and Career Information</h2>
          <p className="text-muted-foreground">
            Salary ranges shown on this site are based on publicly available industry data and community reports. Actual compensation varies by employer, geographic location, seniority, union contract, aircraft type, and current market conditions. Career outcomes are not guaranteed.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">No Liability</h2>
          <p className="text-muted-foreground">
            We make no representations or warranties about the accuracy, completeness, or currentness of any information on this site. We are not responsible for any decisions you make — including financial, career, training, or flight-related decisions — based on information obtained from this site. See our Terms of Service for full limitation of liability provisions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Questions</h2>
          <p className="text-muted-foreground">
            Questions about this disclaimer? Contact us at{" "}
            <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">
              support@iwanttobeapilot.online
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
