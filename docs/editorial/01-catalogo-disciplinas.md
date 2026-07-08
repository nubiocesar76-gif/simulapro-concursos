# 01 — Catálogo Oficial de Disciplinas (Cargo: Enfermeiro)

> **ERRATA V1.1 (auditoria H1 — `docs/editorial/auditoria/H1-auditoria-editorial.md`):**
> a tabela abaixo é o catálogo **V1.0** e foi mantida intacta por
> rastreabilidade histórica, mas **não reflete mais a estrutura vigente**.
> A lista corrigida (21 disciplinas ativas, com fusões/remoções/rebaixamento)
> está em `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md` e nos
> dados normalizados `docs/editorial/normalized/01-disciplinas.json`.
> Resumo das mudanças: Saúde do Adulto (#20) foi absorvida por Enfermagem
> Médico-Cirúrgica (#7, renomeada "Enfermagem Clínica e Cirúrgica do
> Adulto"); Anatomia e Fisiologia (#2) deixou de ser disciplina curricular
> (virou material de apoio); Biossegurança (#3) e Controle de Infecção
> Hospitalar (#5) foram fundidas; Legislação do SUS (#13) e Políticas
> Públicas de Saúde (#14) foram fundidas; Imunização (#11) foi rebaixada a
> assunto dentro de Saúde Coletiva (#17).

Lista canônica, na ordem de `taxonomy.json`. "Peso" é uma faixa qualitativa
de participação típica na parte de Conhecimentos Específicos (não da prova
inteira). Detalhamento completo de cada uma nos dossiês `02a`–`02l`.

| # | Disciplina (nome canônico) | Slug | Peso típico | Dossiê |
|---|---|---|---|---|
| 1 | Administração em Enfermagem | `administracao-em-enfermagem` | Médio | 02b |
| 2 | Anatomia e Fisiologia | `anatomia-fisiologia` | Baixo–Médio | 02j |
| 3 | Biossegurança | `biosseguranca` | Baixo–Médio | 02a |
| 4 | Centro Cirúrgico e CME | `centro-cirurgico-e-cme` | Médio | 02h |
| 5 | Controle de Infecção Hospitalar | `controle-de-infeccao-hospitalar` | Médio–Alto | 02h |
| 6 | Enfermagem em Doenças Transmissíveis | `enfermagem-em-doencas-transmissiveis` | Médio | 02c |
| 7 | Enfermagem Médico-Cirúrgica | `enfermagem-medico-cirurgica` | Alto | 02e |
| 8 | Ética e Legislação em Enfermagem | `etica-e-legislacao-em-enfermagem` | Alto | 02b |
| 9 | Farmacologia | `farmacologia` | Médio–Alto | 02i |
| 10 | Fundamentos de Enfermagem | `fundamentos-de-enfermagem` | Muito Alto | 02a |
| 11 | Imunização | `imunizacao` | Médio–Alto | 02c |
| 12 | Informática | `informatica` | Baixo | 02l |
| 13 | Legislação do SUS | `legislacao-do-sus` | Alto | 02b |
| 14 | Políticas Públicas de Saúde | `politicas-publicas-de-saude` | Alto | 02b |
| 15 | Português | `portugues` | Médio (Conh. Gerais) | 02l |
| 16 | Raciocínio Lógico | `raciocinio-logico` | Baixo (Conh. Gerais) | 02l |
| 17 | Saúde Coletiva | `saude-coletiva` | Muito Alto | 02c |
| 18 | Saúde da Criança e do Adolescente | `saude-da-crianca-e-do-adolescente` | Alto | 02d |
| 19 | Saúde da Mulher | `saude-da-mulher` | Alto | 02d |
| 20 | Saúde do Adulto | `saude-do-adulto` | Alto | 02e |
| 21 | Saúde do Idoso | `saude-do-idoso` | Médio–Alto | 02e |
| 22 | Saúde Mental | `saude-mental` | Médio–Alto | 02f |
| 23 | Segurança do Paciente | `seguranca-do-paciente` | Alto | 02a |
| 24 | Sistematização da Assistência de Enfermagem (SAE) | `sistematizacao-da-assistencia-de-enfermagem-sae` | Alto | 02k |
| 25 | Terapia Intensiva (UTI) | `terapia-intensiva-uti` | Alto | 02g |
| 26 | Urgência e Emergência | `urgencia-e-emergencia` | Muito Alto | 02g |

## Leitura por "família" (como este documento agrupa os dossiês)

- **Processo de trabalho e base assistencial**: Fundamentos, Semiologia/
  Semiotécnica (dentro de Fundamentos), Biossegurança, Segurança do Paciente,
  SAE (02a, 02k) — é a disciplina "guarda-chuva" que toda banca cobra, porque
  é comum a todos os cenários clínicos.
- **Marco legal, gestão e sistema de saúde**: Ética e Legislação,
  Administração, Legislação do SUS, Políticas Públicas de Saúde (02b) —
  costuma ser o bloco mais "decoreba de lei seca", especialmente em Cebraspe.
- **Saúde pública e vigilância**: Saúde Coletiva, Imunização, Doenças
  Transmissíveis (02c) — forte presença de portarias e programas do MS.
- **Ciclos de vida**: Saúde da Mulher, Saúde da Criança e do Adolescente
  (02d); Saúde do Adulto, Saúde do Idoso, Médico-Cirúrgica (02e).
- **Saúde mental** isolada (02f) porque tem legislação e lógica de rede
  (RAPS) muito própria, raramente se mistura com os ciclos de vida.
- **Alta complexidade e cenários críticos**: Urgência e Emergência, UTI
  (02g); Centro Cirúrgico/CME, Controle de Infecção (02h) — frequentemente
  cobrados juntos porque compartilham protocolos (sepse, PCR, biossegurança).
- **Ciência básica de apoio**: Farmacologia (02i), Anatomia e Fisiologia
  (02j) — sustentam perguntas de todas as outras famílias; ambíguas por
  natureza (ver `05-casos-ambiguos-*.md`).
- **Conhecimentos Gerais**: Português, Raciocínio Lógico, Informática (02l) —
  não são conteúdo de Enfermagem, mas compõem o cargo Enfermeiro na maioria
  dos editais e por isso estão na taxonomia do curso.

## Nota sobre pesos por perfil de órgão

O peso relativo real muda conforme o **tipo de instituição**:

- **Hospital geral / Hospital Universitário (HU)** — maior peso em
  Médico-Cirúrgica, UTI, Urgência/Emergência, Centro Cirúrgico/CME,
  Controle de Infecção.
- **Secretaria Estadual/Municipal de Saúde (atenção básica)** — maior peso em
  Saúde Coletiva, Políticas Públicas, Imunização, Saúde da Mulher/Criança,
  Legislação do SUS.
- **Forças Armadas (Marinha/Exército/Aeronáutica, banca Cebraspe)** — maior
  peso em Urgência/Emergência, Saúde do Adulto, Ética/Legislação, e questões
  de Cebraspe tendem a ser mais "lei seca" (Certo/Errado) em todas as
  disciplinas normativas.
- **Concursos municipais genéricos (prefeituras)** — distribuição mais
  equilibrada, com Saúde Coletiva e Fundamentos como maior peso combinado.

Ver detalhamento quantitativo em `07-frequencia-cobranca-consolidada.md`.
