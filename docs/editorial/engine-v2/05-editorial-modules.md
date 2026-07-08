# 05 — Editorial Modules

## 1. Conceito

Um **Editorial Module** é uma categoria de referência normativa/técnica que
alguns cursos precisam e outros não. Em vez de a Engine ter tabelas fixas
(`legislacoes`, `portarias`, `protocolos`, `programas` — o que fazia
sentido só para Enfermagem), ela tem **uma tabela genérica de referências**
(`EditorialReference`, ver `02-entidades-genericas.md` §10) e um catálogo
pequeno e estável de módulos que tipam essas referências.

Cada curso ativa apenas os módulos que fazem sentido para ele
(`CourseModuleActivation`). Isso é o que permite que a mesma Engine sirva
Enfermagem (precisa de Medicamentos e Protocolos) e Direito (precisa de
Jurisprudência e não precisa de Medicamentos) sem nenhuma mudança de
schema.

## 2. Catálogo de Módulos (base inicial)

| Módulo | O que cobre | Campos extras típicos (`detalhes`) |
|---|---|---|
| **Legislação** | Leis, decretos, resoluções, normas regulamentadoras de qualquer área | tipo_norma (LEI/DECRETO/RESOLUCAO/RDC/NR), número, ano, ementa |
| **Protocolos** | Protocolos clínicos/técnicos/operacionais não numerados como lei (ex.: Protocolo de Manchester, checklist de auditoria contábil) | etapas, bundle, referência bibliográfica |
| **Programas** | Programas e políticas nomeadas de um órgão (PNI, Previne Brasil, programas de compliance, programas educacionais) | órgão gestor, público-alvo, ano de instituição |
| **Medicamentos** | Fármacos e classes terapêuticas | princípio_ativo, classe_terapeutica, via_administracao |
| **Fórmulas** | Expressões matemáticas/físicas/financeiras/farmacológicas reutilizáveis | expressao, variaveis, unidade, área_de_origem |
| **Jurisprudência** | Súmulas, acórdãos, precedentes, repercussão geral | tribunal, número_processo, tese_fixada |
| **Normas Técnicas** | ABNT, ISO, normas de engenharia/qualidade/contabilidade | entidade_normativa (ABNT/ISO/CPC/NBC), número |
| **Organismos** | Conselhos de classe, tribunais, agências reguladoras, entidades certificadoras | sigla, competência, jurisdição |
| **Terminologia** | Dicionário de sinônimos/siglas/jargão especializado do curso | (usa as entidades Synonym/Acronym diretamente, não EditorialReference) |

Este catálogo é **extensível**: novo curso pode propor um módulo novo (ex.:
"Casos Clínicos Padrão" para Medicina, "Peças Processuais Modelo" para
Direito) sem quebrar os cursos já existentes — é apenas mais uma linha em
`EditorialModule` e, se necessário, mais um `CourseModuleActivation`.

## 3. Matriz de ativação por curso (exemplos, incluindo os citados no briefing)

| Curso | Legislação | Protocolos | Programas | Medicamentos | Fórmulas | Jurisprudência | Normas Técnicas | Organismos | Terminologia |
|---|---|---|---|---|---|---|---|---|---|
| Enfermagem | ✔ | ✔ | ✔ | ✔ | — | — | ✔ (RDC/NR) | ✔ (COFEN/COREN) | ✔ |
| Técnico de Enfermagem | ✔ | ✔ | ✔ | ✔ (nível básico) | — | — | ✔ | ✔ | ✔ |
| Medicina | ✔ | ✔ | ✔ | ✔ | — | — | ✔ | ✔ (CFM/CRM) | ✔ |
| Odontologia | ✔ | ✔ | ✔ | ✔ | — | — | ✔ | ✔ (CFO/CRO) | ✔ |
| Fisioterapia | ✔ | ✔ | ✔ | — | — | — | ✔ | ✔ (COFFITO) | ✔ |
| Direito | ✔ | — | — | — | — | ✔ | — | ✔ (OAB, tribunais) | ✔ |
| Informática | ✔ (LGPD etc.) | — | — | — | ✔ (lógica/algoritmos) | — | ✔ (ISO 27001, ABNT) | — | ✔ |
| Português | — | — | — | — | — | — | — | — | ✔ |
| Matemática | — | — | — | — | ✔ | — | — | — | ✔ |
| Administração | ✔ | — | ✔ | — | ✔ (indicadores) | — | ✔ (ISO 9001) | ✔ (CRA) | ✔ |
| Contabilidade | ✔ | — | — | — | ✔ (índices financeiros) | — | ✔ (CPC/NBC) | ✔ (CFC/CRC) | ✔ |

Leitura da tabela: um "✔" não significa que o curso terá muito conteúdo
naquele módulo — significa apenas que o módulo **existe como opção de
classificação** para esse curso. Um curso de Português nunca vai preencher
`Medicamentos`, então nem aparece na sua lista de módulos ativos — isso
evita que a interface de curadoria mostre categorias vazias sem sentido.

## 4. Exemplo prático de reuso entre cursos (por que isso importa)

- **RDC ANVISA nº 15/2012** (processamento de produtos para saúde) é uma
  única linha em `EditorialReference` (módulo Legislação), vinculada via
  `ReferenceCourse` a Enfermagem, Medicina e Odontologia simultaneamente —
  em vez de existir 3 vezes (uma por curso) como aconteceria se cada curso
  tivesse sua própria tabela fixa de legislação.
- **Cálculo de dose de medicamento** (Enfermagem/Medicina) e **fórmula de
  juros compostos** (Contabilidade/Administração) são ambos, estruturalmente,
  o mesmo tipo de objeto — uma fórmula com variáveis — então ambos vivem no
  módulo **Fórmulas**, só que vinculados a `Topic` diferentes.
- **"CPC"** como sigla: em Direito resolve para "Código de Processo Civil"
  (módulo Legislação); em Contabilidade resolve para "Comitê de
  Pronunciamentos Contábeis" (módulo Normas Técnicas). A entidade `Acronym`
  (arquivo `02-entidades-genericas.md` §9) resolve isso via `course_id`
  escopado — a mesma sigla, dois registros, cada um preso ao seu curso.

## 5. Módulo "Terminologia" como generalização do Dicionário Editorial da Fase 2

O `03-dicionario-editorial-sinonimos-siglas.md` (Fase 2) e os arquivos
`05-sinonimos.json` / `06-siglas.json` (Fase 2, normalizados) **não
desaparecem** — eles se tornam a **primeira carga de dados do módulo
Terminologia para o curso Enfermagem**. Nenhum conteúdo é perdido; ele só
passa a viver dentro do contrato genérico (`Synonym`/`Acronym` com
`course_id = Enfermagem`), em vez de em arquivos batizados com o nome da
disciplina.
