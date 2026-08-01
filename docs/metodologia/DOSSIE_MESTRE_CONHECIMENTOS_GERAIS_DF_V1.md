# DOSSIÊ MESTRE — CONHECIMENTOS GERAIS SOBRE O DISTRITO FEDERAL — V1

## Objetivo

Base técnica oficial da disciplina "Conhecimentos Gerais sobre o Distrito Federal" do SimulaPro. Diferente das disciplinas anteriores desta fase (todas clínicas/técnicas de enfermagem), esta é uma disciplina de **conhecimentos gerais/regionais**, própria de concursos realizados no âmbito do Distrito Federal (governo do DF, entidades distritais, e frequentemente também exigida em concursos federais sediados no DF, como a EBSERH). Não gera questões, não resume para aluno. É a fonte editorial permanente para o Motor Editorial.

## Achado Editorial (obrigatório registrar — não silenciar)

**Achado — qualidade de dados no acervo real: questões sobre o Acre classificadas como Distrito Federal.** Das 19 questões reais pré-existentes desta disciplina, aproximadamente **10 são sobre o estado do Acre** (geografia, história, população, economia do Acre — ex.: "O Acre é um dos estados com maior diversidade de fauna e flora do país", "Após a assinatura do Tratado de Petrópolis, a área do Acre..."), não sobre o Distrito Federal, todas classificadas sob o tópico "Geografia, Cultura e Economia do DF". Isso indica um erro de importação/classificação anterior a esta sessão (provável mistura com outra disciplina de "Conhecimentos Gerais Regionais" ou prova estadual do Acre). **Tratamento adotado:** conforme a regra desta sessão de nunca alterar silenciosamente conteúdo real já homologado, essas questões **não foram corrigidas, movidas nem excluídas** — apenas identificadas e reportadas por transparência. As ~9 questões reais genuinamente sobre o DF (RIDE/COARIDE, geografia/economia do DF) foram usadas normalmente para checagem de duplicidade. Recomenda-se, como ação de acompanhamento fora do escopo desta sprint, uma auditoria de reclassificação dessas ~10 questões do Acre para a disciplina/tópico correto.

## Fonte de base

Diferente das disciplinas anteriores, não há arquivo `02x` pré-existente em `docs/editorial/` dedicado a Conhecimentos Gerais do DF — este Dossiê Mestre é construído diretamente a partir de legislação distrital vigente e fatos históricos/institucionais consolidados, com a mesma cautela metodológica das disciplinas anteriores (nenhuma citação literal certificada sem conferência da fonte oficial; nenhum dado sujeito a atualização frequente tratado como fixo).

## Sinônimos e palavras-chave

Sinônimos: "Realidades do Distrito Federal", "Conhecimentos Regionais", "Atualidades do DF". Palavras-chave centrais: Lei Orgânica do DF, Região Administrativa (RA), RIDE, COARIDE, Câmara Legislativa do DF (CLDF), Plano Piloto, Regiões Administrativas, Governo do Distrito Federal (GDF), Entorno do DF.

## Assuntos e tópicos (6 `topics` reais: 2 pré-existentes + 4 criados nesta sprint)

1. **Geografia, Cultura e Economia do DF** (pré-existente) — geografia física, aspectos socioeconômicos, cultura, população.
2. **RIDE do Distrito Federal e COARIDE** (pré-existente) — Região Integrada de Desenvolvimento do DF e Entorno, Lei Complementar nº 94/1998, Conselho Administrativo da RIDE.
3. **Lei Orgânica do Distrito Federal** (novo) — a "constituição distrital", promulgada em 8 de junho de 1993, estrutura de poderes, competências.
4. **Regiões Administrativas do DF** (novo) — divisão administrativa do DF (não possui municípios), histórico de criação das RAs, Plano Piloto como RA I.
5. **História e Formação de Brasília** (novo) — mudança da capital, construção, JK, Lúcio Costa, Oscar Niemeyer, tombamento pela UNESCO.
6. **Organização Político-Administrativa e Símbolos Oficiais do DF** (novo) — Governador, Câmara Legislativa do DF, Secretarias, símbolos oficiais (bandeira, brasão, hino).

## Leis, decretos e normas de referência

- **Lei Orgânica do Distrito Federal** (promulgada em 8 de junho de 1993, com emendas posteriores) — norma fundamental do DF, equivalente a uma constituição estadual/municipal combinada (o DF não é dividido em municípios).
- **Lei Complementar nº 94, de 19 de fevereiro de 1998** — cria a Região Integrada de Desenvolvimento do Distrito Federal e Entorno (RIDE), reunindo o DF e municípios de Goiás e Minas Gerais.
- **Constituição Federal de 1988, art. 32** — dispõe que o Distrito Federal não pode ser dividido em municípios, sendo regido por lei orgânica própria.
- Decretos regulamentadores da RIDE/COARIDE (Conselho Administrativo da Região Integrada de Desenvolvimento).
- Legislação distrital sobre símbolos oficiais (bandeira, brasão, hino do DF).

## Casos ambíguos e regra de desambiguação (Fase 4 — checagem cruzada)

- **Conhecimentos Gerais do DF vs. Legislação Aplicada à EBSERH**: a EBSERH é entidade federal com hospitais universitários também no DF; a disciplina de legislação EBSERH trata da lei/estatuto/regimento da própria empresa pública, não da organização político-administrativa do DF. Verificado: `topics` de "Legislação Aplicada à EBSERH" não tratam de RIDE, Lei Orgânica do DF ou Regiões Administrativas — sem sobreposição real.
- **Conhecimentos Gerais do DF vs. Legislação Municipal e Institucional**: o DF não possui municípios (art. 32, CF/1988); a disciplina "Legislação Municipal e Institucional" trata de temas de gestão municipal genéricos/institucionais, não específicos do DF. Verificado: sem tópico específico sobre DF/RIDE/Regiões Administrativas nessa disciplina — sem sobreposição real.
- **Conhecimentos Gerais do DF vs. Políticas Públicas de Saúde**: Políticas Públicas de Saúde trata de programas nacionais de saúde (PNAB, PNH etc.); não há sobreposição temática com organização político-administrativa/geografia/história do DF, exceto menção tangencial eventual ao "Entorno do DF" em contexto de rede de saúde regional — não caracteriza duplicidade.
- **Conhecimentos Gerais do DF vs. "Conhecimentos Gerais Regionais"**: não existe disciplina real com esse nome exato no banco (verificado); o achado mais próximo é justamente a contaminação com questões do Acre (ver Achado Editorial acima), que não constitui uma disciplina formal, apenas um erro de classificação já registrado.

## Nota metodológica

Dados sujeitos a mudança frequente (número exato atual de Regiões Administrativas, população exata, composição exata de secretarias de governo) são tratados com cautela — quando citados, referem-se a fatos estruturais estáveis (ex.: "o DF é dividido em Regiões Administrativas, não municípios" é fato estável; "o DF possui exatamente N Regiões Administrativas" é dado que muda por decreto e não é usado como base de gabarito nas questões novas desta sprint, salvo quando o número específico for parte de um decreto historicamente estável e citável).
