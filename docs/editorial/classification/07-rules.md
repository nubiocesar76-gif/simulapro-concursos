# 07 — Regras Editoriais

Regras oficiais numeradas. Toda classificação humana ou futura IA deve ser rastreável a uma regra desta lista.

**Total: 52 regras** (R-001 a R-052).

---

## A. Estrutura taxonômica

| ID | Regra |
|---|---|
| **R-001** | Uma questão possui **exatamente uma disciplina primária**. |
| **R-002** | Um assunto pertence a **exatamente uma disciplina** — nunca duplicar assunto entre disciplinas. |
| **R-003** | Uma questão possui **exatamente um assunto primário** (subassunto é opcional, sprint futura). |
| **R-004** | Uma questão pode possuir **várias keywords** (3–8, ver `04-keywords.md`). |
| **R-005** | Tag secundária de disciplina só é permitida em estudo de caso multi-eixo documentado — registrar em `keywords` como `secundaria:<slug>`. |
| **R-006** | Usar disciplinas V1.1 ativas (`02-subjects.md`) — não classificar em disciplinas mescladas (D05, D11, D14, D20). |
| **R-007** | Slug de import deve existir em `docs/seeds/taxonomy.json` — não inventar slug. |
| **R-008** | Disciplinas exam-specific só com evidência no edital da prova específica. |

---

## B. Desempate e ambiguidade

| ID | Regra |
|---|---|
| **R-009** | Desempate 1º: **verbo/comando** da questão (técnica vs mecanismo vs norma). |
| **R-010** | Desempate 2º: **fonte normativa citada literalmente** no enunciado. |
| **R-011** | Desempate 3º: **sujeito da ação clínica** (RN vs mãe vs idoso vs adulto). |
| **R-012** | Desempate 4º: **cenário assistencial** (APS vs PS vs CC vs UTI). |
| **R-013** | Estudo de caso longo: classificar pelo **desfecho perguntado**, não pelo cenário inteiro. |
| **R-014** | Sigla ambígua (PNI, PE, SAE, IG, AVC): resolver por contexto textual **antes** de aplicar R-009. |
| **R-015** | Fundamentos ↔ Farmacologia: técnica/via/cálculo → D10; mecanismo/classe/RAM → D09. |
| **R-016** | Biossegurança ↔ Segurança do Paciente: proteção profissional/IRAS → D03; meta/PNSP institucional → D23. |
| **R-017** | Ética ↔ Legislação SUS: norma COFEN/exercício profissional → D08; Lei 8.080/8.142/SUS → D13. |
| **R-018** | Urgência ↔ UTI: estabilização inicial/tempo-dependent → D26; monitorização/manutenção crítica → D25. |
| **R-019** | SAE ↔ Fundamentos: NANDA/NOC/NIC/5 etapas → D24; técnica de cuidado → D10. |
| **R-020** | Imunização: sempre assunto de D17 (Saúde Coletiva), nunca disciplina D11. |

---

## C. Criação e reutilização de assuntos

| ID | Regra |
|---|---|
| **R-021** | **Reutilizar** assunto existente quando o conteúdo cobrado já está descrito em `03-topics.md`. |
| **R-022** | **Criar assunto novo** somente quando: (a) 3+ questões do acervo compartilham eixo não coberto; (b) dossiê editorial aprovado; (c) entrada em `02-assuntos.json`. |
| **R-023** | Proibido criar assunto por sinônimo de edital ("Enfermagem Obstétrica" → usar D19). |
| **R-024** | Assunto reparentado V1.1 mantém ID histórico (ex.: D05-A01) — usar ID/nome atual. |
| **R-025** | Anatomia e Fisiologia (D02) não gera assunto — classificar na disciplina clínica aplicada. |

---

## D. Leis

| ID | Regra |
|---|---|
| **R-026** | Lei citada no enunciado → disciplina "dona" conforme `docs/editorial/04-leis-portarias-protocolos-programas-ms.md`. |
| **R-027** | Lei 7.498/1986 e Decreto 94.406 → D08-A01 (nunca D13). |
| **R-028** | Lei 8.080/1990 e 8.142/1990 → D13-A01 (nunca D08). |
| **R-029** | Lei 10.216/2001 → D22-A01 (Reforma Psiquiátrica). |
| **R-030** | ECA (Lei 8.069/1990) → D18-A04. |
| **R-031** | Estatuto do Idoso (Lei 10.741/2003) → D21-A04. |
| **R-032** | Prova anterior à alteração legislativa: registrar `norma:vigencia-historica` em keywords. |

---

## E. Portarias

| ID | Regra |
|---|---|
| **R-033** | Portaria MS → mapear por programa/protocolo, não pelo número isolado. |
| **R-034** | Portaria de PNI/imunização → D17, assuntos D11-A*. |
| **R-035** | Portaria de humanização (PNH) → D13, assunto D14-A02. |
| **R-036** | Portaria de vigilância epidemiológica → D17-A02 (não D06 salvo foco clínico da doença). |
| **R-037** | Portaria revogada: manter referência histórica na explicação com data de vigência. |

---

## F. RDC (ANVISA)

| ID | Regra |
|---|---|
| **R-038** | RDC 63/2011 (BPMS) → D13 (boas práticas em serviços de saúde). |
| **R-039** | RDC 36/2013 e metas de segurança → D23-A01 (Metas Internacionais). |
| **R-040** | RDC de RSS/resíduos → D03-A02 (Gestão de Resíduos). |
| **R-041** | RDC de esterilização/reprocessamento → D04-A05 ou D05-A04 conforme foco (processo vs prevenção IRAS). |

---

## G. Resoluções COFEN

| ID | Regra |
|---|---|
| **R-042** | Res. COFEN 564/2017 (Código de Ética) → D08-A02. |
| **R-043** | Res. COFEN 358/2009 como **processo de enfermagem** → D24-A01 (não D08). |
| **R-044** | Res. COFEN 543/2017 (dimensionamento) → D01-A02 se cálculo; D08-A05 se redação normativa isolada. |
| **R-045** | Res. COFEN 429/2012 (auditoria) → D08-A05 ou D01-A04 conforme foco (ética/auditoria vs gestão qualidade). |
| **R-046** | Resolução COFEN citada sem contexto: preferir D08-A05 até desambiguação. |

---

## H. Protocolos e programas MS

| ID | Regra |
|---|---|
| **R-047** | Protocolo clínico de urgência (sepse, AVC, IAM) → D26-A03, salvo UTI manutenção → D25. |
| **R-048** | Protocolo Manchester/classificação de risco → D26-A01. |
| **R-049** | Programa PNI/calendário vacinal → D17, assunto D11-A01. |
| **R-050** | Protocolo de bundling IRAS → D03/D05-A04 (prevenção), não D23. |
| **R-051** | Política Nacional (PNAB, PNH, PNSP) → D13 (assunto conforme `03-topics.md` D14-A*). |

---

## I. Governança e qualidade

| ID | Regra |
|---|---|
| **R-052** | Toda nova ambiguidade identificada em revisão de prova deve gerar proposta de regra R-0XX neste arquivo antes do seed. |

---

## Resumo por categoria

| Categoria | IDs | Quantidade |
|---|---|---|
| Estrutura taxonômica | R-001 – R-008 | 8 |
| Desempate e ambiguidade | R-009 – R-020 | 12 |
| Criação/reutilização assuntos | R-021 – R-025 | 5 |
| Leis | R-026 – R-032 | 7 |
| Portarias | R-033 – R-037 | 5 |
| RDC | R-038 – R-041 | 4 |
| Resoluções COFEN | R-042 – R-046 | 5 |
| Protocolos e programas | R-047 – R-051 | 5 |
| Governança | R-052 | 1 |
| **Total** | | **52** |

---

## Hierarquia de precedência

Em conflito entre regras:

1. R-001 a R-008 (estrutura) — invioláveis
2. R-026 a R-051 (normativos específicos citados no enunciado)
3. R-009 a R-020 (desempate)
4. R-021 a R-025 (assuntos)
5. R-052 (governança — processo, não desempate)
