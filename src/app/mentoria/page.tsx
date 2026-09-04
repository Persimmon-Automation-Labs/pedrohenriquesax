import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { Mentoria } from "@/components/home/Mentoria";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mentoria online",
  description: "Aula particular de saxofone, online, semanal, de 50 minutos a 1h15. Material de apoio e cronograma personalizado.",
};

export default async function MentoriaPage() {
  const s = await getSettings();

  return (
    <Chrome>
      <Mentoria imageUrl={s.mentoriaImageUrl} level="h1" />
      {/* A seção de transcrições saiu: o Pedro vai publicá-las como PDF aqui
          dentro, junto dos e-books, sem vídeo dele tocando. */}
    </Chrome>
  );
}
