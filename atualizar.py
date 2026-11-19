#!/usr/bin/env python3
"""Atualiza o index.html do Totobola a partir do TOTOBOSTA.xlsx.

Uso (dentro da pasta do projeto):
    python atualizar.py          -> só atualiza os dados na página
    python atualizar.py --push   -> atualiza, faz commit e git push

Precisa de:  pip install openpyxl
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys

import openpyxl

PASTA = pathlib.Path(__file__).parent
XLSX = PASTA / "TOTOBOSTA.xlsx"
HTML = PASTA / "index.html"

# Na página alojada no GitHub o botão "carregar Excel" não serve para nada
# (só mudaria o ecrã de quem clica). Com True, o script esconde-o.
ESCONDER_BOTAO = True


def norm(v):
    """Normaliza uma célula: 1.0 -> '1', 'x ' -> 'X', vazio -> ''."""
    if v is None:
        return ""
    s = str(v).strip().upper()
    return s[:-2] if s.endswith(".0") else s


def ler_excel(caminho):
    wb = openpyxl.load_workbook(caminho, data_only=True)
    medias = wb["Médias"]
    jogadores = [str(medias.cell(r, 5).value or f"Jogador {r - 2}").strip() for r in range(3, 11)]

    # Data de atualização: usa a célula C13 da folha Médias, ou a data de hoje
    data = medias["C13"].value
    if not isinstance(data, (datetime.date, datetime.datetime)):
        data = datetime.date.today()

    boletins = []
    for ws in wb.worksheets:
        if not re.fullmatch(r"\d{8}", ws.title):  # só folhas DDMMAAAA
            continue
        jogos = []
        for r in range(6, 20):
            if r == 19:  # Super 14: célula fundida E19:L19 = palpite comum
                palpites = norm(ws.cell(r, 5).value) or "-"
                palpites = palpites * 8
                nr = "S14"
            else:
                palpites = "".join(norm(ws.cell(r, c).value) or "-" for c in range(5, 13))
                nr = norm(ws.cell(r, 1).value)
            jogos.append([nr, str(ws.cell(r, 2).value or "").strip(), palpites, norm(ws.cell(r, 13).value)])
        boletins.append({"id": ws.title, "g": jogos})

    if not boletins:
        sys.exit("Não encontrei folhas de boletins (nome DDMMAAAA).")
    return {
        "players": jogadores,
        "upd": "Atualizado a " + data.strftime("%d/%m/%Y"),
        "sheets": boletins,
    }


def encontrar_ficheiro():
    """Procura o ficheiro que tem 'const RAW = {...}' (js/script.js, index.html, ...)."""
    candidatos = [PASTA / "js" / "script.js", PASTA / "script.js", HTML]
    candidatos += [p for p in PASTA.rglob("*.js") if "node_modules" not in p.parts]
    for p in candidatos:
        if p.is_file() and re.search(r"const\s+RAW\s*=", p.read_text(encoding="utf-8")):
            return p
    sys.exit("Não encontrei 'const RAW' em nenhum ficheiro (index.html, js/script.js, ...).")


def fim_do_objeto(texto, ini):
    """Dado o índice do '{' inicial, devolve o índice logo a seguir ao '}' que o fecha."""
    prof, aspas, i = 0, None, ini
    while i < len(texto):
        c = texto[i]
        if aspas:
            if c == "\\":
                i += 1
            elif c == aspas:
                aspas = None
        elif c in "\"'`":
            aspas = c
        elif c == "{":
            prof += 1
        elif c == "}":
            prof -= 1
            if prof == 0:
                return i + 1
        i += 1
    sys.exit("Não consegui encontrar o fim do objeto RAW.")


def atualizar_html(dados):
    ficheiro = encontrar_ficheiro()
    texto = ficheiro.read_text(encoding="utf-8")
    m = re.search(r"const\s+RAW\s*=\s*(?=\{)", texto)
    if not m:
        sys.exit(f"Encontrei 'const RAW' em {ficheiro.name}, mas não é um objeto {{...}}.")
    fim = fim_do_objeto(texto, m.end())
    js = json.dumps(dados, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
    texto = texto[:m.end()] + js + texto[fim:]
    if ESCONDER_BOTAO:
        texto = re.sub(
            r"if\s*\(\s*typeof claude\s*===\s*['\"]undefined['\"]\s*\)\s*\$\(\s*['\"]adm['\"]\s*\)\.hidden\s*=\s*false\s*;\s*else\s*",
            ";",
            texto,
        )
    ficheiro.write_text(texto, encoding="utf-8")
    return ficheiro


def main():
    dados = ler_excel(XLSX)
    ficheiro = atualizar_html(dados)
    apurados = sum(1 for s in dados["sheets"] if any(g[3] for g in s["g"]))
    print(f"{ficheiro.relative_to(PASTA)} atualizado: {len(dados['sheets'])} boletins ({apurados} apurados).")
    if "--push" in sys.argv:
        msg = "Atualiza resultados " + datetime.date.today().strftime("%d/%m/%Y")
        subprocess.run(["git", "add", str(ficheiro)], cwd=PASTA, check=True)
        # Se nada mudou face ao último commit, não há nada para enviar
        if subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=PASTA).returncode == 0:
            print("Sem alterações: os dados já estavam atualizados no repositório. Nada a enviar.")
            return
        subprocess.run(["git", "commit", "-m", msg], cwd=PASTA, check=True)
        subprocess.run(["git", "push"], cwd=PASTA, check=True)
        print("Enviado para o GitHub.")


if __name__ == "__main__":
    main()
