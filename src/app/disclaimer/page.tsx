import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviation Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Aviation Disclaimer</h1>
      <p className="text-sm text-muted-foreground mb-8">Important — please read before using this site</p>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 mb-8">
        <p className="text-sm font-medium text-amber-400 mb-1">Educational Use Only</p>
        <p className="text-sm text-muted-foreground">
          I Want To Be A Pilot is an educational resource only. Nothing on this site constitutes official FAA guidance, flight instruction, or legal aviation advice.
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold mb-2">Not Official FAA Guidance</h2>
          <p className="text-muted-foreground">
            All cost estimates, time estimates, training requirements, and career path information presented on this site are approximations based on publicly available data and community reports. They may not reflect current FAA regulations, individual school pricing, or your personal circumstances.
          </p>
          <p className="text-muted-foreground mt-2">
            Always refer to official FAA publications including the Aeronautical Information Manual (AIM), Federal Aviation Regulations (FARs), and guidance from your Certificated Flight Instructor (CFI) for authoritative information.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">DPE and School Information</h2>
          <p className="text-muted-foreground">
            DPE and flight school information on this site is sourced from publicly available FAA records and user submissions. Availability, pricing, and contact information change frequently. Always verify directly with the DPE or school before scheduling.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Pass Rate Data</h2>
          <p className="text-muted-foreground">
            Pass rate statistics are aggregate data from FAA records and are provided for general informational purposes. They do not predict your individual performance on any checkride.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Community Content</h2>
          <p className="text-muted-foreground">
            Stories and discussions are submitted by community members and represent their personal experiences only. Individual results vary significantly based on aptitude, school quality, weather, financial circumstances, and many other factors.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">No Responsibility for Outcomes</h2>
          <p className="text-muted-foreground">
            We make no representations about the accuracy or completeness of information on this site. We are not responsible for any decisions you make based on this information, including financial, career, or flight-related decisions.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Medical and Safety Information</h2>
          <p className="text-muted-foreground">
            Aviation medical requirements are complex and vary by certificate type. Consult an FAA Aviation Medical Examiner (AME) directly to determine your eligibility for a medical certificate before investing in flight training.
          </p>
        </section>
      </div>
    </div>
  );
}
