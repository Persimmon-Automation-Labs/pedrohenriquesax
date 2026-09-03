import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { Events } from "@/components/home/Events";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Eventos",
  description: "Contratação de saxofonista para casamento, evento corporativo, recepção, live sax e show autoral em São Paulo. Sete formatos, do solo ao quinteto.",
};

export default async function Eventos() {
  const s = await getSettings();
  return <Chrome><Events imageUrl={s.eventsImageUrl} text={s.eventsText} level="h1" /></Chrome>;
}
