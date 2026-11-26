const SRC = "\u003c!DOCTYPE html>\n\u003chtml lang=\"pt-PT\">\n\u003chead>\n\u003cmeta charset=\"utf-8\">\n\u003cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n\u003ctitle>Totobola · Palpites e acertos\u003c/title>\n\u003cstyle>\n:root{--bg:#f5f7f3;--card:#fff;--tx:#1b2a1f;--mut:#66726a;--bd:#e0e5dd;--ac:#1f7a45;--ok:#2e9d5b;--okbg:#dff3e6;--kobg:#fbe4e1;--ko:#b3392c;--gold:#b8860b;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\n@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]){color-scheme:dark;--bg:#0f1511;--card:#18211b;--tx:#e8efe9;--mut:#93a197;--bd:#2a362d;--ac:#4cc27d;--ok:#4cc27d;--okbg:#17402a;--kobg:#47201c;--ko:#ef7a6c;--gold:#e6b93d}}\n:root[data-theme=\"dark\"]{color-scheme:dark;--bg:#0f1511;--card:#18211b;--tx:#e8efe9;--mut:#93a197;--bd:#2a362d;--ac:#4cc27d;--ok:#4cc27d;--okbg:#17402a;--kobg:#47201c;--ko:#ef7a6c;--gold:#e6b93d}\nhtml{scroll-padding-top:env(safe-area-inset-top,0px)}\n*{box-sizing:border-box}\nbody{margin:0;background:var(--bg);color:var(--tx);font:15px/1.45 system-ui,-apple-system,\"Segoe UI\",Roboto,Arial,sans-serif}\nmain{max-width:1000px;margin:0 auto;padding:18px 14px 40px}\nheader{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:flex-end;margin-bottom:14px}\nh1{margin:0;font-size:24px}h2{margin:0 0 10px;font-size:17px}\n.sub{color:var(--mut);font-size:13px}\nbutton,select{font:inherit;color:var(--tx);background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:7px 12px;cursor:pointer}\nbutton:hover{border-color:var(--ac)}\nsection{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px;margin-bottom:14px}\n.kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}\n.k{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:12px}\n.k b{display:block;font-size:22px;color:var(--ac)}.k span{color:var(--mut);font-size:12px}\n.sc{overflow-x:auto}\ntable{border-collapse:collapse;width:100%;font-size:14px}\nth,td{padding:7px 8px;border-bottom:1px solid var(--bd);text-align:center;white-space:nowrap}\nth{font-size:12px;color:var(--mut);font-weight:600}\ntd:nth-child(2),th:nth-child(2){text-align:left}\n.bar{position:relative;min-width:120px;text-align:left}\n.bar i{position:absolute;left:0;top:7px;bottom:7px;background:var(--okbg);border-radius:4px}\n.bar span{position:relative;padding-left:6px;font-weight:600}\n.g td:first-child,.g th:first-child{text-align:left;font-weight:600}\n.g th[data-id]{cursor:pointer}.g th[data-id]:hover{color:var(--ac)}\n.w{font-weight:700;color:var(--gold)}\n.mut{color:var(--mut)}\n.d td.m{position:sticky;left:0;background:var(--card);text-align:left;max-width:190px;overflow:hidden;text-overflow:ellipsis}\n.d .h{background:var(--okbg);color:var(--ok);font-weight:700}\n.d .x{background:var(--kobg);color:var(--ko)}\n.d .r{font-weight:700;border-left:2px solid var(--bd)}\n.d tfoot td{font-weight:700}\n.note{margin:8px 0;color:var(--mut);font-size:13px}\n.tb{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}\n\u003c/style>\n\u003c/head>\n\u003cbody>\n\u003cmain>\n\u003cheader>\n \u003cdiv>\u003ch1>⚽ Totobola\u003c/h1>\u003cdiv class=\"sub\" id=\"upd\">\u003c/div>\u003c/div>\n \u003cdiv id=\"adm\" hidden>\u003cbutton id=\"up\">Atualizar dados (carregar Excel)\u003c/button>\u003cinput id=\"f\" type=\"file\" accept=\".xlsx\" hidden>\u003c/div>\n\u003c/header>\n\u003cdiv id=\"msg\" class=\"note\">\u003c/div>\n\u003cdiv class=\"kp\" id=\"kp\">\u003c/div>\n\u003csection>\u003ch2>Classificação geral\u003c/h2>\u003cdiv class=\"sc\" id=\"rk\">\u003c/div>\n\u003cdiv class=\"note\">Média = acertos ÷ jogos já apurados (13 jogos + Super 14 por boletim).\u003c/div>\u003c/section>\n\u003csection>\u003ch2>Acertos por boletim\u003c/h2>\u003cdiv class=\"sc\" id=\"gr\">\u003c/div>\n\u003cdiv class=\"note\">★ = melhor do boletim (empates partilham). Clica numa data para ver o detalhe.\u003c/div>\u003c/section>\n\u003csection id=\"det\">\u003ch2>Detalhe do boletim\u003c/h2>\u003cdiv class=\"tb\">\u003cselect id=\"sel\">\u003c/select>\u003cspan id=\"st\" class=\"sub\">\u003c/span>\u003c/div>\u003cdiv class=\"sc\" id=\"dt\">\u003c/div>\n\u003cdiv class=\"note\">O Super 14 é um palpite único, comum a todos os jogadores.\u003c/div>\u003c/section>\n\u003c/main>\n\u003cscript src=\"https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js\">\u003c/script>\n\u003cscript>\nconst RAW=/*DATA*/;\nconst SRC=/*SRC*/null;\nconst J=v=>JSON.stringify(v).replace(/\u003c/g,'\\\\u003c');\nconst doc=d=>SRC.replace('/*DA'+'TA*/',()=>J(d)).replace('/*SR'+'C*/null',()=>J(SRC));\nconst $=id=>document.getElementById(id);\nconst E=s=>String(s==null?'':s).replace(/[&\u003c>\"]/g,c=>({'&':'&amp;','\u003c':'&lt;','>':'&gt;','\"':'&quot;'}[c]));\nconst pc=x=>(x*100).toLocaleString('pt-PT',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';\nconst fd=id=>id.slice(0,2)+'/'+id.slice(2,4)+'/'+id.slice(4);\nconst key=id=>id.slice(4)+id.slice(2,4)+id.slice(0,2);\nlet S,sel='';\n\nfunction load(d){\n const P=d.players;\n const sheets=d.sheets.map(s=>({id:s.id,g:s.g.map(x=>[x[0],x[1],[...x[2]],x[3]])})).sort((a,b)=>key(a.id)\u003ckey(b.id)?-1:1);\n sheets.forEach(s=>{\n  const done=s.g.filter(g=>g[3]);\n  s.total=done.length;\n  s.hits=P.map((_,i)=>done.filter(g=>g[2][i]===g[3]).length);\n  s.has=s.g.some(g=>g[2].some(p=>p!=='-'));\n  const mx=Math.max(...s.hits);\n  s.win=s.hits.map(h=>s.total>0&&h===mx);\n });\n const played=sheets.filter(s=>s.total);\n const tot=played.reduce((a,s)=>a+s.total,0);\n const rows=P.map((n,i)=>{\n  const h=played.reduce((a,s)=>a+s.hits[i],0);\n  return{i,n,h,pct:tot?h/tot:0,wins:played.filter(s=>s.win[i]).length,best:played.length?Math.max(...played.map(s=>s.hits[i])):0,avg:played.length?h/played.length:0};\n }).sort((a,b)=>b.h-a.h);\n let rk=0;rows.forEach((r,j)=>{if(!j||r.h!==rows[j-1].h)rk=j+1;r.rk=rk});\n S={P,sheets,played,tot,rows,upd:d.upd};\n const withPicks=sheets.filter(s=>s.has);\n sel=(withPicks[withPicks.length-1]||sheets[sheets.length-1]||{}).id||'';\n render();\n}\n\nfunction render(){\n const{P,sheets,played,tot,rows}=S;\n $('upd').textContent=S.upd;\n const lead=rows[0];\n $('kp').innerHTML=[[played.length,'boletins apurados'],[tot,'jogos apurados'],[lead?E(lead.n):'—','líder ('+(lead?pc(lead.pct):'—')+')'],[P.length,'jogadores']].map(k=>`\u003cdiv class=\"k\">\u003cb>${k[0]}\u003c/b>\u003cspan>${k[1]}\u003c/span>\u003c/div>`).join('');\n const medal=['🥇','🥈','🥉'];\n $('rk').innerHTML='\u003ctable>\u003cthead>\u003ctr>\u003cth>Pos.\u003c/th>\u003cth>Jogador\u003c/th>\u003cth>Média\u003c/th>\u003cth>Acertos\u003c/th>\u003cth>Boletins ganhos\u003c/th>\u003cth>Melhor\u003c/th>\u003cth>Média/boletim\u003c/th>\u003c/tr>\u003c/thead>\u003ctbody>'+\n  rows.map(r=>`\u003ctr>\u003ctd>${r.rk\u003c=3?medal[r.rk-1]:r.rk}\u003c/td>\u003ctd>\u003cb>${E(r.n)}\u003c/b>\u003c/td>\u003ctd class=\"bar\">\u003ci style=\"width:${(r.pct*100).toFixed(1)}%\">\u003c/i>\u003cspan>${pc(r.pct)}\u003c/span>\u003c/td>\u003ctd>${r.h}/${tot}\u003c/td>\u003ctd>${r.wins}\u003c/td>\u003ctd>${r.best}\u003c/td>\u003ctd>${r.avg.toFixed(1).replace('.',',')}\u003c/td>\u003c/tr>`).join('')+'\u003c/tbody>\u003c/table>';\n $('gr').innerHTML='\u003ctable class=\"g\">\u003cthead>\u003ctr>\u003cth>Jogador\u003c/th>'+sheets.map(s=>`\u003cth data-id=\"${s.id}\">${fd(s.id).slice(0,5)}\u003c/th>`).join('')+'\u003cth>Total\u003c/th>\u003c/tr>\u003c/thead>\u003ctbody>'+\n  P.map((n,i)=>{const r=rows.find(x=>x.i===i);return`\u003ctr>\u003ctd>${E(n)}\u003c/td>`+sheets.map(s=>s.total?`\u003ctd class=\"${s.win[i]?'w':''}\" style=\"background:color-mix(in srgb,var(--ok) ${Math.round(s.hits[i]/s.total*55)}%,transparent)\">${s.hits[i]}${s.win[i]?' ★':''}\u003c/td>`:'\u003ctd class=\"mut\">—\u003c/td>').join('')+`\u003ctd>\u003cb>${r.h}\u003c/b>\u003c/td>\u003c/tr>`}).join('')+'\u003c/tbody>\u003c/table>';\n $('sel').innerHTML=sheets.slice().reverse().map(s=>`\u003coption value=\"${s.id}\">${fd(s.id)}\u003c/option>`).join('');\n $('sel').value=sel;\n detail();\n}\n\nfunction detail(){\n const s=S.sheets.find(x=>x.id===sel);\n if(!s){$('dt').innerHTML='';$('st').textContent='';return}\n $('st').textContent=s.total?`${s.total} jogos apurados`:(s.has?'A aguardar resultados':'Ainda sem palpites');\n $('dt').innerHTML='\u003ctable class=\"d\">\u003cthead>\u003ctr>\u003cth>#\u003c/th>\u003cth>Jogo\u003c/th>'+S.P.map(n=>`\u003cth>${E(n)}\u003c/th>`).join('')+'\u003cth>Res.\u003c/th>\u003c/tr>\u003c/thead>\u003ctbody>'+\n  s.g.map(g=>`\u003ctr>\u003ctd>${E(g[0])}\u003c/td>\u003ctd class=\"m\" title=\"${E(g[1])}\">${E(g[1])}\u003c/td>`+g[2].map(p=>`\u003ctd class=\"${g[3]?(p===g[3]?'h':'x'):''}\">${E(p)}\u003c/td>`).join('')+`\u003ctd class=\"r\">${E(g[3]||'')}\u003c/td>\u003c/tr>`).join('')+\n  '\u003c/tbody>'+(s.total?'\u003ctfoot>\u003ctr>\u003ctd>\u003c/td>\u003ctd style=\"text-align:left\">Acertos\u003c/td>'+s.hits.map((h,i)=>`\u003ctd class=\"${s.win[i]?'w':''}\">${h}/${s.total}${s.win[i]?' ★':''}\u003c/td>`).join('')+'\u003ctd>\u003c/td>\u003c/tr>\u003c/tfoot>':'')+'\u003c/table>';\n}\n\n$('sel').onchange=e=>{sel=e.target.value;detail()};\n$('gr').onclick=e=>{const id=e.target.dataset&&e.target.dataset.id;if(id){sel=id;$('sel').value=id;detail();$('det').scrollIntoView({behavior:'smooth'})}};\n\nfunction parse(wb){\n const m=wb.Sheets['Médias'],names=[];\n for(let r=3;r\u003c=10;r++){const c=m&&m['E'+r];names.push(c&&c.v?String(c.v).trim():'Jogador '+(r-2))}\n const sheets=wb.SheetNames.filter(n=>/^\\d{8}$/.test(n)).map(n=>{\n  const rows=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,defval:''});\n  const g=[];\n  for(let r=5;r\u003c=18;r++){\n   const x=rows[r]||[],v=k=>String(x[k]==null?'':x[k]).trim().toUpperCase();\n   const p=r===18?Array(8).fill(v(4)||'-'):[4,5,6,7,8,9,10,11].map(k=>v(k)||'-');\n   g.push([r===18?'S14':v(0).replace(/\\.0$/,''),String(x[1]||'').trim(),p,v(12)]);\n  }\n  return{id:n,g};\n });\n if(!sheets.length)throw new Error('Não encontrei folhas de boletins (nome DDMMAAAA).');\n return{players:names,sheets};\n}\n$('up').onclick=()=>$('f').click();\n$('f').onchange=e=>{\n const f=e.target.files[0];if(!f)return;\n const fr=new FileReader();\n fr.onload=async()=>{\n  let d;\n  try{\n   if(typeof XLSX==='undefined')throw new Error('A biblioteca de leitura de Excel não carregou.');\n   d=parse(XLSX.read(new Uint8Array(fr.result),{type:'array'}));\n   d.upd='Atualizado a '+new Date().toLocaleDateString('pt-PT');\n  }catch(err){$('msg').textContent='Erro ao ler o ficheiro: '+err.message;return}\n  if(typeof claude==='undefined'){load(d);$('msg').textContent='Dados atualizados só neste ecrã (cópia local, fora do claude.ai).';return}\n  $('msg').textContent='A guardar para todos…';\n  try{\n   const a=typeof claude!=='undefined'?await claude.use('artifact'):null;\n   if(!a)throw{code:'indisponível'};\n   await a.publish(doc(d));\n  }catch(err){\n   if(err&&err.code==='conflict')return;\n   load(d);$('msg').textContent='Não foi possível guardar para todos ('+((err&&err.code)||'erro')+'). Os dados só foram atualizados no teu ecrã.';\n  }\n };\n fr.readAsArrayBuffer(f);e.target.value='';\n};\n;(async()=>{try{const u=await claude.use('user');if(u&&await u.canEdit())$('adm').hidden=false}catch(e){}})();\nload(RAW);\n\u003c/script>\n\u003c/body>\n\u003c/html>\n";
    const J = v => JSON.stringify(v).replace(/</g, '\\u003c');
    const doc = d => SRC.replace('/*DA' + 'TA*/', () => J(d)).replace('/*SR' + 'C*/null', () => J(SRC));
    const $ = id => document.getElementById(id);
    const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const pc = x => (x * 100).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    const fd = id => id.slice(0, 2) + '/' + id.slice(2, 4) + '/' + id.slice(4);
    const key = id => id.slice(4) + id.slice(2, 4) + id.slice(0, 2);
    let S, sel = '';

    function load(d) {
      const P = d.players;
      const sheets = d.sheets.map(s => ({ id: s.id, g: s.g.map(x => [x[0], x[1], [...x[2]], x[3]]) })).sort((a, b) => key(a.id) < key(b.id) ? -1 : 1);
      sheets.forEach(s => {
        const done = s.g.filter(g => g[3]);
        s.total = done.length;
        s.hits = P.map((_, i) => done.filter(g => g[2][i] === g[3]).length);
        s.has = s.g.some(g => g[2].some(p => p !== '-'));
        const mx = Math.max(...s.hits);
        s.win = s.hits.map(h => s.total > 0 && h === mx);
      });
      const played = sheets.filter(s => s.total);
      const tot = played.reduce((a, s) => a + s.total, 0);
      const rows = P.map((n, i) => {
        const h = played.reduce((a, s) => a + s.hits[i], 0);
        return { i, n, h, pct: tot ? h / tot : 0, wins: played.filter(s => s.win[i]).length, best: played.length ? Math.max(...played.map(s => s.hits[i])) : 0, avg: played.length ? h / played.length : 0 };
      }).sort((a, b) => b.h - a.h);
      let rk = 0; rows.forEach((r, j) => { if (!j || r.h !== rows[j - 1].h) rk = j + 1; r.rk = rk });
      S = { P, sheets, played, tot, rows, upd: d.upd };
      const withPicks = sheets.filter(s => s.has);
      sel = (withPicks[withPicks.length - 1] || sheets[sheets.length - 1] || {}).id || '';
      render();
    }

    function render() {
      const { P, sheets, played, tot, rows } = S;
      $('upd').textContent = S.upd;
      const lead = rows[0];
      $('kp').innerHTML = [[played.length, 'boletins apurados'], [tot, 'jogos apurados'], [lead ? E(lead.n) : '—', 'líder (' + (lead ? pc(lead.pct) : '—') + ')'], [P.length, 'jogadores']].map(k => `<div class="k"><b>${k[0]}</b><span>${k[1]}</span></div>`).join('');
      const medal = ['🥇', '🥈', '🥉'];
      $('rk').innerHTML = '<table><thead><tr><th>Pos.</th><th>Jogador</th><th>Média</th><th>Acertos</th><th>Boletins ganhos</th><th>Melhor</th><th>Média/boletim</th></tr></thead><tbody>' +
        rows.map(r => `<tr><td>${r.rk <= 3 ? medal[r.rk - 1] : r.rk}</td><td><b>${E(r.n)}</b></td><td class="bar"><i style="width:${(r.pct * 100).toFixed(1)}%"></i><span>${pc(r.pct)}</span></td><td>${r.h}/${tot}</td><td>${r.wins}</td><td>${r.best}</td><td>${r.avg.toFixed(1).replace('.', ',')}</td></tr>`).join('') + '</tbody></table>';
      $('gr').innerHTML = '<table class="g"><thead><tr><th>Jogador</th>' + sheets.map(s => `<th data-id="${s.id}">${fd(s.id).slice(0, 5)}</th>`).join('') + '<th>Total</th></tr></thead><tbody>' +
        P.map((n, i) => { const r = rows.find(x => x.i === i); return `<tr><td>${E(n)}</td>` + sheets.map(s => s.total ? `<td class="${s.win[i] ? 'w' : ''}" style="background:color-mix(in srgb,var(--ok) ${Math.round(s.hits[i] / s.total * 55)}%,transparent)">${s.hits[i]}${s.win[i] ? ' ★' : ''}</td>` : '<td class="mut">—</td>').join('') + `<td><b>${r.h}</b></td></tr>` }).join('') + '</tbody></table>';
      $('sel').innerHTML = sheets.slice().reverse().map(s => `<option value="${s.id}">${fd(s.id)}</option>`).join('');
      $('sel').value = sel;
      detail();
    }
    function detail() {
      const s = S.sheets.find(x => x.id === sel);
      if ($('lv')) $('lv').href = 'ao-vivo.html' + (sel ? '?b=' + sel : '');
      if (!s) { $('dt').innerHTML = ''; $('st').textContent = ''; return }
      $('st').textContent = s.total ? `${s.total} jogos apurados` : (s.has ? 'A aguardar resultados' : 'Ainda sem palpites');
      $('dt').innerHTML = '<table class="d"><thead><tr><th>#</th><th>Jogo</th>' + S.P.map(n => `<th>${E(n)}</th>`).join('') + '<th>Res.</th></tr></thead><tbody>' +
        s.g.map(g => `<tr><td>${E(g[0])}</td><td class="m" title="${E(g[1])}">${E(g[1])}</td>` + g[2].map(p => `<td class="${g[3] ? (p === g[3] ? 'h' : 'x') : ''}">${E(p)}</td>`).join('') + `<td class="r">${E(g[3] || '')}</td></tr>`).join('') +
        '</tbody>' + (s.total ? '<tfoot><tr><td></td><td style="text-align:left">Acertos</td>' + s.hits.map((h, i) => `<td class="${s.win[i] ? 'w' : ''}">${h}/${s.total}${s.win[i] ? ' ★' : ''}</td>`).join('') + '<td></td></tr></tfoot>' : '') + '</table>';
    }

    $('sel').onchange = e => { sel = e.target.value; detail() };
    $('gr').onclick = e => { const id = e.target.dataset && e.target.dataset.id; if (id) { sel = id; $('sel').value = id; detail(); $('det').scrollIntoView({ behavior: 'smooth' }) } };

    function parse(wb) {
      const m = wb.Sheets['Médias'], names = [];
      for (let r = 3; r <= 10; r++) { const c = m && m['E' + r]; names.push(c && c.v ? String(c.v).trim() : 'Jogador ' + (r - 2)) }
      const sheets = wb.SheetNames.filter(n => /^\d{8}$/.test(n)).map(n => {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '' });
        const g = [];
        for (let r = 5; r <= 18; r++) {
          const x = rows[r] || [], v = k => String(x[k] == null ? '' : x[k]).trim().toUpperCase();
          const p = r === 18 ? Array(8).fill(v(4) || '-') : [4, 5, 6, 7, 8, 9, 10, 11].map(k => v(k) || '-');
          g.push([r === 18 ? 'S14' : v(0).replace(/\.0$/, ''), String(x[1] || '').trim(), p, v(12)]);
        }
        return { id: n, g };
      });
      if (!sheets.length) throw new Error('Não encontrei folhas de boletins (nome DDMMAAAA).');
      return { players: names, sheets };
    }
    $('up').onclick = () => $('f').click();
    $('f').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const fr = new FileReader();
      fr.onload = async () => {
        let d;
        try {
          if (typeof XLSX === 'undefined') throw new Error('A biblioteca de leitura de Excel não carregou.');
          d = parse(XLSX.read(new Uint8Array(fr.result), { type: 'array' }));
          d.upd = 'Atualizado a ' + new Date().toLocaleDateString('pt-PT');
        } catch (err) { $('msg').textContent = 'Erro ao ler o ficheiro: ' + err.message; return }
        if (typeof claude === 'undefined') { load(d); $('msg').textContent = 'Dados atualizados só neste ecrã (cópia local, fora do claude.ai).'; return }
        $('msg').textContent = 'A guardar para todos…';
        try {
          const a = typeof claude !== 'undefined' ? await claude.use('artifact') : null;
          if (!a) throw { code: 'indisponível' };
          await a.publish(doc(d));
        } catch (err) {
          if (err && err.code === 'conflict') return;
          load(d); $('msg').textContent = 'Não foi possível guardar para todos (' + ((err && err.code) || 'erro') + '). Os dados só foram atualizados no teu ecrã.';
        }
      };
      fr.readAsArrayBuffer(f); e.target.value = '';
    };
    ;(async () => { try { const u = await claude.use('user'); if (u && await u.canEdit()) $('adm').hidden = false } catch (e) { } })();
    load(RAW);