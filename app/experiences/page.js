"use client";

import Link from "next/link";
import { useI18n } from "@/lib/providers";

const MAIL = "mailto:mail@nbaeventsparis.com?subject=R%C3%A9servation%20NBA%20Experiences%20%E2%80%94%20Paris%20Game%202027";

export default function ExperiencesPage() {
  const { t } = useI18n();
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <p className="crumbs">{t("xp.crumb")}</p>
          <h1>{t("xp.h1")}</h1>
          <p className="sub">{t("xp.sub")}</p>
          <p className="sub">{t("xp.more")}</p>
        </div>
      </header>
      <main className="section" style={{ paddingTop: "0.4rem" }}>
        <div className="wrap grid">
          <article className="card">
            <span className="tag">{t("xp.t1")}</span>
            <h3>{t("xp.h3a")}</h3>
            <p>{t("xp.p1")}</p>
            <a className="btn btn-light" href={MAIL}>{t("xp.a1")}</a>
          </article>
          <article className="card">
            <span className="tag">{t("xp.t2")}</span>
            <h3>{t("xp.h3b")}</h3>
            <p>{t("xp.p2")}</p>
            <a className="btn btn-light" href={MAIL}>{t("xp.a2")}</a>
          </article>
          <article className="card">
            <span className="tag">{t("xp.t3")}</span>
            <h3>{t("xp.h3c")}</h3>
            <p>{t("xp.p3")}</p>
            <Link className="btn btn-light" href="/paris-game">{t("xp.a3")}</Link>
          </article>
        </div>
      </main>
    </>
  );
}
