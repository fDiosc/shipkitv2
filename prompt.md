# Prompts do ShipKit 🤖

Este documento centraliza todos os prompts de IA utilizados na plataforma **ShipKit**, detalhando seus objetivos, locais de implementação e o contexto de uso.

---

## 1. Landing Page Everything Builder (AI Magic)

Este é o "Cerebro" principal do ShipKit. Ele é responsável por transformar uma descrição simples de negócio em uma estrutura completa de landing page (Craft.js JSON) com design e copy otimizados para conversão.

- **Localização:** `src/lib/ai/engine.ts` -> Função `generateLandingContent()`
- **Local de Uso:** Dashboard -> New Landing Modal -> Aba "AI Magic"
- **Trigger:** Ao clicar em "Generate with Magic".
- **Novos Parâmetros de Entrada:** Agora recebe `Audience` (Developers, Founders, Marketers, Designers, General) e `Stage` (Pre-launch, MVP, Growth, Scale) para uma copy muito mais segmentada.
- **Objetivo:** Criar um objeto JSON que segue o `LandingSchema`, usando um estilo minimalista inspirado na Linear e Vercel.

### Prompt de Sistema (System Prompt):

Incorporamos regras rígidas de brevidade, paleta de cores e tom de voz para garantir que o resultado seja sempre de alta qualidade.

```text
You are an expert landing page architect specializing in high-conversion SaaS pages.

STYLE REFERENCE: Linear, Vercel, Stripe (2024-2025 minimalist era)
- Clear and direct (no marketing fluff)
- Benefit-driven (not feature-focused)
- Scannable (short sentences, active voice)

═══════════════════════════════════════════════════════════
CRITICAL RULES - FOLLOW EXACTLY
═══════════════════════════════════════════════════════════

1. BREVITY IS MANDATORY:
   ✓ Hero title: 3-8 words maximum
   ✓ Hero subtitle: 12-20 words maximum  
   ✓ Feature title: 2-4 words
   ✓ Feature description: 10-18 words (one clear benefit)
   ✓ NO exclamation marks
   ✓ NO emojis in copy

2. COLORS - CHOOSE FROM APPROVED PALETTE ONLY:
   #2563eb (Blue), #7c3aed (Purple), #059669 (Green), #dc2626 (Red), #ea580c (Orange), #0891b2 (Cyan).

3. NAVIGATION & TONE:
   - Use ONLY these anchors: #features, #pricing, #faq, #contact
   - TONE: Confident but humble, specific, active voice.
   - FORBIDDEN PHRASES: "Revolutionary", "Game-changing", etc.

4. MODULE ACTIVATION:
   IA decide ativar módulos (Pricing, FAQ, Cal.com) apenas quando o contexto do produto exigir.
```

### Prompt do Usuário (User Prompt):

O ShipKit constrói o prompt do usuário dinamicamente com base no contexto injetado pelo `buildUserPrompt`:

```text
PRODUCT DESCRIPTION: {description}
TARGET AUDIENCE: {audience}
{contexto_especifico_da_audiencia}

PRODUCT STAGE: {stage}
{contexto_especifico_do_estagio}

INSTRUCTIONS:
1. Speak directly to {audience} in their language.
2. Tone should match {stage} stage expectations.
3. Value proposition must be crystal clear in 3 seconds.
4. Every element must serve conversion.
```

### Validação de Qualidade
O ShipKit agora monitora a qualidade da saída em tempo real via logs no servidor, verificando se a IA respeitou os limites de palavras e evitou termos proibidos.

### Contexto Técnico (Output Strategy):
O prompt utiliza `generateObject` da biblioteca `ai-sdk` para garantir que a resposta seja um JSON válido que o ShipKit consiga renderizar instantaneamente no editor.

---

### Como o modelo conhece os componentes?

O modelo não "adivinha" os componentes. O ShipKit utiliza o **AI SDK (Vercel)** com a função `generateObject`. Passamos um **Esquema Zod** (`LandingSchema`) diretamente para o modelo. 

Isso significa que o modelo recebe uma definição rigorosa de dados (JSON Schema) que ele **deve** seguir, incluindo descrições de cada campo.

---

## 3. Módulos e Opções Disponíveis

Abaixo estão os módulos que a IA pode ativar ou configurar, conforme definido no `LandingSchema`:

| Módulo | Opções / Campos Principais | Descrição do Comportamento |
| :--- | :--- | :--- |
| **Theme** | `primaryColor`, `backgroundColor` | Define a identidade visual básica. |
| **Header** | `brandName`, `ctaText`, `links` | Menu de navegação e logo. |
| **Hero** | `title`, `subtitle`, `cta` | Seção principal de impacto. |
| **LogoCloud** | `isActive`, `title`, `logos` | Social proof com logos de parceiros/clientes. |
| **FeatureCards** | `title`, `description`, `icon` | Lista de benefícios. Ícones: `zap, shield, rocket, heart, star, sparkles`. |
| **LeadForm** | `placeholder`, `buttonText` | Captura de e-mails (integrado ao Resend). |
| **Pricing** | `isActive`, `title`, `plans` | Tabela de preços. `plans` inclui nome, preço, features e flag `popular`. |
| **FAQ** | `isActive`, `title`, `items` | Perguntas e respostas frequentes. |
| **Cal.com** | `isActive`, `title`, `subtitle`, `calLink` | Agendamento de reuniões/demos. |
| **Footer** | `brandName` | Rodapé com o nome da marca. |

---

## 4. Formato de Retorno Esperado

O modelo retorna um objeto JSON estruturado. O ShipKit então mapeia esse JSON para os componentes visuais do **Craft.js**. 

**Exemplo de JSON gerado pela IA:**

```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "backgroundColor": "#ffffff"
  },
  "header": {
    "brandName": "CloudFlow",
    "ctaText": "Get Started",
    "links": [
      { "label": "Features", "href": "#features" },
      { "label": "Pricing", "href": "#pricing" }
    ]
  },
  "hero": {
    "title": "Streamline your workflow with AI",
    "subtitle": "The all-in-one platform for modern teams.",
    "cta": "Start Free Trial"
  },
  "logoCloud": {
    "isActive": true,
    "title": "Trusted by fast-growing teams",
    "logos": ["Acme", "Globex", "Soylent Corp"]
  },
  "featureCards": [
    {
      "title": "Real-time Sync",
      "description": "Stay in sync with your team effortlessly.",
      "icon": "zap"
    }
  ],
  "pricing": {
    "isActive": true,
    "title": "Flexible Pricing",
    "plans": [
      {
        "name": "Starter",
        "price": "0",
        "description": "For individuals",
        "features": ["1 Project", "Basic Support"],
        "buttonText": "Join Free",
        "popular": false
      }
    ]
  },
  "faq": {
    "isActive": true,
    "title": "Frequently Asked Questions",
    "items": [
      {
        "question": "Is there a free trial?",
        "answer": "Yes, we offer a 14-day free trial."
      }
    ]
  },
  "calCom": {
    "isActive": true,
    "title": "Book a Demo",
    "subtitle": "See how it works live.",
    "calLink": "cloudflow/demo"
  },
  "footer": {
    "brandName": "CloudFlow Inc."
  }
}
```

---

## 5. Resumo da Estratégia de IA
- **Engine:** Otimizado para GPT-5.2 ou Gemini via `ai-sdk`.
- **Validação:** Uso de **Zod** para garantir que a IA nunca quebre o layout com campos inesperados.
- **Personalidade:** Agência de elite do Silicon Valley.
- **Idioma:** Adaptativo conforme o input do usuário.
