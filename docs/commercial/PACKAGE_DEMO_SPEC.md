# PACKAGE_DEMO_SPEC — Estrutura do Package Demo

**Fase:** 9 — Sprint P1.1
**Documento:** Especificação pronta para instanciar o Package Demo (Alternativa E, `FREEMIUM_ARCHITECTURE.md`)
**Data:** 2026-07-15
**Escopo:** apenas estrutura/especificação. Nenhuma questão foi copiada ou importada. Nenhuma distribuição foi criada. Nada foi publicado ou liberado para usuários.

---

## 0. Achado que determina o formato desta entrega

Antes de especificar o Package Demo, verifiquei como `packages` e `package_versions` são criados hoje no sistema, para não propor nada fora do que a arquitetura já suporta:

- **O pipeline de seed de questões (`scripts/seed/questions/`) não cria `packages`/`package_versions` — ele só os *lê*.** `resolveQuestionTaxonomyIds` (`scripts/seed/questions/entities.ts`) chama `resolvePackageVersion`, que faz uma consulta somente leitura e **lança erro se o pacote/versão não existir** (`scripts/seed/taxonomy/entities.ts:145-170`). Ou seja, seedar uma questão pressupõe que o pacote e a versão já existem — não os cria.
- **O seed de taxonomia (`docs/seeds/taxonomy.json`) também não contém `packages`/`package_versions`** — confirmado lendo o arquivo: as únicas chaves de topo são `metadata`, `courses`, `boards`, `contests`.
- **`packages` e `package_versions` são entidades geridas exclusivamente pelo Portal Admin** (`src/components/admin/packages/PackagesPage.tsx`, `src/components/admin/versions/VersionsPage.tsx`), via formulário — não existe hoje nenhum caminho de arquivo/seed para criá-los.

**Consequência para esta sprint:** criar um `package`/`package_version` de verdade no banco, hoje, só é possível de duas formas — (a) pelo Portal Admin (ação manual do fundador, sem nenhum código), ou (b) por um script/insert direto no banco que contorne o Admin (o que seria alterar a arquitetura de criação de conteúdo já estabelecida, e escreveria diretamente no banco — as duas coisas que esta sprint proíbe explicitamente). Por isso, esta entrega é a **especificação completa e pronta para uso**, não uma linha em uma tabela — instanciá-la é uma ação de poucos minutos no Admin já existente, descrita na seção 4, sem exigir nenhuma linha de código.

---

## 1. Package

| Campo (Admin) | Valor |
|---|---|
| Nome | Primeiro Simulado Grátis |
| Slug | `primeiro-simulado-gratis` (gerado automaticamente a partir do nome pelo próprio formulário do Admin — confirmar que bate com o esperado) |
| Descrição | Experiência gratuita oficial do SimulaPro. |
| Curso | Enfermagem (mesmo curso do Acervo pago — reaproveita a taxonomia existente, conforme Alternativa E) |

---

## 2. Package Version

| Campo (Admin) | Valor |
|---|---|
| Pacote | Primeiro Simulado Grátis (o pacote acima) |
| Número da versão | 1.0 |
| Status | **Ver nota abaixo — não é "ACTIVE"** |

**Nota sobre o status — correção necessária em relação ao briefing:** o enum real de `package_version_status` no banco é `DRAFT | READY | PUBLISHED | ARCHIVED` — **não existe o valor "ACTIVE"** (esse valor existe para `distribution_status`, uma tabela diferente, não confundir). Como esta sprint explicitamente proíbe "publicar" e "criar distribuição", o status correto para esta etapa é **`DRAFT`** (ou, no máximo, `READY` se o fundador quiser sinalizar "pronta para receber as questões, mas ainda não publicada"). Usar `PUBLISHED` agora seria o oposto do que a sprint pede.

---

## 3. Questões

**Nenhuma questão foi criada, copiada, escolhida ou importada nesta sprint.** O Package Version acima é criado vazio, exatamente como pedido — pronto para, em uma sprint futura, receber as 20 questões curadas (ver `FREEMIUM_STRATEGY.md` §2 para os critérios de escolha já definidos, e `FREEMIUM_ARCHITECTURE.md` §5 para a técnica de cópia com rastreabilidade).

---

## 4. Metadata — padrão para quando as questões forem copiadas (não aplicado nesta sprint)

Formato a ser gravado no campo `metadata` (já existente em `questions`, `Json | null`, sem alteração de schema — conforme `FREEMIUM_ARCHITECTURE.md` Alternativa E) de cada questão copiada para este Package Version:

```json
{
  "demo": true,
  "origin": {
    "questionId": "<uuid da questão original no Acervo pago>",
    "examId": "<uuid do exame/concurso de origem>",
    "packageVersionId": "<uuid do package_version original (Acervo pago)>",
    "copiedAt": "<timestamp ISO 8601 da cópia>"
  }
}
```

Este padrão é o que permite, no futuro, localizar todas as cópias demo e de qual questão original vieram (`metadata->>'origin'->>'questionId'`), sem precisar de nenhuma coluna nova — exatamente o ganho da Alternativa E sobre a Alternativa A pura.

---

## 5. Como instanciar (ação manual, fora do código)

Para o fundador criar de fato o Package e a Package Version descritos acima:

1. Portal Admin → **Pacotes** → Novo pacote → preencher Nome ("Primeiro Simulado Grátis"), Descrição ("Experiência gratuita oficial do SimulaPro."), Curso (Enfermagem).
2. Portal Admin → **Versões de Pacote** → Nova versão → selecionar o pacote criado no passo 1, Número da versão "1.0", Status `DRAFT`.
3. Não publicar. Não criar distribuição. Não vincular nenhuma questão ainda.

Nenhum desses passos exige código, migration ou alteração de arquitetura — reaproveita exatamente as telas já existentes do Admin.

---

## 6. Confirmações desta sprint

- Nenhuma distribuição foi criada.
- Nenhum usuário tem ou terá acesso a isso automaticamente.
- Nenhuma questão foi tocada — `questions.json` e `taxonomy.json` permanecem inalterados.
- Nenhuma versão existente de nenhum outro pacote foi afetada — esta especificação não referencia nem modifica nenhum `package_version` já publicado.
- Nenhum código foi escrito. Nenhum arquivo do sistema foi alterado.

---

*Fim da especificação. Nenhuma implementação foi iniciada.*
