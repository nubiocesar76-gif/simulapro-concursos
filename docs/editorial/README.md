# Arquitetura Editorial Oficial — Curso de Enfermagem (SimulaPro)

Este diretório é a **base editorial permanente** usada pelo Motor Editorial do
SimulaPro para classificar, organizar e revisar questões de concursos públicos
de Enfermagem no cargo **Enfermeiro**. Ele não é um resumo de conteúdo de
estudo — é um documento de **engenharia de taxonomia**: como as bancas
organizadoras realmente rotulam, agrupam e cobram o conhecimento, para que a
classificação de questões no banco de dados seja consistente, auditável e
estável ao longo dos anos.

Referência viva: `docs/seeds/taxonomy.json` (fonte de verdade estrutural —
disciplinas/assuntos/cargos que existem hoje no banco). Este documento explica
o **porquê** de cada categoria, suas variações entre bancas, e as regras de
classificação que o `taxonomy.json` deve seguir quando for expandido.

## Bancas de referência analisadas

IBFC · FGV · Consulplan/Consulpam · IDECAN · VUNESP · Cebraspe (CESPE) ·
AOCP · FUNDEP (Gestão de Concursos UFMG) · Avalia (Avança SP / Instituto
Avalia) · FAFIPA — complementadas, onde relevante, pelas demais bancas já
presentes em `taxonomy.json` (Quadrix, IADES, FCC, Cesgranrio, IBFC, FUNDATEC,
COSEAC, UFPR/NC etc.), porque o Acervo do SimulaPro (`docs/catalog/enfermagem.csv`)
já inclui provas dessas organizadoras.

## Como este diretório está organizado

| Arquivo | Conteúdo | Itens do briefing cobertos |
|---|---|---|
| `00-hierarquia-e-metodologia.md` | Estrutura oficial do curso, cargo Enfermeiro, hierarquia completa, metodologia de pesquisa por banca | 1, 2, 17 |
| `01-catalogo-disciplinas.md` | Lista oficial de todas as disciplinas, com peso relativo e mapeamento para `taxonomy.json` | 3, 18 (visão consolidada) |
| `02a-fundamentos-biosseguranca-seguranca-paciente.md` | Fundamentos de Enfermagem, Semiologia/Semiotécnica, Biossegurança, Segurança do Paciente | 4–16 |
| `02b-etica-legislacao-administracao-politicas.md` | Ética e Legislação, Administração em Enfermagem, Legislação do SUS, Políticas Públicas de Saúde | 4–16 |
| `02c-saude-coletiva-imunizacao-doencas-transmissiveis.md` | Saúde Coletiva, Imunização, Doenças Transmissíveis | 4–16 |
| `02d-saude-mulher-crianca-adolescente.md` | Saúde da Mulher, Saúde da Criança e do Adolescente | 4–16 |
| `02e-saude-adulto-idoso-medico-cirurgica.md` | Saúde do Adulto, Saúde do Idoso, Enfermagem Médico-Cirúrgica | 4–16 |
| `02f-saude-mental.md` | Saúde Mental | 4–16 |
| `02g-urgencia-emergencia-uti.md` | Urgência e Emergência, Terapia Intensiva (UTI) | 4–16 |
| `02h-centro-cirurgico-cme-controle-infeccao.md` | Centro Cirúrgico e CME, Controle de Infecção Hospitalar | 4–16 |
| `02i-farmacologia.md` | Farmacologia aplicada à Enfermagem | 4–16 |
| `02j-anatomia-fisiologia.md` | Anatomia e Fisiologia | 4–16 |
| `02k-sae-cuidado-clinico-transversal.md` | Sistematização da Assistência de Enfermagem (SAE) como eixo transversal | 4–16 (+ caso ambíguo estrutural) |
| `02l-conhecimentos-gerais.md` | Português, Raciocínio Lógico, Informática | 4–16 |
| `03-dicionario-editorial-sinonimos-siglas.md` | Dicionário editorial mestre: sinônimos, palavras-chave, siglas (visão cruzada entre disciplinas) | 6, 7, 8, 9, 16 |
| `04-leis-portarias-protocolos-programas-ms.md` | Compêndio normativo: leis, portarias, protocolos clínicos, programas do Ministério da Saúde | 10, 11, 12, 13 |
| `05-casos-ambiguos-regras-classificacao.md` | Casos ambíguos entre disciplinas e regras de desempate/classificação | 14, 15 |
| `06-diferencas-entre-bancas.md` | Perfil de estilo, formato e ênfase de cada banca | 19 |
| `07-frequencia-cobranca-consolidada.md` | Matriz de frequência aproximada de cobrança por disciplina/assunto/banca | 18 |
| `08-assuntos-relacionados-co-ocorrencia.md` | Matriz de co-ocorrência: quais assuntos aparecem juntos na mesma questão/prova | 20 |

## Convenções usadas em todos os arquivos

- **Disciplina** = nível `subjects[]` do `taxonomy.json` (equivalente a "matéria").
- **Assunto** = tema dentro da disciplina (nível intermediário; nem sempre
  vira `topics[]` isolado — muitos assuntos são combinações de 2–3 tópicos).
- **Subassunto** = nível `topics[]` do `taxonomy.json` (granularidade de
  cobrança direta em questão).
- `slug-provável`: quando o subassunto ainda não existe em `taxonomy.json`,
  proponho o slug no padrão kebab-case já usado no arquivo, para importação
  direta.
- **Frequência**: escala qualitativa Alta / Média / Baixa / Residual, calibrada
  por leitura cruzada de editais e provas históricas das bancas listadas —
  não é uma contagem estatística de um dataset fechado, é um **prior editorial**
  que deve ser recalibrado à medida que o Acervo (`docs/work/`) for importando
  provas reais (ver `docs/seeds/questions.json` e pipeline em `docs/work/`).
- **Status normativo**: leis/portarias são citadas pelo número oficial; quando
  uma banca costuma cobrar redação antiga (pré-alteração), isso é sinalizado
  explicitamente, pois é fonte comum de recurso/anulação.

## Governança e manutenção

1. Qualquer nova disciplina, assunto ou sinônimo identificado ao revisar uma
   prova real (`docs/work/<prova>/review.json`) deve ser retro-alimentado
   aqui antes de virar `topics[]` em `taxonomy.json`.
2. Mudanças de nomenclatura por lei/portaria nova (ex.: substituição de uma
   portaria por outra) devem ser adicionadas em
   `04-leis-portarias-protocolos-programas-ms.md` com a data de vigência —
   nunca sobrescrever silenciosamente uma referência antiga, porque provas
   antigas do Acervo continuam cobrando a redação vigente à época.
3. Este documento assume o cargo **Enfermeiro** (nível superior, COFEN/CORESP
   ativo). Cargos técnicos (Técnico/Auxiliar de Enfermagem) compartilham ~70%
   da árvore, mas com profundidade e verbo de comando mais operacional — ver
   nota em `00-hierarquia-e-metodologia.md`.
