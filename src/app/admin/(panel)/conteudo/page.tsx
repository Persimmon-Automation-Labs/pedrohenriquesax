import { getSettings } from "@/lib/settings";
import { saveContent } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

export default async function Conteudo() {
  const s = await getSettings();
  return (
    <>
      <h1 className="d-l text-paper">Textos do site</h1>
      <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
        <AdminForm action={saveContent}>
          <Field label="Bio curta" name="bioShort" textarea defaultValue={s.bioShort} hint="Aparece no herói, abaixo do nome. Uma ou duas linhas." />
          <Field label="Bio média" name="bioMedium" textarea defaultValue={s.bioMedium} hint="Reserva, para materiais de imprensa." />
          <Field label="Bio longa" name="bioLong" textarea defaultValue={s.bioLong} hint="Seção Sobre. Separe parágrafos com uma linha em branco." />
          <Field label="Texto de Eventos" name="eventsText" textarea defaultValue={s.eventsText} />
          <Field label="Texto da Mentoria" name="mentoriaText" textarea defaultValue={s.mentoriaText} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Duração da mentoria" name="mentoriaDuration" defaultValue={s.mentoriaDuration} />
            <Field label="Valor da mentoria" name="mentoriaPrice" defaultValue={s.mentoriaPrice} hint="Deixe vazio para exibir Sob consulta." />
          </div>
        </AdminForm>
      </div>
    </>
  );
}
