import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

export default async function Config() {
  const s = await getSettings();
  return (
    <>
      <h1 className="d-l text-paper">Configurações</h1>
      <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
        <AdminForm action={saveSettings} encType="multipart/form-data">

          <fieldset className="flex flex-col gap-5">
            <legend className="d-m text-paper mb-4">Recebimento por Pix</legend>
            <p className="hint -mt-2">
              É esta chave que gera o código de cobrança de cada pedido. O dinheiro cai direto na sua conta.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="pixKeyType">Tipo da chave</label>
                <select id="pixKeyType" name="pixKeyType" defaultValue={s.pixKeyType} className="select">
                  <option value="cpf">CPF</option><option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option><option value="phone">Telefone</option>
                  <option value="random">Aleatória</option>
                </select>
              </div>
              <Field label="Chave Pix" name="pixKey" defaultValue={s.pixKey} hint="Exatamente como está no banco." />
              <Field label="Nome do recebedor" name="pixName" defaultValue={s.pixName} hint="Máx. 25 caracteres, sem acento." />
              <Field label="Cidade do recebedor" name="pixCity" defaultValue={s.pixCity} hint="Máx. 15 caracteres." />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-5 border-t border-black/10 pt-7">
            <legend className="d-m text-paper mb-4">Identificação</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome" name="name" defaultValue={s.name} required />
              <Field label="Função" name="tagline" defaultValue={s.tagline} />
              <Field label="Cidade" name="city" defaultValue={s.city} />
              <Field label="E-mail de contato" name="email" type="email" defaultValue={s.email} hint="Recebe os avisos de pedido e mensagem." />
              <Field label="WhatsApp" name="whatsapp" defaultValue={s.whatsapp} hint="Com DDD. Ex.: +55 11 96121-6535" />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-5 border-t border-black/10 pt-7">
            <legend className="d-m text-paper mb-4">Redes</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Instagram" name="instagramUrl" defaultValue={s.instagramUrl} />
              <Field label="YouTube" name="youtubeUrl" defaultValue={s.youtubeUrl} />
              <Field label="Spotify" name="spotifyUrl" defaultValue={s.spotifyUrl} />
              <Field label="TikTok" name="tiktokUrl" defaultValue={s.tiktokUrl} />
              <Field label="LinkedIn" name="linkedinUrl" defaultValue={s.linkedinUrl} />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-5 border-t border-black/10 pt-7">
            <legend className="d-m text-paper mb-4">Imagens e currículo</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field"><label htmlFor="heroImage">Retrato do herói (vertical)</label>
                <input id="heroImage" name="heroImage" type="file" accept="image/*" className="input pt-2.5" />
                {s.heroImageUrl && <p className="hint">Atual: {s.heroImageUrl}</p>}</div>
              <div className="field"><label htmlFor="aboutImage">Foto do Sobre</label>
                <input id="aboutImage" name="aboutImage" type="file" accept="image/*" className="input pt-2.5" /></div>
              <div className="field"><label htmlFor="eventsImage">Foto de Eventos</label>
                <input id="eventsImage" name="eventsImage" type="file" accept="image/*" className="input pt-2.5" /></div>
              <div className="field"><label htmlFor="mentoriaImage">Foto da Mentoria</label>
                <input id="mentoriaImage" name="mentoriaImage" type="file" accept="image/*" className="input pt-2.5" /></div>
              <div className="field"><label htmlFor="credentialsImage">Fundo das Credenciais</label>
                <input id="credentialsImage" name="credentialsImage" type="file" accept="image/*" className="input pt-2.5" /></div>
              <div className="field"><label htmlFor="contactImage">Foto do Contato</label>
                <input id="contactImage" name="contactImage" type="file" accept="image/*" className="input pt-2.5" /></div>
              <div className="field"><label htmlFor="resume">Currículo em PDF</label>
                <input id="resume" name="resume" type="file" accept="application/pdf" className="input pt-2.5" /></div>
            </div>
          </fieldset>
        </AdminForm>
      </div>
    </>
  );
}
