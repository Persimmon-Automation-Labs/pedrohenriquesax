# pedrolucenasax — contexto para o Claude Code

Site do saxofonista **Pedro Lucena** (Pedro Henrique da Silva Lucena), São Paulo.
Site público + loja de produto digital com Pix + conta de cliente + painel.

## No ar

https://renatodap.me/pedro-lucena — deploy automático a cada push para 
(webhook do GitHub → Coolify). O  roda  antes do
, então uma migração nova entra sozinha junto com o código.

Infra: app  no , banco  no Postgres
compartilhado, bucket MinIO  com usuário restrito ao próprio bucket.
Gerenciado pelo CLI em ../infra: `infra logs pedro-lucena`, `infra deploy`,
`infra db psql`.

## Comandos

```
npm run dev              # desenvolvimento
npm run build            # prisma generate + next build
npm run db:push          # aplica o schema
npm run db:seed          # dados reais do Pedro + admin
npm run verify [URL]     # 48 verificações end-to-end (padrão localhost:3100)
npm run audit:contrast [URL]   # WCAG AA em 13 rotas
node scripts/routes-audit.mjs [URL]  # h1, overflow e navegação em 390 e 1440px
```

Acesso local do painel: `pedro@pedrolucenasax.com` / `pedro2026` (trocar em produção).

## O que não pode ser quebrado

1. **Sessão do cliente e do admin são separadas.** `src/lib/customer/session.ts` (cookie
   `pl_customer`) nunca toca `src/lib/admin/session.ts` (cookie `pl_admin`). São dois
   sistemas independentes, como no bydap.

2. **Arquivo de produto nunca tem URL pública.** Fica em `.storage/private/`, servido só por
   `/conta/download/[token]`, que exige token assinado válido + pedido pago + dono logado.
   Três checagens, todas obrigatórias.

3. **O Pix é gerado no servidor**, sem API externa. `src/lib/pix.ts` monta o payload EMV a
   partir da chave que o Pedro cadastra no painel. O CRC16 é CCITT-FALSE — o vetor
   `crc16("123456789") === "29B1"` é o teste de sanidade.

4. **A confirmação de pagamento é manual e isso é intencional.** Chave Pix estática não
   notifica o site. Toda tela que fala de pagamento precisa dizer isso ao cliente.

5. **Tema travado em escuro, um acento só** (`#4FA8C4`). Raio 2px em tudo. Nenhuma seção
   inverte para claro. Tokens no topo de `src/app/globals.css`, com os contrastes medidos.

6. **A navegação é uma linha só.** Verificada de 320px a 1920px por `npm run verify`.
   Rótulos de texto só a partir de `xl`; abaixo disso, ícones do Phosphor.

## Design

Sistema derivado da captura técnica das seis referências indicadas pelo cliente
(braxtoncook, chadlb, gracekelly, kennyg, mateusasato, alexhahn) — ver
`docs/specs/2026-09-02-spec-completa.html`.

- Tipografia: **Archivo** variável em três larguras. Expanded 118 no nome, Narrow 78 na
  parede de credenciais, normal no corpo.
- A **parede de credenciais** (`src/components/home/Credentials.tsx`) é a assinatura do site:
  é ela que sustenta o cachê dele. Densidade alta ali é proposital.
- Imagens em `.storage/public/` são atmosféricas e geradas, sem rosto. **Trocar pelas fotos
  reais do Pedro assim que ele enviar.**

## Conteúdo

Bio, credenciais e dados vêm de `docs/requisitos/2026-09-01-requisitos-pedro-lucena.md`,
preenchido pelo próprio cliente. As 31 credenciais estão no `prisma/seed.mjs`.

<!-- deploy automático verificado em 03/09/2026 -->
