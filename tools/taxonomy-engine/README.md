# Taxonomy Engine V1

Camada **somente leitura** da taxonomia oficial do SimulaPro. Fonte única autorizada para consulta de bancas, concursos, cargos, disciplinas, assuntos, slugs e ids — sem banco, sem Supabase, sem inferência.

## Objetivo

Centralizar o acesso a `docs/seeds/taxonomy.json` para:

- IA (classificação futura)
- Question Pipeline (validação de campos)
- Ferramentas internas e importadores
- Revisão editorial

O engine **nunca cria, altera ou infere** registros — apenas carrega, valida, consulta e exporta índice.

## Arquitetura

```
docs/seeds/taxonomy.json          ← única fonte de entrada
        │
        ▼
   loader.ts                      ← parse + buildIndex + validação
        │
        ├── validator.ts            ← integridade referencial e duplicatas
        ├── lookup.ts             ← findBoard, findSubject, findById…
        ├── search.ts             ← busca por nome parcial e sinônimos
        └── export.ts             ← taxonomy.index.json
                │
                ▼
        taxonomy.index.json       ← consultas rápidas (opcional)
```

## Estrutura

```
tools/taxonomy-engine/
├── README.md
├── taxonomy.index.json           ← gerado por export.ts
├── src/
│   ├── types.ts
│   ├── loader.ts
│   ├── validator.ts
│   ├── lookup.ts
│   ├── search.ts
│   └── export.ts
└── tests/
    └── taxonomy-engine.test.ts
```

## IDs oficiais

Como o seed não possui ids numéricos, o engine gera ids estáveis:

| Entidade | Formato |
|---|---|
| Curso | `course:{courseSlug}` |
| Cargo | `position:{courseSlug}:{positionSlug}` |
| Disciplina | `subject:{courseSlug}:{subjectSlug}` |
| Assunto | `topic:{courseSlug}:{subjectSlug}:{topicSlug}` |
| Banca | `board:{boardSlug}` |
| Concurso | `contest:{boardSlug}:{contestSlug}` |

## Fluxo

1. **Carregar:** `loadTaxonomyIndex()` lê `docs/seeds/taxonomy.json`, valida e monta índices em memória.
2. **Consultar:** funções em `lookup.ts` e `search.ts` retornam registros oficiais.
3. **Exportar:** `exportTaxonomyIndex()` grava `taxonomy.index.json` para cold start rápido.

### Exemplo

```typescript
import { loadTaxonomyIndex } from "./src/loader.ts";
import { findBoard, findSubject, findTopic } from "./src/lookup.ts";
import { search } from "./src/search.ts";

const index = await loadTaxonomyIndex();

findBoard(index, { slug: "ibfc" });
findSubject(index, { subjectSlug: "portugues" });
findTopic(index, {
  courseSlug: "enfermagem",
  subjectSlug: "portugues",
  topicSlug: "interpretacao-de-texto",
});
search(index, "biosseg", { kind: "subject", limit: 5 });
```

### Gerar índice

```bash
npx tsx tools/taxonomy-engine/src/export.ts
```

### Testes

```bash
node --import tsx --test tools/taxonomy-engine/tests/taxonomy-engine.test.ts
```

## Validações

| Check | Descrição |
|---|---|
| `estrutura_invalida` | JSON ou schema Zod inválido |
| `slug_duplicado` | Slug repetido no mesmo escopo |
| `nome_duplicado` | Nome repetido entre bancas |
| `id_duplicado` | Id repetido no índice |
| `referencia_inexistente` | Concurso → banca ou assunto → disciplina inexistente |
| `concurso_sem_banca` | `boardSlug` não cadastrado |
| `cargo_sem_curso` | Curso sem cargos |

## Integração futura com IA

1. IA recebe enunciado + alternativas.
2. Consulta `search()` / `findSubject()` / `findTopic()` contra índice oficial.
3. Preenche `classification.template.json` **somente** com slugs/nomes validados.
4. `pipeline:merge` rejeita valores fora da taxonomia.

Sinônimos: campo `synonyms[]` reservado em cada registro — quando populado no seed, `search()` indexará automaticamente.

## Limitações V1

- Somente leitura de `docs/seeds/taxonomy.json`
- Sinônimos vazios até próxima sprint de enriquecimento do seed
- Não substitui `convert:questions` nem `seed:taxonomy` existentes
- Dois registros FGV (`fgv` e `fundacao-getulio-vargas`) coexistem conforme seed oficial
