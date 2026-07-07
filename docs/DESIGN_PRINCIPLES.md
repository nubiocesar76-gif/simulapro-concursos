# SimulaPro — Princípios de Design

**Versão:** RC2.0  
**Status:** Referência oficial de UX/UI  
**Escopo:** Todas as decisões futuras de experiência e interface do SimulaPro

---

## 1. Propósito

O SimulaPro é uma plataforma **premium** para preparação para concursos públicos.

A missão é oferecer a experiência de estudo mais **rápida**, **organizada** e **eficiente** possível.

Toda decisão de design deve ajudar o aluno a **estudar melhor** — não a passar mais tempo na plataforma sem propósito.

---

## 2. Público-alvo

O SimulaPro atende candidatos de todos os níveis e áreas:

| Perfil | Exemplos |
|--------|----------|
| **Nível** | Concurseiros iniciantes e avançados |
| **Áreas** | Saúde, segurança pública, tribunais, educação, fiscal, bancária |
| **Amplo** | Qualquer candidato a concurso público |

A interface deve funcionar para quem estuda pela primeira vez e para quem já domina rotinas de revisão intensiva.

---

## 3. Filosofia

> O SimulaPro **não é um jogo**.  
> O SimulaPro **é uma ferramenta profissional**.

Priorizar sempre:

- **Simplicidade** — o essencial, sem ruído
- **Elegância** — visual limpo e confiável
- **Produtividade** — cada tela deve gerar progresso
- **Foco** — mínima distração durante o estudo
- **Velocidade** — carregamento, navegação e ações rápidas

---

## 4. Inspirações

Buscar referência em produtos que valorizam clareza, craft e eficiência:

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Linear](https://linear.app)
- [Notion](https://notion.so)
- [Stripe Dashboard](https://stripe.com)
- [Raycast](https://raycast.com)
- [Arc Browser](https://arc.net)

**Evitar** inspiração em aplicativos gamificados, redes sociais ou interfaces voltadas ao entretenimento.

---

## 5. Princípios

| Princípio | Aplicação |
|-----------|-----------|
| **Menos é mais** | Remover antes de adicionar |
| **Muito espaço em branco** | Respiração visual; evitar telas lotadas |
| **Tipografia excelente** | Hierarquia legível, tamanhos consistentes |
| **Poucas cores** | Paleta contida; cor com intenção |
| **Hierarquia clara** | O mais importante primeiro |
| **Consistência** | Mesmos padrões em Admin e Portal do Aluno |
| **Componentes reutilizáveis** | Shadcn UI + Tailwind; não reinventar padrões |

---

## 6. UX

Regras de experiência:

1. **Cada clique deve economizar tempo** — atalhos, filtros e ações diretas
2. **Nunca aumentar a complexidade** — novas funções não podem poluir fluxos existentes
3. **Evitar telas com excesso de informações** — progressive disclosure quando necessário
4. **Os dados mais importantes sempre aparecem primeiro** — resumo → detalhe → ação

Fluxos críticos (estudar, revisar, ver resultado, histórico) devem exigir o mínimo de passos.

---

## 7. Visual

### Paleta

| Uso | Direção |
|-----|---------|
| **Principal** | Azul — confiança, foco, profissionalismo |
| **Neutros** | Cinzas — fundos, bordas, texto secundário |
| **Sucesso** | Verde — acerto, conclusão, confirmação |
| **Erro** | Vermelho — falha, resposta incorreta, alerta crítico |
| **Aviso** | Amarelo — apenas para avisos; uso restrito |

**Sem excesso de cores.** Cor decorativa sem significado é proibida.

### Tom visual

- Sóbrio, premium, organizado
- Sombras leves; bordas discretas
- Ícones funcionais, não ornamentais

---

## 8. Componentes

Todos os componentes devem compartilhar:

| Atributo | Regra |
|----------|-------|
| **Raio** | Mesmo `border-radius` em cards, botões e inputs |
| **Padding** | Escala consistente (ex.: `p-4`, `p-5`, `p-6`) |
| **Altura** | Botões e inputs alinhados na mesma linha |
| **Tipografia** | Escala fixa: títulos, corpo, legendas |
| **Estados** | Default, hover, focus, disabled, loading, erro — em todos |

Estados vazios, loaders e mensagens de erro seguem o mesmo padrão visual em todo o produto.

---

## 9. Dashboard

O **Dashboard é o centro da plataforma**.

Toda informação exibida deve levar rapidamente a uma **ação**:

- Continuar estudo
- Iniciar sessão filtrada (favoritas, revisar, erradas)
- Acessar distribuição
- Ver histórico e resultados

Métricas sem ação associada não devem ocupar espaço privilegiado.

---

## 10. Questões

**As questões são o produto.**

Todo o restante da interface — taxonomia, pacotes, importação, assinaturas, estatísticas — existe para **facilitar a resolução das questões**.

Na tela de questão:

- Enunciado legível
- Alternativas claras
- Navegação rápida
- Feedback útil (quando aplicável)
- Mínima carga cognitiva

---

## 11. O que NÃO fazer

Não utilizar:

| Proibido | Motivo |
|----------|--------|
| XP | Gamificação superficial |
| Medalhas | Distrai do objetivo (aprovação) |
| Moedas | Modelo de jogo, não de estudo |
| Ranking mundial | Competição irrelevante para o concurseiro |
| Avatar | Personalização sem valor pedagógico |
| Loja | Comercialização dentro do fluxo de estudo |
| Efeitos exagerados | Quebra o tom profissional |
| Animações excessivas | Atrasa e distrai |

---

## 12. O que FAZER

Utilizar:

| Permitido | Benefício |
|-----------|-----------|
| **Estatísticas úteis** | Decisões de estudo baseadas em dados |
| **Metas diárias** | Ritmo e consistência |
| **Evolução** | Progresso visível ao longo do tempo |
| **Filtros inteligentes** | Favoritas, revisar depois, apenas erradas |
| **Atalhos rápidos** | Menos cliques até a ação |
| **Excelente responsividade** | Estudo em desktop, tablet e mobile |

Gamificação saudável = **produtividade mensurável**, não entretenimento.

---

## 13. Definição oficial

> **O SimulaPro é uma plataforma premium de preparação para concursos públicos.**  
> A interface deve transmitir **confiança**, **foco**, **organização** e **alta qualidade**.  
> O objetivo não é entreter o aluno, mas ajudá-lo a **conquistar sua aprovação com eficiência**.

---

## Uso deste documento

- **Product / Design:** validar wireframes e fluxos antes da implementação
- **Desenvolvimento:** consultar antes de criar componentes ou telas novas
- **Homologação:** verificar se entregas respeitam tom, paleta e princípios de UX
- **RC futuras:** qualquer exceção a este documento deve ser documentada e justificada

---

*Documento criado na RC2.0. Não substitui especificações funcionais de sprint; complementa-as como norte de design.*
