"use client";

import Link from "next/link";
import { useI18n } from "@/lib/providers";

const MAIL = "mailto:contact@nbaparisevents.com?subject=R%C3%A9servation%20NBA%20Experiences%20%E2%80%94%20Paris%20Game%202027";

const BLOCS = [
  ["faq.s1", [["faq.q1", "faq.a1"], ["faq.q2", "faq.a2"], ["faq.q3", "faq.a3"], ["faq.q4", "faq.a4"], ["faq.q5", "faq.a5"]]],
  ["faq.s2", [["faq.q6", "faq.a6"], ["faq.q7", "faq.a7"], ["faq.q8", "faq.a8"], ["faq.q9", "faq.a9"], ["faq.q10", "faq.a10"], ["faq.q11", "faq.a11"], ["faq.q12", "faq.a12"], ["faq.q13", "faq.a13"]]],
  ["faq.s3", [["faq.q14", "faq.a14"], ["faq.q15", "faq.a15"], ["faq.q16", "faq.a16"], ["faq.q17", "faq.a17"]]],
  ["faq.s4", [["faq.q18", "faq.a18"]]]
];

export default function FaqPage() {
  const { t } = useI18n();
  return (
    <main className="faq-page">
      <div className="faq-wrap">
        <p className="faq-lead">{t("faq.lead")}</p>
        {BLOCS.map(([titre, questions]) => (
          <section key={titre}>
            <h2>{t(titre)}</h2>
            <div className="faq" onToggle={(e) => {
              const item = e.target;
              if (!item.open) return;
              item.parentElement.querySelectorAll("details").forEach((autre) => {
                if (autre !== item) autre.open = false;
              });
            }}>
              {questions.map(([q, a]) => (
                <details key={q}>
                  <summary>{t(q)}</summary>
                  <p>{t(a)}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <Link className="btn btn-light faq-cta" href="/billets">{t("faq.cta")}</Link>
      </div>
    </main>
  );
}
