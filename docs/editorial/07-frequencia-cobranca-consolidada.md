# 07 — Frequência de Cobrança Consolidada (Disciplina × Banca)

Escala: **MA** (Muito Alta) · **A** (Alta) · **M** (Média) · **B** (Baixa) ·
**R** (Residual/eventual). Valores são priors editoriais (ver metodologia em
`00-hierarquia-e-metodologia.md` §3) — recalibrar com dados reais do Acervo
conforme provas forem importadas.

| Disciplina | IBFC | FGV | Consulplan | IDECAN | VUNESP | Cebraspe | AOCP | FUNDEP | Avalia | FAFIPA |
|---|---|---|---|---|---|---|---|---|---|---|
| Fundamentos de Enfermagem | MA | A | A | A | A | M | MA | A | MA | MA |
| Biossegurança | M | M | M | M | M | M | A | M | M | M |
| Segurança do Paciente | A | A | M | M | A | M | A | M | M | B |
| SAE | M | A | A | MA | M | M | M | A | B | B |
| Ética e Legislação em Enfermagem | A | A | A | A | A | MA | A | M | A | A |
| Administração em Enfermagem | M | M | M | M | M | M | M | M | B | B |
| Legislação do SUS | A | A | A | M | MA | MA | M | M | A | A |
| Políticas Públicas de Saúde | A | A | A | M | A | A | M | M | M | M |
| Saúde Coletiva | MA | A | A | M | MA | A | MA | M | MA | MA |
| Imunização | A | M | M | M | M | M | A | B | M | M |
| Enfermagem em Doenças Transmissíveis | M | M | M | M | M | A | M | B | B | B |
| Saúde da Mulher | A | A | M | M | A | M | M | M | M | M |
| Saúde da Criança e do Adolescente | A | A | M | M | A | M | M | M | M | M |
| Saúde do Adulto | M | A | M | M | M | A | M | A | B | B |
| Saúde do Idoso | M | M | B | M | M | B | M | M | B | B |
| Enfermagem Médico-Cirúrgica | M | A | M | M | M | M | M | A | B | B |
| Saúde Mental | M | M | M | A | B | B | M | M | B | B |
| Urgência e Emergência | M | A | M | M | M | MA | M | M | B | B |
| Terapia Intensiva (UTI) | B | A | B | M | B | A | B | M | R | R |
| Centro Cirúrgico e CME | B | M | B | M | B | B | M | M | B | R |
| Controle de Infecção Hospitalar | M | M | M | M | M | M | A | M | B | B |
| Farmacologia | M | A | B | A | M | M | M | A | B | B |
| Anatomia e Fisiologia | B | M | B | B | B | B | B | A | R | R |
| Português (Conh. Gerais) | A | A | A | A | A | A | A | A | A | A |
| Raciocínio Lógico (Conh. Gerais) | M | M | M | M | M | B | M | M | M | M |
| Informática (Conh. Gerais) | M | B | M | M | M | R | M | B | M | M |

## Leitura por perfil de órgão (multiplica/ajusta a tabela acima)

- **Hospital/HU**: aumentar em ~1 nível Médico-Cirúrgica, UTI, Centro
  Cirúrgico/CME, Controle de Infecção; reduzir Políticas Públicas.
- **Atenção básica/SES/Prefeitura**: aumentar em ~1 nível Saúde Coletiva,
  Políticas Públicas, Imunização, Saúde da Mulher/Criança; reduzir UTI e
  Centro Cirúrgico.
- **Forças Armadas (Cebraspe)**: aumentar Urgência/Emergência e Ética/
  Legislação; já refletido na coluna Cebraspe acima.

## Frequência por assunto dentro das disciplinas de maior peso

Para as disciplinas MA/A mais consistentes (Fundamentos, Saúde Coletiva,
Ética e Legislação, Legislação do SUS), a distribuição interna aproximada
de cobrança por assunto (dentro da própria disciplina, somando 100%):

**Fundamentos de Enfermagem**: Administração de Medicamentos/Cálculo (~20%)
· Procedimentos Invasivos (Punção, Sondagem, Terapia IV) (~20%) · Exame
Físico/Sinais Vitais/Semiologia (~15%) · Feridas e Curativos (~12%) ·
Higiene/Mobilização/Prevenção de Quedas e LPP (~15%) · Comunicação/
Cuidado Perioperatório (~10%) · História/Teorias (~8%).

**Saúde Coletiva**: Vigilância em Saúde (Epidemiológica/Sanitária) (~30%) ·
Epidemiologia Aplicada (indicadores, cadeia epidemiológica) (~30%) ·
Determinantes e Promoção da Saúde (~20%) · Planejamento em Saúde (~20%).

**Ética e Legislação em Enfermagem**: Código de Ética (~35%) · Marco Legal
do Exercício Profissional (Lei 7.498/Decreto 94.406) (~30%) · Sistema
COFEN/COREN (~15%) · Responsabilidade Profissional (~20%).

**Legislação do SUS**: Lei 8.080 + Lei 8.142 (~40%) · Princípios e
Diretrizes (~25%) · Gestão e Pactuação (NOB, Pacto, Decreto 7.508) (~20%) ·
Controle Social (~15%).

## Como este arquivo deve ser recalibrado

Cada prova importada e revisada (`docs/work/<prova>/review.json`) deve
contribuir uma contagem real de questões por disciplina/assunto. Quando o
Acervo acumular volume suficiente por banca (sugestão: mínimo 3 provas da
mesma banca para o mesmo cargo), substituir a célula qualitativa (MA/A/M/B/R)
por um percentual real calculado, mantendo a letra como fallback para
bancas ainda com poucas provas importadas.
