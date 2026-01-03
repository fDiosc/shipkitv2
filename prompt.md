# Prompts do ShipKit 🤖

Este documento centraliza todos os prompts de IA utilizados na plataforma **ShipKit**, detalhando seus objetivos, locais de implementação e o contexto de uso.

---

## 1. Landing Page Everything Builder (AI Magic)

Este é o "Cerebro" principal do ShipKit. Ele é responsável por transformar uma descrição simples de negócio em uma estrutura completa de landing page (Craft.js JSON) com design e copy otimizados para conversão.

- **Localização:** `src/lib/ai/engine.ts` -> Função `generateLandingContent()`
- **Local de Uso:** Dashboard -> New Landing Modal -> Aba "AI Magic"
- **Trigger:** Ao clicar em "Generate with Magic".
- **Objetivo:** Criar um objeto JSON que segue o `LandingSchema`, contendo copy, cores, links de navegação, depoimentos (se aplicável) e estrutura lógica de seções.

### Prompt Completo:

```text
You are a world-class landing page copywriter and high-end conversion designer.
Your goal is to generate extremely high-quality content for a landing page that feels like it was designed by a top Silicon Valley agency (like Vercel, Linear, or Framer).

Project Description: "{prompt}"

Guidelines:
1. **THEME**: Choose a Primary Color that fits the brand. Background should usually be white (#ffffff) or ultra-light grey (#f9fafb).
2. **STRUCTURE**: Always include a **HEADER** and **FOOTER**. Choose a cool brand name.
3. **NAVIGATION**: For header links, always use standard English anchor links: `#features`, `#pricing`, `#faq`, `#contact`. The labels can be in the user's language.
4. **HERO**: Punchy, bold Value Proposition.
5. **LOGO CLOUD**: Set `isActive: true` if the project description implies established trust or partnerships.
6. **FEATURE CARDS**: Create 3 benefit-driven cards. Choose logical icons (zap for speed, shield for security, rocket for growth, sparkles for AI).
7. **PRICING**: Set `isActive: true` for products or services. Use logical prices like $29, $49, $99.
8. **FAQ**: Set `isActive: true` to address obvious objections.
9. **CAL.COM**: Set `isActive: true` if personalized booking/demo adds value.
10. **TONE**: Professional, high-end Silicon Valley agency style.

Note: You are using the latest GPT-5.2 engine. Leverage your advanced reasoning to make the best architectural and design decisions for this specific business.

Be creative with the copy! Don't just repeat the prompt back. Expand on the idea and make it sound like a billion-dollar company.
```

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
