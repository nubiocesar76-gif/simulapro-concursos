# 04 — Palavras-chave (Keywords)

Regras oficiais para o campo `keywords` em `classification.template.json` e `questions.csv`.

Referência complementar: `docs/editorial/normalized/04-palavras-chave.json`, `05-sinonimos.json`, `06-siglas.json`.

---

## Quantidade

| Situação | Mínimo | Máximo | Observação |
|---|---|---|---|
| Questão padrão | 3 | 8 | Ideal: 4–6 termos |
| Questão normativa (lei/portaria) | 4 | 10 | Incluir número da norma como keyword |
| Questão clínica simples | 3 | 6 | Foco no agravo/procedimento |
| Questão de Português/RLM | 2 | 5 | Tema gramatical ou tipo de raciocínio |
| REVIEW_REQUIRED | 1 | 8 | Incluir `pipeline:REVIEW_REQUIRED` (adicionado pelo merge) |

**Regra:** menos de 3 keywords exige justificativa na revisão humana (exceto CG simples).

---

## Padronização

1. **Idioma:** português, exceto siglas internacionais consagradas (WHO, ISO) e nomes de taxonomias (NANDA, NIC).
2. **Caixa:** minúsculas, exceto siglas (`HIV`, `PNI`, `SUS`).
3. **Separador no CSV:** ponto e vírgula (`;`) entre keywords; vírgula reservada a listas internas raras.
4. **Ordem:** do mais específico ao mais genérico.
   - Ex.: `noradrenalina` → `drogas vasoativas` → `uti` → `monitorização hemodinâmica`
5. **Proibido:** frases completas, enunciado copiado, alternativas copiadas, dados pessoais.
6. **Proibido:** keywords duplicadas ou sinônimos exatos na mesma questão.

---

## Plural

| Tipo | Regra | Exemplo correto | Exemplo incorreto |
|---|---|---|---|
| Conceito contável clínico | plural quando generaliza | `sinais vitais` | `sinal vital` (ok se único) |
| Doença/agravo | singular (nome oficial) | `diabetes mellitus` | `diabetes mellitus do tipo 2` (longo demais) |
| Norma | singular + número | `lei 8080/1990` | `leis do sus` |
| Procedimento | singular | `higienização das mãos` | `higienizações` |
| Sigla | conforme dicionário | `PNI` | `programa nacional de imunizações` (usar só se sigla desconhecida) |

**Regra:** preferir forma consagrada nos dossiês editoriais (`docs/editorial/03-dicionario-editorial-sinonimos-siglas.md`).

---

## Siglas

1. Registrar sigla **e** expansão apenas quando a sigla for ambígua no contexto (ex.: `SAE` + `processo de enfermagem`).
2. Siglas unívocas no domínio: usar só a sigla (`PNI`, `RAPS`, `CAPS`, `ECA`).
3. Siglas com colisão conhecida — **sempre** desambiguar por contexto antes de keyword:
   - `PNI` = Programa Nacional de Imunizações (≠ Perda Não Intencional)
   - `PE` = Pré-eclâmpsia (≠ Profilaxia/Erro)
   - `AVC` = Acidente Vascular Cerebral
   - `SAE` = Sistematização da Assistência de Enfermagem
   - `IG` = Idade Gestacional
4. Formato de norma: `lei 7498/1986`, `res cofen 358/2009`, `rdc 36/2013`, `portaria 2048/2002`.

---

## Sinônimos

1. Escolher **um** termo canônico por questão — não listar sinônimos paralelos.
2. Tabela canônica (usar coluna da esquerda):

| Canônico | Não usar como keyword adicional |
|---|---|
| `sistematização da assistência de enfermagem` | SAE + processo de enfermagem + PE (duplicata) |
| `higienização das mãos` | lavagem das mãos + higiene hand (mistura idioma) |
| `atenção primária à saúde` | ESF + APS + saúde da família (escolher 1–2) |
| `infecção relacionada à assistência à saúde` | IRAS + infecção hospitalar (escolher 1) |
| `classificação de risco` | protocolo de manchester + triagem (máx. 2) |

3. Sinônimos regionais de banca não entram — normalizar para termo editorial.

---

## Keywords especiais

| Keyword | Quando usar |
|---|---|
| `pipeline:REVIEW_REQUIRED` | Automático pelo merge — extração incompleta |
| `difficulty:<valor>` | Automático pelo merge se `difficulty` preenchido |
| `board:ambiguo-fgv` | FGV vs Fundação Getulio Vargas indeterminado |
| `classificacao:revisar` | Classificador (humano/IA) com confiança < 70% |
| `norma:vigencia-historica` | Prova cobra redação antiga de norma |

---

## Checklist rápido de keywords

- [ ] Entre 3 e 8 termos (salvo exceções documentadas)
- [ ] Minúsculas, siglas padronizadas
- [ ] Sem duplicata ou sinônimo redundante
- [ ] Ordem específico → genérico
- [ ] Norma citada incluída quando relevante
- [ ] Nenhum texto copiado do enunciado
