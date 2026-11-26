const $ = id => document.getElementById(id);
const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fd = id => id.slice(0, 2) + '/' + id.slice(2, 4) + '/' + id.slice(4);
const key = id => id.slice(4) + id.slice(2, 4) + id.slice(0, 2);
const hoje = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Lisbon' });
const somaDias = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const hhmm = d => d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' });

// ---- Boletim escolhido (?b=DDMMAAAA) ou o último com palpites ----
const sheets = RAW.sheets.slice().sort((a, b) => key(a.id) < key(b.id) ? -1 : 1);
const comPalpites = sheets.filter(s => s.g.some(g => [...g[2]].some(p => p !== '-')));
const B = sheets.find(s => s.id === new URLSearchParams(location.search).get('b')) || comPalpites[comPalpites.length - 1] || sheets[sheets.length - 1];
const P = RAW.players;
const jogos = B.g.map(g => ({ n: g[0], m: g[1], p: [...g[2]], r: g[3] }));

// ---- Associar nomes do boletim aos da API ----
const FIM = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO']), VIVO = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE', 'INT', 'SUSP']);
const STOP = new Set(['fc', 'sc', 'cf', 'cd', 'ac', 'ad', 'ud', 'sl', 'cp', 'sad', 'de', 'do', 'da', 'the', 'club', '1932']);
const TOK = { sp: 'sporting', atl: 'atletico', bor: 'borussia', desp: 'desportivo', utd: 'united', e: 'estrela', v: 'vitoria', herz: 'herzegovina', nott: 'nottingham', d: 'donetsk' };
// Nomes do boletim -> nome usado pela API (normalizados, sem acentos). Acrescenta aqui os que falharem.
const ALIAS = {
  'afs': 'avs', 'sevilha': 'sevilla', 'bayern munique': 'bayern munich', 'estugarda': 'stuttgart', 'psg': 'paris saint germain',
  'villareal': 'villarreal', 'napoles': 'napoli', 'inter milao': 'inter', 'genova': 'genoa', 'bolonha': 'bologna',
  'atletico mineiro': 'atletico mg', 'betis sevilha': 'betis', 'real betis': 'betis', 'aek atenas': 'aek athens', 'newscastle': 'newcastle',
  'pais gales': 'wales', 'inglaterra': 'england', 'croacia': 'croatia', 'turquia': 'turkey', 'belgica': 'belgium', 'chequia': 'czech republic',
  'espanha': 'spain', 'paises baixos': 'netherlands', 'grecia': 'greece', 'servia': 'serbia', 'alemanha': 'germany', 'chipre': 'cyprus',
  'finlandia': 'finland', 'moldavia': 'moldova', 'cazaquistao': 'kazakhstan', 'islandia': 'iceland', 'luxemburgo': 'luxembourg',
  'escocia': 'scotland', 'macedonia norte': 'north macedonia', 'eslovaquia': 'slovakia', 'ilhas faroe': 'faroe islands',
  'eslovenia': 'slovenia', 'suica': 'switzerland', 'italia': 'italy', 'franca': 'france', 'bosnia herzegovina': 'bosnia',
  'romenia': 'romania', 'dinamarca': 'denmark', 'noruega': 'norway', 'hungria': 'hungary', 'irlanda norte': 'northern ireland',
  'irlanda': 'ireland', 'polonia': 'poland', 'suecia': 'sweden', 'ucrania': 'ukraine',
  'sparta praga': 'sparta praha', 'slavia praga': 'slavia praha', 'olympiacos': 'olympiakos', 'salzburgo': 'salzburg',
  'copenhaga': 'copenhagen', 'basileia': 'basel', 'estrela vermelha': 'crvena zvezda', 'dinamo kiev': 'dynamo kyiv'
};
const toks = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9 ]/g, ' ')
  .split(/\s+/).filter(Boolean).map(t => TOK[t] || t).filter(t => !STOP.has(t));
const nome = s => { const t = toks(s), a = ALIAS[t.join(' ')]; return a ? a.split(' ') : t };
const marca = t => t.filter(x => /^u\d+$|^w$|^women$|^reserves$|^ii$/.test(x)).join();
function sim(a, b) { // 2 = igual, 1 = um contém o outro, 0 = não bate
  if (marca(a) !== marca(b)) return 0;
  const A = new Set(a), B2 = new Set(b); let n = 0; A.forEach(x => { if (B2.has(x)) n++ });
  if (!n) return 0;
  if (n === A.size && n === B2.size) return 2;
  return n === Math.min(A.size, B2.size) ? 1 : 0;
}
function acharJogo(txt, fx) {
  const p = txt.replace(/\s+[a-z]\)\s*$/i, '').trim().split(/\s*[-–]\s*/); let best = null;
  for (let i = 1; i < p.length; i++) {
    const h = nome(p.slice(0, i).join('-')), a = nome(p.slice(i).join('-'));
    for (const f of fx) for (const inv of [false, true]) {
      const s1 = sim(h, inv ? f.ak : f.hk), s2 = sim(a, inv ? f.hk : f.ak);
      if (s1 && s2) { const sc = s1 + s2 - (inv ? .5 : 0); if (!best || sc > best.sc) best = { sc, f, inv } }
    }
  }
  return best;
}
const res = (a, b) => a > b ? '1' : a < b ? '2' : 'X';
// Estado de um jogo: fase = 'fim' | 'on' | 'pre'
function estado(f, inv) {
  const x90 = ['AET', 'PEN', 'ET', 'BT', 'P'].includes(f.s) && f.fh != null; // resultado aos 90 minutos
  let gh = x90 ? f.fh : f.gh, ga = x90 ? f.fa : f.ga;
  if (inv) [gh, ga] = [ga, gh];
  if (FIM.has(f.s)) return { score: `${gh}-${ga}`, est: 'Fim' + (x90 ? " (90')" : ''), fase: 'fim', out: res(gh, ga) };
  if (VIVO.has(f.s)) { gh = gh ?? 0; ga = ga ?? 0; return { score: `${gh}-${ga}`, est: f.s === 'HT' ? 'Intervalo' : (f.m || '') + "'", fase: 'on', out: res(gh, ga) } }
  if (f.s === 'PST') return { score: '—', est: 'Adiado', fase: 'pre', out: '' };
  if (f.s === 'CANC' || f.s === 'ABD') return { score: '—', est: 'Cancelado', fase: 'pre', out: '' };
  return { score: '—', est: hhmm(new Date(f.t)), fase: 'pre', out: '' };
}

// ---- Desenho ----
function desenhar(est, info) {
  const todos = jogos.map((g, k) => {
    const e = est[k] || { score: '—', est: g.r ? 'Oficial' : 'Sem dados', fase: g.r ? 'fim' : 'pre', out: '' };
    return { ...e, o: g.r || e.out };   // resultado oficial da folha tem prioridade
  });
  $('jg').innerHTML = '<table><thead><tr><th>#</th><th>Jogo</th><th>Resultado</th><th>Estado</th><th>1X2</th></tr></thead><tbody>' +
    jogos.map((g, k) => { const e = todos[k]; return `<tr><td>${E(g.n)}</td><td>${E(g.m)}</td><td class="pl">${E(e.score)}</td><td class="${e.fase === 'on' ? 'on' : e.fase === 'fim' ? 'fim' : ''}">${E(e.est)}</td><td>${E(e.o || '—')}</td></tr>` }).join('') + '</tbody></table>';

  const n = todos.filter(e => e.o).length, hits = P.map((_, i) => jogos.filter((g, k) => todos[k].o && g.p[i] === todos[k].o).length);
  const ord = P.map((nm, i) => ({ nm, h: hits[i] })).sort((a, b) => b.h - a.h);
  let rk = 0; ord.forEach((r, j) => { if (!j || r.h !== ord[j - 1].h) rk = j + 1; r.rk = rk });
  $('cl').innerHTML = '<table><thead><tr><th>Pos.</th><th>Jogador</th><th>Acertos</th></tr></thead><tbody>' +
    ord.map(r => `<tr><td>${r.rk}</td><td><b>${E(r.nm)}</b></td><td class="bar"><i style="width:${n ? (r.h / n * 100).toFixed(1) : 0}%"></i><span>${r.h}/${n}</span></td></tr>`).join('') + '</tbody></table>';

  const c = f => todos.filter(e => e.fase === f).length, abertos = c('on') + c('pre');
  $('nt').textContent = abertos ? 'Provisório: conta os jogos já com resultado, incluindo os que ainda estão a decorrer.' : 'Todos os jogos têm resultado.';
  $('sub').textContent = `Boletim de ${fd(B.id)} · ${c('on')} a decorrer · ${c('fim')} terminados · ${c('pre')} por começar` + (info ? ' · ' + info : '');
}

async function atualizar() {
  const est = jogos.map(() => null); let rest = null, erro = '';
  for (const off of [0, -1, 1]) {   // hoje, ontem, amanhã (o plano gratuito da API só permite estes dias)
    if (est.every(Boolean)) break;
    try {
      const r = await fetch('/api/ao-vivo?data=' + somaDias(hoje(), off)), j = await r.json();
      if (!r.ok || j.erro) throw new Error(j.erro || r.status);
      rest = j.restantes || rest;
      const fx = j.jogos.map(f => ({ ...f, hk: nome(f.h), ak: nome(f.a) }));
      jogos.forEach((g, k) => { if (!est[k]) { const m = acharJogo(g.m, fx); if (m) est[k] = estado(m.f, m.inv) } });
    } catch (e) { erro = e.message }
  }
  const faltam = jogos.filter((g, k) => !est[k] && !g.r).map(g => g.m);
  $('msg').textContent = [erro && 'Aviso da API: ' + erro, faltam.length && 'Sem correspondência: ' + faltam.join('; ')].filter(Boolean).join(' — ');
  desenhar(est, 'atualizado às ' + hhmm(new Date()) + (rest ? ' · pedidos restantes hoje: ' + rest : ''));
}

desenhar(jogos.map(() => null), 'a carregar…');
atualizar();
setInterval(() => { if (!document.hidden) atualizar() }, 240000);