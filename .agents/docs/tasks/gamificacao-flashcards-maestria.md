# Plano de Implementação: Gamificação Global, Flashcards & Maestria Clínica

**Referência:** Tópicos 1, 2 (Árvore de Maestria Corporal), 4 (Streak Repair) e 5 (20+ Conquistas de Flashcards)  
**Fluxo:** Orquestrador com Paralelização de Subagentes (Frontend & Backend)  
**Documento Vivo de Engenharia:** `.agents/docs/tasks/gamificacao-flashcards-maestria.md`

---

## 1. Dúvidas Resolvidas e Definições de Negócio (Analista & Domain Expert)

| Item | Regra P-XXX | Decisão de Arquitetura & UX |
| :--- | :--- | :--- |
| **Combo / Foco em Chamas** | **[P-040]** | O contador de combo dispara a partir de 3 acertos seguidos ("Fácil" ou "Médio"). Aos 5x e 10x, ativa partículas e multiplicadores de XP (1.2x, 1.5x, 2.0x). Se errar ou marcar "Difícil", o combo reseta para 0. |
| **Inbox Zero / Fim de Sessão** | **[P-041]** | Ao esvaziar a fila diária de cards, abre modal de celebração com métricas de performance (Cards totais, tempo total, tempo médio/card, % acerto) e efeito confetti. |
| **Bounty Cards ("Cards Sangrentos")** | **[P-042]** | Cards com taxa histórica de erro ≥ 60% ou 2 falhas consecutivas recebem moldura especial carmesim com ícone de mira. Acertá-los rende 3x de XP e pontua para badges de caçador. |
| **Árvore de Maestria Clínica (Corpo Humano)** | **[P-050]** | Componente SVG vetorial no Dashboard principal. Contornos coloridos por especialidade médica e preenchimento (fill) proporcional ao nível de maestria (0% a 100%). Ponderação: Questões e % de acerto (50%), Flashcards e retenção (30%), Aulas assistidas (20%). |
| **Streak Repair (Resgate de Ofensiva)** | **[P-060]** | Usuário que perdeu a ofensiva no dia anterior tem 24h para ativar o "Resgate de Plantão". Ao cumprir uma sessão de estudo intensiva dobrada no dia atual, o streak do dia anterior é restaurado. Limite: 1 resgate a cada 14 dias. |
| **20+ Conquistas de Flashcards** | **[P-070]** | 22 novos badges catalogados no enum `BadgeType` e refletidos no perfil e feed social, cobrindo volume, sequências de combo, Inbox Zero, resgate de Bounty Cards e hábitos horários (Madrugador/Plantão Noturno). |

---

## 2. Mapa de Conquistas de Flashcards (Tópico 5 - 22 Badges)

```java
// backend: BadgeType.java
FLASH_FIRST_STEP("Primeira Sinapse", "Concluiu a primeira sessão de flashcards"),
FLASH_10_CARDS("Aquecimento Neural", "Revisou 10 flashcards no total"),
FLASH_50_CARDS("Impulso Sináptico", "Revisou 50 flashcards no total"),
FLASH_100_CARDS("Córtex Ativado", "Revisou 100 flashcards no total"),
FLASH_250_CARDS("Memória Consolidada", "Revisou 250 flashcards no total"),
FLASH_500_CARDS("Caminho Mielinizado", "Revisou 500 flashcards no total"),
FLASH_1000_CARDS("Enciclopédia Médica", "Revisou 1.000 flashcards no total"),
FLASH_2500_CARDS("Mestre do Active Recall", "Revisou 2.500 flashcards no total"),
FLASH_5000_CARDS("Semideus da Retenção", "Revisou 5.000 flashcards no total"),

FLASH_COMBO_5("Centelha de Foco", "Atingiu um combo de 5 acertos consecutivos"),
FLASH_COMBO_10("Chamas do Saber", "Atingiu um combo de 10 acertos consecutivos"),
FLASH_COMBO_20("Hiperfoco Imbatível", "Atingiu um combo de 20 acertos consecutivos"),

FLASH_INBOX_ZERO_1("Plantão Cumprido", "Zerou a fila diária de flashcards pela 1ª vez"),
FLASH_INBOX_ZERO_7("Semana Impecável", "Zerou a fila diária de revisões por 7 dias seguidos"),
FLASH_INBOX_ZERO_30("Rotina de Ferro", "Zerou a fila diária de revisões por 30 dias seguidos"),

FLASH_BOUNTY_1("Ressuscitação Neural", "Acertou um Bounty Card crítico com histórico de erro"),
FLASH_BOUNTY_10("Caçador de Lacunas", "Acertou 10 Bounty Cards críticos"),
FLASH_BOUNTY_50("Cirurgião de Pontos Cegos", "Acertou 50 Bounty Cards críticos"),

FLASH_EARLY_BIRD("Madrugador da Retenção", "Concluiu uma sessão de flashcards antes das 07:00 da manhã"),
FLASH_NIGHT_OWL("Plantão Noturno", "Concluiu uma sessão de flashcards entre 23:00 e 04:00"),
FLASH_SPEED_DEMON("Reflexo de Pronto-Socorro", "Média inferior a 5s por card em sessão com >85% de acerto"),
FLASH_CREATOR_10("Preceptor de Conteúdo", "Criou 10 flashcards próprios para estudo pessoal");
```

---

## 3. Mapeamento Anatômico & Especialidades (Árvore de Maestria - Tópico 2)

| Especialidade Médica | Região Anatômica do SVG | Cor do Contorno (Design System) | Indicadores Ponderados |
| :--- | :--- | :--- | :--- |
| **Clínica Médica** | Tórax, Pulmões, Coração, SNC / Cérebro | `#3B82F6` (Azul Clínico) | Questões de Clínica, Aulas teóricas de Clínica, Flashcards de Farmaco/Semiologia |
| **Cirurgia Geral** | Abdome, Fígado/TGI, Parede Abdominal, Membros | `#F97316` (Laranja Cirúrgico) | Questões de Cirurgia, Condutas cirúrgicas, Flashcards de Técnicas/Trauma |
| **Pediatria** | Cabeça Infantil, Vias Aéreas Superiores, Eixo Crescimento | `#10B981` (Verde Pediátrico) | Questões de Puericultura/Pediatria, Aulas, Flashcards de Marcos de Desenvolvimento |
| **Ginecologia & Obstetrícia** | Pelve, Sistema Reprodutivo e Urogenital | `#EC4899` (Rosa GO / Magenta) | Questões de Pré-Natal/GO, Aulas de Obstetrícia, Flashcards de Ciclos/Condutas |
| **Medicina Preventiva & Social** | Sistema Circulatório-Imune / Silhueta Sistêmica | `#EAB308` (Dourado Preventiva) | Questões de SUS/Epidemio/Bioestatística, Aulas e Flashcards Preventivos |

### Hierarquia de Tiers de Maestria Anatômica:

| Nível / Rank | Faixa de Maestria | Acabamento do Preenchimento (Fill) | Efeito Visual no SVG |
| :--- | :--- | :--- | :--- |
| **Iniciante** | `0% - 14%` | Base Escura Translúcida (`#1E293B` a 15%) | Silhueta neutra com contorno tênue |
| **Bronze** | `15% - 29%` | Gradiente Bronze Metálico (`#CD7F32` / `#8C531B`) | Reflexo metálico opaco |
| **Prata** | `30% - 44%` | Gradiente Prata Acetinado (`#E0E0E0` / `#94A3B8`) | Reflexo prateado suave |
| **Ouro** | `45% - 59%` | Gradiente Dourado Real (`#FFD700` / `#D4AF37`) | Glow dourado constante |
| **Platina** | `60% - 74%` | Gradiente Platina Luminescente (`#E5E4E2` / `#64748B`) | Aura luminosa azulada/fria |
| **Rubi** | `75% - 84%` | Gradiente Rubi Escarlate (`#E0115F` / `#881337`) | Pulsar rítmico escarlate |
| **Esmeralda** | `85% - 94%` | Gradiente Esmeralda Radiante (`#10B981` / `#065F46`) | Partículas de bioenergia verde |
| **Diamante** | `95% - 100%` | Gradiente Diamante Prismático (`#B9F2FF` / `#38BDF8`) | Brilho estelar e prisma cromático |

### Fórmula de Maestria da Especialidade ($M_{esp} \in [0, 100]\%$):
$$M_{esp} = \min\left(100, \; \Big(0.50 \cdot P_{questoes} + 0.30 \cdot P_{flashcards} + 0.20 \cdot P_{aulas}\Big) \cdot F_{volume}\right)$$
Onde:
* $P_{questoes} = \% \text{ de acerto na especialidade}$
* $P_{flashcards} = \% \text{ de retenção da especialidade (cards fáceis/médios vs difíceis)}$
* $P_{aulas} = \frac{\text{Aulas concluídas}}{\text{Total de aulas da especialidade}} \times 100$
* $F_{volume} = \text{fator de escala para garantir que o aluno precise de volume mínimo de estudo para atingir o nível máximo.}$

---


## 4. Estratégia de Paralelização com Subagentes

```
                       [Orquestrador Central]
                                 │
     ┌───────────────────────────┴───────────────────────────┐
     ▼                                                       ▼
[Subagente A: Backend]                                [Subagente B: Frontend]
(Spring Boot / Java / Postgres)                       (Angular / TypeScript / SCSS)
- Migrations: streak_repair & badges                  - Animação de Combo na sessão
- Service de Maestria por Especialidade               - Modal Inbox Zero com celebração
- Motor de Streak Repair (verificação de janela)       - SVG Interativo do Corpo Humano
- Implementação dos 22 novos BadgeTypes               - Card de Streak Repair no Dashboard
- Testes Unitários de Backend (JUnit)                 - Catálogo e badges no perfil
- Estado: STATE_Backend.md                            - Estado: STATE_Frontend.md
     │                                                       │
     └───────────────────────────┬───────────────────────────┘
                                 ▼
                     [Sincronização & Merge]
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
         [Code Review & SecOps]         [UX Review & Vibe Check]
                  │                             │
                  └──────────────┬──────────────┘
                                 ▼
                    [Auto-Healer Loop & Testes]
                                 │
                                 ▼
                     [Release via PR / DevOps]
```
