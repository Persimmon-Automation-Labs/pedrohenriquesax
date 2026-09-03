import { chromium } from 'playwright';
const B = process.argv[2] || 'http://localhost:3100';
const PAGES = ['/', '/sobre', '/eventos', '/mentoria', '/loja', '/agenda', '/galeria', '/contato', '/entrar', '/criar-conta', '/carrinho', '/privacidade', '/termos'];
const b = await chromium.launch();
let total = 0;
for (const path of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(B + path, { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(900);
  const bad = await p.evaluate(() => {
    const out = [];
    const L = c => { const m = c.match(/\d+/g); if (!m) return null;
      const [r,g,bl] = m.map(Number).map(v => { v/=255; return v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); });
      return .2126*r + .7152*g + .0722*bl; };
    const bgOf = el => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && !/,\s*0\)$/.test(c)) return c; e = e.parentElement; } return 'rgb(11, 13, 14)'; };
    for (const el of document.querySelectorAll('p,span,a,h1,h2,h3,h4,li,label,button,td,th,dt,dd,legend,time')) {
      if (!el.textContent.trim() || el.children.length) continue;
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
      const s = getComputedStyle(el); if (s.opacity === '0' || s.visibility === 'hidden') continue;
      const fg = L(s.color), bg = L(bgOf(el)); if (fg === null || bg === null) continue;
      const hi = Math.max(fg,bg), lo = Math.min(fg,bg), ratio = (hi+.05)/(lo+.05);
      const size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight) >= 700;
      const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
      if (ratio < need) out.push({ t: el.textContent.trim().slice(0,34), ratio:+ratio.toFixed(2), need, size: Math.round(size) });
    }
    return out;
  });
  console.log(`${path.padEnd(14)} ${bad.length ? `✗ ${bad.length}` : '✓ ok'}`);
  bad.slice(0,4).forEach(x => console.log(`     ${x.ratio}:1 (min ${x.need}) ${x.size}px "${x.t}"`));
  total += bad.length;
  await p.close();
}
await b.close();
console.log(total ? `\n✗ ${total} falha(s) de contraste` : '\n✓ todo texto passa WCAG AA em todas as páginas');
process.exit(total ? 1 : 0);
