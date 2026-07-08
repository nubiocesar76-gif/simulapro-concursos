# 01 — Editorial Engine V2: Visão Geral e Princípios

## Mudança de enquadramento

**V1** produziu um modelo de dados para "o curso de Enfermagem".
**V2** produz um motor (Engine) de classificação editorial que **não sabe o
que é Enfermagem** — ele sabe apenas manipular Cursos, Cargos, Disciplinas,
Assuntos, Módulos Editoriais e Regras. Enfermagem passa a ser **uma
configuração de dados carregada dentro da Engine**, tecnicamente idêntica a
qualquer outro curso futuro (Medicina, Direito, Português, Matemática,
Administração, Contabilidade, Informática, Odontologia, Fisioterapia etc.).

Isto é o mesmo tipo de virada que separar "o WordPress" de "um blog
específico feito em WordPress": o motor é genérico; o conteúdo é dado.

## Princípio 1 — Nenhuma entidade estrutural é exclusiva de um curso

Toda entidade do V1 que continha uma suposição implícita de "isto é
Enfermagem" foi revisada:

| Conceito no V1 | Suposição escondida | Correção no V2 |
|---|---|---|
| `Disciplina` (tabela plana com 26 linhas) | Linhas eram nomes fixos de matérias de enfermagem | `Disciplina` é uma entidade vazia de conteúdo, sempre escopada por `course_id`; o conjunto de 26 disciplinas de Enfermagem vira **dado carregado**, não schema |
| `Português`, `Raciocínio Lógico`, `Informática` como disciplinas do curso Enfermagem | Assumia que "Conhecimentos Gerais" pertence a um curso específico | Viram **Disciplinas Transversais**, compartilháveis N:N entre cursos (ver `02-entidades-genericas.md`) |
| `Leis`, `Portarias`, `Protocolos`, `Programas` como 4 tabelas fixas | Assumia que toda profissão regulada tem exatamente essas 4 categorias normativas | Viram **Módulos Editoriais** plugáveis — um curso ativa só os módulos que faz sentido (`05-editorial-modules.md`) |
| `Perfil de Bancas` com "disciplinas predominantes" embutidas no perfil da banca | Assumia que o estilo de uma banca (Cebraspe = Certo/Errado) é a mesma coisa que sua ênfase temática em Enfermagem | Banca vira entidade global (formato, estilo) + `BoardCourseProfile` por curso (ênfase temática) |
| Regras de classificação com `disciplina_id` fixo em enfermagem | Assumia vocabulário de saúde | Regras continuam com a mesma forma (SE/ENTÃO/confiança), mas agora carregam `course_id` e podem ser **transversais** (ex.: regra de Português vale para qualquer curso) |
| Dicionário editorial (sinônimos/siglas) como arquivo único de Enfermagem | Siglas colidem entre cursos (ex.: "CPC" = Código de Processo Civil em Direito, mas = Comitê de Pronunciamentos Contábeis em Contabilidade) | Sinônimos e siglas passam a ser **escopados por curso ou marcados como globais**, com desambiguação por `course_id` além de por contexto textual |

## Princípio 2 — Toda entidade de conteúdo carrega proveniência e confiança

No V1, uma disciplina ou uma regra "existia ou não existia" — não havia
conceito de "o quão confiável é esse dado" nem "de onde ele veio". Isso
funciona para uma prova de conceito, mas não para um motor que vai:
- receber contribuições de múltiplas fontes (curadoria humana, extração de
  provas reais, sugestão de IA);
- crescer por anos;
- precisar decidir automaticamente o que publicar sem revisão humana e o
  que precisa de revisão.

V2 introduz **origin, confidence, evidenceCount** como atributos de
primeira classe em disciplina, assunto e regra (detalhado em
`04-evidencias-confianca-evolucao.md`), permitindo que a Engine trate de
forma diferente:
- um assunto proposto por um curador humano com 0 evidências (prior
  editorial, como tudo que foi construído nas Fases 1–2 para Enfermagem);
- um assunto confirmado por 40 questões reais de provas importadas
  (evidência forte);
- um assunto sugerido por um classificador de IA ainda não revisado por
  humano (baixa confiança, fila de revisão).

## Princípio 3 — Tudo é versionado, nada é sobrescrito silenciosamente

No V1, atualizar uma regra ou uma disciplina significava editar o arquivo.
Isso é aceitável para um documento de pesquisa, mas inaceitável para um
motor em produção: se uma regra de classificação muda, todo o histórico de
questões já classificadas com a regra antiga fica órfão de contexto.

V2 exige que toda mudança de conteúdo estrutural gere uma nova versão
rastreável (ver `03-metadados-e-versionamento.md`), com `engineVersion` no
nível do motor e `updatedAt`/`createdBy`/`source` no nível de cada registro.

## Princípio 4 — Módulos Editoriais substituem tabelas fixas por domínio

O V1 tinha 4 tabelas fixas (Leis, Portarias, Protocolos, Programas) porque
isso é o que Enfermagem precisa. Direito precisa de Jurisprudência.
Matemática precisa de Fórmulas. Informática precisa de Normas Técnicas
(ISO). V2 substitui as 4 tabelas por **uma entidade genérica de referência
normativa, tipada por Módulo Editorial ativo no curso** — descrito em
inteiro detalhe em `05-editorial-modules.md`.

## Princípio 5 — A Engine é o software; o curso é a configuração

Formalmente:

```
Editorial Engine (versão do motor: schema + regras de negócio + pipeline)
 └─ Course Configuration (dado carregado por curso)
     ├─ Course (Enfermagem | Medicina | Direito | ...)
     ├─ Positions ativos
     ├─ Módulos Editoriais ativos
     ├─ Disciplinas (próprias do curso OU vinculadas de um pool transversal)
     ├─ Assuntos / Subassuntos / Palavras-chave
     ├─ Regras de Classificação
     ├─ Casos Ambíguos
     ├─ Matriz de Co-ocorrência
     └─ Perfis de Banca por Curso (BoardCourseProfile)
```

Enfermagem, tal como construída nas Fases 1–2, é **a primeira Course
Configuration carregada nessa Engine** — e o trabalho da Fase 3 é garantir
que carregar uma segunda (Direito, por exemplo) não exija nenhuma mudança de
schema, apenas inserção de dados + ativação de módulos.

## O que NÃO muda

- A hierarquia de granularidade **Disciplina → Assunto → Subassunto →
  Palavra-chave** continua sendo o esqueleto certo — é genérica por
  natureza (toda prova organiza conteúdo em matéria → tema → subtema).
- A lógica de **regras SE/ENTÃO com confiança** continua sendo o mecanismo
  certo de classificação automática — o que muda é que a regra carrega mais
  metadados, não que a lógica de match mude.
- A ideia de **casos ambíguos com regra de desempate** e **matriz de
  co-ocorrência** continuam sendo mecanismos universais — toda prova de
  concurso tem termos ambíguos e assuntos que aparecem juntos,
  independentemente da área.
- O pipeline de ingestão de provas reais (`docs/work/<prova>/...`) já era
  agnóstico de curso — ele processa PDF → texto → questões → revisão,
  independentemente de a prova ser de Enfermagem ou de Direito. A Fase 3
  não precisa alterar esse pipeline, apenas garantir que seu output
  (`review.json`) alimente as entidades genéricas corretas via `course_id`.
