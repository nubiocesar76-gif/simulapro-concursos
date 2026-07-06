# Arquivos oficiais de exemplo — Importação RC1

Estes arquivos servem para homologação do módulo **Importação** (`/admin/import`) no projeto RC1.

Todos contêm **as mesmas 5 questões**, vinculadas aos cadastros de taxonomia já existentes no banco:

| Campo no arquivo | Valor no banco RC1 |
|------------------|-------------------|
| Disciplina (`subject`) | Fundamentos de Enfermagem |
| Assunto (`topic`) | Sinais Vitais |
| Banca (`board`) | CEBRASPE |
| Concurso (`exam`) | Prefeitura Municipal de Homologação |
| Cargo (`position`) | Enfermeiro |

> **Curso:** o curso **Enfermagem** é selecionado na tela de importação (campo *Curso* + *Pacote* + *Versão*). Ele **não** faz parte do arquivo — o vínculo do cargo usa o `course_id` do pacote escolhido.

---

## Arquivos disponíveis

| Arquivo | Formato |
|---------|---------|
| `questions-example.csv` | CSV (UTF-8) |
| `questions-example.xlsx` | Excel (primeira aba) |
| `questions-example.json` | JSON (array de objetos) |

---

## Campos obrigatórios

O validador exige a presença de **pelo menos um alias** de cada coluna abaixo:

| Campo canônico | Aliases em português |
|----------------|----------------------|
| `statement` | `enunciado` |
| `alternatives` | `alternativas` |
| `correct_answer` | `gabarito` |
| `subject` | `disciplina` |

### Regras de validação

- **statement / enunciado:** mínimo de 10 caracteres.
- **alternatives / alternativas:** mínimo de 2 opções.
- **correct_answer / gabarito:** uma única letra (`A`, `B`, `C`…) que exista entre as alternativas.
- **subject / disciplina:** obrigatório; se não existir no banco, será criado na aplicação (aviso).

---

## Campos opcionais

| Campo canônico | Aliases em português | Observação |
|----------------|----------------------|------------|
| `topic` | `assunto` | Requer disciplina informada |
| `board` | `banca` | |
| `exam` | `concurso` | Requer banca informada para vínculo |
| `position` | `cargo` | Vinculado ao curso do pacote selecionado |
| `year` | `ano` | Inteiro entre 1900 e 2100 |
| `difficulty` | `dificuldade` | `Fácil`, `Média` ou `Difícil` |
| `explanation` | `explicacao`, `explicação` | |
| `image_url` | `imagem` | URL da imagem (metadado) |
| `bibliography` | `bibliografia` | Referência bibliográfica (metadado) |
| `legal_reference` | `referencia_legal`, `referência_legal` | Base legal (metadado) |

---

## Formato das alternativas

O parser aceita três formatos:

### 1. Texto separado por `|` (recomendado em CSV e XLSX)

```
A) 60 a 100 bpm|B) 110 a 130 bpm|C) 140 a 160 bpm|D) 180 a 200 bpm
```

### 2. Texto com quebras de linha

```
A) Opção A
B) Opção B
C) Opção C
```

### 3. Array JSON (recomendado em JSON)

```json
[
  "A) 60 a 100 bpm",
  "B) 110 a 130 bpm",
  "C) 140 a 160 bpm",
  "D) 180 a 200 bpm"
]
```

Cada alternativa deve iniciar com letra e parêntese (`A)`, `B)`…). Se omitida, o sistema infere `A`, `B`, `C` pela posição.

---

## Como informar o gabarito

Informe **apenas a letra** da alternativa correta, em maiúscula ou minúscula:

| Formato | Exemplo |
|---------|---------|
| CSV / XLSX | `B` |
| JSON | `"correct_answer": "B"` |
| Alias PT | coluna `gabarito` com valor `B` |

O gabarito deve corresponder a uma das letras presentes nas alternativas.

---

## Exemplos por formato

### CSV (`questions-example.csv`)

```csv
statement,alternatives,correct_answer,subject,topic,board,exam,position,year,difficulty,explanation
"Qual é a frequência cardíaca considerada normal...","A) 40 a 50 bpm|B) 60 a 100 bpm|C) 110 a 130 bpm|D) 140 a 160 bpm","B","Fundamentos de Enfermagem","Sinais Vitais","CEBRASPE","Prefeitura Municipal de Homologação","Enfermeiro","2026","Fácil","Em adultos..."
```

### XLSX (`questions-example.xlsx`)

- Primeira planilha do arquivo.
- Cabeçalho na linha 1 com os mesmos nomes de coluna do CSV.
- Campo `alternatives` em uma única célula, com opções separadas por `|`.

### JSON (`questions-example.json`)

```json
[
  {
    "enunciado": "Qual é a frequência cardíaca considerada normal...",
    "alternativas": [
      "A) 40 a 50 bpm",
      "B) 60 a 100 bpm",
      "C) 110 a 130 bpm",
      "D) 140 a 160 bpm"
    ],
    "gabarito": "B",
    "disciplina": "Fundamentos de Enfermagem",
    "assunto": "Sinais Vitais",
    "banca": "CEBRASPE",
    "concurso": "Prefeitura Municipal de Homologação",
    "cargo": "Enfermeiro",
    "ano": 2026,
    "dificuldade": "Fácil",
    "explicacao": "Em adultos..."
  }
]
```

> Os arquivos oficiais usam nomes canônicos em inglês. O JSON acima ilustra que **aliases em português** também são aceitos pelo importador.

---

## Fluxo de homologação sugerido

1. Acesse `/admin/import`.
2. Selecione o curso **Enfermagem**, um pacote e uma versão desse curso.
3. Envie um dos arquivos desta pasta.
4. Valide o relatório (5 válidas, 0 inválidas, 0 duplicadas).
5. Salve o lote e aplique.

---

## Referência técnica

Layout definido em `src/lib/import.ts` (`REQUIRED_COLUMNS`, `mapImportRow`, `IMPORT_COLUMN_HELP`).
