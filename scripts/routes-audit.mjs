import { chromium } from 'playwright';
const B = process.argv[2] || 'http://localhost:3100';
const ROTAS = ['/','/sobre','/eventos','/mentoria','/loja','/agenda','/galeria','/contato','/entrar','/criar-conta','/carrinho','/privacidade','/termos'];
const b = await chromium.launch(); let bad = 0;
for (const w of [390, 1440]) {
  console.log(`\n── ${w}px ──`);
  const c = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  for (const r of ROTAS) {
    const resp = await p.goto(B + r, { waitUntil: 'networkidle' });
    const d = await p.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      h1text: document.querySelector('h1')?.innerText.slice(0,26) ?? '',
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      header: (() => { const x = document.querySelector('header .wrap'); return x ? x.scrollWidth > x.clientWidth + 1 : false; })(),
      dupIds: (() => { const s = new Set(); let n = 0; for (const e of document.querySelectorAll('[id]')) { if (s.has(e.id)) n++; s.add(e.id); } return n; })(),
      burger: (() => { const btn = document.querySelector('button[aria-controls=menu-mobile]'); return btn ? getComputedStyle(btn).display !== 'none' : false; })(),
      nav: (() => { const n = document.querySelector('nav[aria-label=Principal]'); return n ? getComputedStyle(n).display !== 'none' : false; })(),
    }));
    const problems = [];
    if (resp.status() !== 200) problems.push(`http ${resp.status()}`);
    if (d.h1 !== 1) problems.push(`${d.h1} h1`);
    if (d.overflow) problems.push('overflow');
    if (d.header) problems.push('cabeçalho cortado');
    if (d.dupIds) problems.push(`${d.dupIds} ids dup`);
    if (d.burger && d.nav) problems.push('hambúrguer + nav juntos');
    if (!d.burger && !d.nav) problems.push('sem navegação');
    if (problems.length) bad++;
    console.log(`  ${r.padEnd(13)} ${problems.length ? '✗ ' + problems.join(', ') : '✓'}  "${d.h1text}"`);
  }
  await c.close();
}
await b.close();
console.log(bad ? `\n✗ ${bad} problema(s)` : '\n✓ todas as rotas ok em ambas as larguras');
process.exit(bad ? 1 : 0);
