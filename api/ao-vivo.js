// Função da Vercel: /api/ao-vivo?data=AAAA-MM-DD
// Vai buscar à API-Football os jogos desse dia e devolve uma lista simplificada.
// A chave fica na variável de ambiente API_FOOTBALL_KEY (nunca no código).

const hoje = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Lisbon' });

module.exports = async (req, res) => {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ erro: 'Falta a variável API_FOOTBALL_KEY na Vercel.' });
  }

  // Só aceita ontem, hoje e amanhã: é o intervalo que o plano gratuito da API permite
  const pedida = String(req.query.data || '');
  const dia = /^\d{4}-\d{2}-\d{2}$/.test(pedida) ? pedida : hoje();
  const dif = Math.abs(Date.parse(dia) - Date.parse(hoje())) / 864e5;
  if (!(dif <= 1)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ erro: 'Data fora do intervalo permitido (ontem a amanhã).' });
  }

  try {
    const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${dia}&timezone=Europe/Lisbon`, {
      headers: { 'x-apisports-key': key },
    });
    const j = await r.json();
    const e = j.errors;
    if (e && (Array.isArray(e) ? e.length : Object.keys(e).length)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ erro: JSON.stringify(e) });
    }
    const jogos = (j.response || []).map(f => ({
      h: f.teams.home.name, a: f.teams.away.name,
      s: f.fixture.status.short, m: f.fixture.status.elapsed, t: f.fixture.date,
      gh: f.goals.home, ga: f.goals.away,
      fh: f.score && f.score.fulltime ? f.score.fulltime.home : null,
      fa: f.score && f.score.fulltime ? f.score.fulltime.away : null,
    }));
    // Cache na CDN: dias passados mudam pouco (1 h), hoje atualiza de 4 em 4 min, dias futuros 15 min
    const seg = dif === 0 ? 240 : (Date.parse(dia) < Date.parse(hoje()) ? 3600 : 900);
    res.setHeader('Cache-Control', `s-maxage=${seg}, stale-while-revalidate=120`);
    return res.status(200).json({
      data: dia,
      atualizado: new Date().toISOString(),
      restantes: r.headers.get('x-ratelimit-requests-remaining'),
      jogos,
    });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ erro: 'Falha ao contactar a API de resultados.' });
  }
};