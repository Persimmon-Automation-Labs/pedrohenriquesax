import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { Mentoria } from "@/components/home/Mentoria";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mentoria online",
  description: "Mentoria individual de saxofone, online, 1h15. De sonoridade a improvisação, com Pedro Lucena.",
};

export default async function MentoriaPage() {
  const s = await getSettings();
  return <Chrome><Mentoria duration={s.mentoriaDuration} price={s.mentoriaPrice} text={s.mentoriaText} level="h1" /></Chrome>;
}
