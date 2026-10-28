"use client";

import { useI18n } from "@/lib/providers";

export default function MentionsPage() {
  const { t } = useI18n();
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <p className="crumbs">{t("legal.crumb")}</p>
          <h1>{t("legal.h1")}</h1>
        </div>
      </header>
      <main className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p>{t("legal.p1")}</p>
          <p>{t("legal.p2")}</p>
          <p>{t("legal.p3")}</p>
          <p>{t("legal.p4")}</p>
          <p className="muted">{t("legal.p5")}</p>
          <p className="muted">{t("legal.p6")}</p>
        </div>
      </main>
    </>
  );
}
