import { pdfEbillet } from "@/lib/ebillet-pdf.mjs";
import { EXEMPLE_COMMANDE, preparer } from "@/lib/mails";

export const runtime = "nodejs";

export async function GET(req) {
  const langue = new URL(req.url).searchParams.get("langue") === "en" ? "en" : "fr";
  const bytes = await pdfEbillet(preparer({ ...EXEMPLE_COMMANDE, langue }));
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"billets-NBA-1842.pdf\""
    }
  });
}
