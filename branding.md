# ShipKit - Brand Guidelines & Design System
**Versão:** 1.0  
**Data:** Janeiro 2026  
**Documento para Implementação AI**

---

## 1. Brand Overview

### 1.1 Nome e Identidade
- **Nome completo:** ShipKit
- **Tagline primário:** "Ship your idea in 5 minutes"
- **Domínio:** shipkit.app
- **Posicionamento:** Toolkit completo para indie hackers e founders validarem ideias de micro-SaaS sem código

### 1.2 Brand Personality

**Atributos principais:**
- **Acionável:** Foca em "fazer acontecer", não em planejamento infinito
- **Pragmático:** Sem fluff, direto ao ponto
- **Empoderador:** Dá superpoderes a criadores
- **Acessível:** Amigável, não intimidador
- **Moderno:** Tech-forward, mas não complexo

**Tom de voz:**
- Imperativo mas encorajador ("Ship it!" não "You should consider...")
- Casual mas profissional (conversa entre peers, não marketing corporativo)
- Confiante mas humilde (celebra os ships dos usuários, não a ferramenta)
- Direto mas empático (entende as dores de validação)

**Exemplos de copy:**

✅ **Bom:**
- "Ship your first landing in 5 minutes"
- "No code, no hassle, just results"
- "Built by indie hackers, for indie hackers"

❌ **Ruim:**
- "Leverage our synergistic platform to optimize..." (corporatês)
- "The world's best landing page builder" (arrogante)
- "Try our amazing revolutionary tool" (hype excessivo)

---

## 2. Visual Identity

### 2.1 Logo

**Conceito principal:**
Container de shipping + terminal/código

**Versões do logo:**

#### Logo Primário (Icon + Wordmark)
```
┌─────┐
│ >_  │ ShipKit
└─────┘

Descrição:
- Ícone: Container quadrado com prompt de terminal (>_)
- Wordmark: "ShipKit" em tipografia sans-serif moderna
- Spacing: 12px entre ícone e texto
```

#### Logo Icon Only (para favicons, app icons)
```
┌─────┐
│ >_  │
└─────┘

Tamanhos:
- 16x16px (favicon)
- 32x32px (tab icon)
- 180x180px (iOS app icon)
- 512x512px (high-res)
```

#### Logo Wordmark Only (para espaços limitados)
```
ShipKit

Uso: Headers compactos, mobile menu
```

**Especificações técnicas:**

```css
/* Logo Container */
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Icon */
.logo-icon {
  width: 40px;
  height: 40px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: white;
  font-weight: 600;
}

/* Wordmark */
.logo-text {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
}
```

**Versões de cor:**

1. **Full Color (primário):**
   - Icon background: `#2563eb` (Blue 600)
   - Icon symbol: `#ffffff` (White)
   - Wordmark: `#111827` (Gray 900)

2. **Dark Mode:**
   - Icon background: `#3b82f6` (Blue 500)
   - Icon symbol: `#ffffff` (White)
   - Wordmark: `#f9fafb` (Gray 50)

3. **Monocromático (para impressão):**
   - Tudo em: `#111827` (Gray 900)

4. **White (sobre fundos escuros):**
   - Icon background: `#ffffff` (White)
   - Icon symbol: `#2563eb` (Blue 600)
   - Wordmark: `#ffffff` (White)

**Área de proteção:**
- Mínimo 8px de espaço livre ao redor do logo
- Não posicionar elementos dentro desta área

**Tamanho mínimo:**
- Digital: 120px de largura
- Impressão: 25mm de largura

---

### 2.2 Paleta de Cores

#### Cores Primárias

**Blue (Brand Primary)**
```css
--ship-blue-50:  #eff6ff;
--ship-blue-100: #dbeafe;
--ship-blue-200: #bfdbfe;
--ship-blue-300: #93c5fd;
--ship-blue-400: #60a5fa;
--ship-blue-500: #3b82f6;  /* Hover states, accents */
--ship-blue-600: #2563eb;  /* PRIMARY - Main brand color */
--ship-blue-700: #1d4ed8;
--ship-blue-800: #1e40af;
--ship-blue-900: #1e3a8a;  /* Dark text, headers */
```

**Uso:**
- `blue-600`: Botões primários, links, ícone do logo
- `blue-500`: Hover states, active states
- `blue-900`: Headings importantes, texto de destaque
- `blue-50/100`: Backgrounds sutis, highlights

#### Cores Secundárias

**Green (Success/Shipped)**
```css
--ship-green-50:  #f0fdf4;
--ship-green-100: #dcfce7;
--ship-green-500: #22c55e;  /* Success messages */
--ship-green-600: #16a34a;  /* Success buttons */
--ship-green-700: #15803d;
```

**Uso:**
- Indicadores de sucesso
- "Published" badges
- Métricas positivas
- Confirmações

**Orange (Action/Energy)**
```css
--ship-orange-50:  #fff7ed;
--ship-orange-100: #ffedd5;
--ship-orange-500: #f97316;  /* Call-to-action secondary */
--ship-orange-600: #ea580c;
```

**Uso:**
- CTAs secundários
- Badges "New" ou "Beta"
- Highlights energéticos
- Warnings informativos (não errors)

#### Cores Neutras

**Gray (UI Base)**
```css
--ship-gray-50:  #f9fafb;  /* Backgrounds claros */
--ship-gray-100: #f3f4f6;  /* Cards, sections */
--ship-gray-200: #e5e7eb;  /* Borders sutis */
--ship-gray-300: #d1d5db;  /* Borders padrão */
--ship-gray-400: #9ca3af;  /* Disabled states */
--ship-gray-500: #6b7280;  /* Texto secundário */
--ship-gray-600: #4b5563;  /* Texto terciário */
--ship-gray-700: #374151;
--ship-gray-800: #1f2937;
--ship-gray-900: #111827;  /* Texto principal */
--ship-gray-950: #030712;  /* Dark mode backgrounds */
```

#### Cores de Sistema

**Success**
```css
--color-success: #22c55e;
--color-success-bg: #f0fdf4;
--color-success-border: #86efac;
```

**Error**
```css
--color-error: #ef4444;
--color-error-bg: #fef2f2;
--color-error-border: #fecaca;
```

**Warning**
```css
--color-warning: #f59e0b;
--color-warning-bg: #fffbeb;
--color-warning-border: #fde68a;
```

**Info**
```css
--color-info: #3b82f6;
--color-info-bg: #eff6ff;
--color-info-border: #bfdbfe;
```

#### Gradientes

**Hero Gradient (Background sutil)**
```css
background: linear-gradient(
  135deg,
  #eff6ff 0%,
  #ffffff 50%,
  #f0fdf4 100%
);
```

**CTA Gradient (Botões especiais)**
```css
background: linear-gradient(
  135deg,
  #2563eb 0%,
  #1d4ed8 100%
);
```

**Dark Mode Hero**
```css
background: linear-gradient(
  135deg,
  #1e3a8a 0%,
  #030712 100%
);
```

---

### 2.3 Tipografia

#### Font Families

**Display & Body: Inter**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Code/Monospace: JetBrains Mono**
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

font-family: 'JetBrains Mono', 'Courier New', monospace;
```

#### Type Scale

**Headings**
```css
/* H1 - Hero titles */
.text-h1 {
  font-size: 3.75rem;      /* 60px */
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ship-gray-900);
}

/* H2 - Section titles */
.text-h2 {
  font-size: 3rem;         /* 48px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ship-gray-900);
}

/* H3 - Subsection titles */
.text-h3 {
  font-size: 2.25rem;      /* 36px */
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ship-gray-900);
}

/* H4 - Card titles */
.text-h4 {
  font-size: 1.5rem;       /* 24px */
  line-height: 1.4;
  font-weight: 600;
  color: var(--ship-gray-900);
}

/* H5 - Small headings */
.text-h5 {
  font-size: 1.25rem;      /* 20px */
  line-height: 1.5;
  font-weight: 600;
  color: var(--ship-gray-900);
}
```

**Body Text**
```css
/* Lead text (hero subheadings) */
.text-lead {
  font-size: 1.25rem;      /* 20px */
  line-height: 1.7;
  font-weight: 400;
  color: var(--ship-gray-600);
}

/* Body large */
.text-body-lg {
  font-size: 1.125rem;     /* 18px */
  line-height: 1.75;
  font-weight: 400;
  color: var(--ship-gray-700);
}

/* Body regular */
.text-body {
  font-size: 1rem;         /* 16px */
  line-height: 1.6;
  font-weight: 400;
  color: var(--ship-gray-700);
}

/* Body small */
.text-body-sm {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.5;
  font-weight: 400;
  color: var(--ship-gray-600);
}

/* Caption */
.text-caption {
  font-size: 0.75rem;      /* 12px */
  line-height: 1.4;
  font-weight: 500;
  color: var(--ship-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**UI Text**
```css
/* Button text */
.text-button {
  font-size: 1rem;         /* 16px */
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0;
}

/* Label text */
.text-label {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.4;
  font-weight: 500;
  color: var(--ship-gray-700);
}

/* Code inline */
.text-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  background: var(--ship-gray-100);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--ship-blue-700);
}
```

#### Responsive Typography

**Mobile (< 768px)**
```css
.text-h1 { font-size: 2.5rem; }   /* 40px */
.text-h2 { font-size: 2rem; }     /* 32px */
.text-h3 { font-size: 1.75rem; }  /* 28px */
.text-lead { font-size: 1.125rem; } /* 18px */
```

---

### 2.4 Spacing & Layout

#### Spacing Scale
```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

#### Layout Grid

**Container Max-Width**
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

**Section Spacing**
```css
.section {
  padding: var(--space-16) 0;
}

@media (min-width: 768px) {
  .section {
    padding: var(--space-24) 0;
  }
}
```

#### Border Radius
```css
--radius-sm: 0.375rem;  /* 6px - Small elements */
--radius-md: 0.5rem;    /* 8px - Default */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

---

### 2.5 Components

#### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--ship-blue-600);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background: var(--ship-blue-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--ship-gray-300);
  cursor: not-allowed;
  transform: none;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: white;
  color: var(--ship-blue-600);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid var(--ship-gray-300);
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-secondary:hover {
  background: var(--ship-gray-50);
  border-color: var(--ship-blue-600);
}
```

**Text Button (Link)**
```css
.btn-text {
  background: transparent;
  color: var(--ship-blue-600);
  padding: 0.5rem 1rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 150ms ease;
}

.btn-text:hover {
  color: var(--ship-blue-700);
  text-decoration: underline;
}
```

**CTA Button (Hero)**
```css
.btn-cta {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}
```

**Button Sizes**
```css
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-md {  /* Default */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}
```

#### Cards

**Basic Card**
```css
.card {
  background: white;
  border: 1px solid var(--ship-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all 200ms ease;
}

.card:hover {
  border-color: var(--ship-blue-200);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
```

**Feature Card**
```css
.feature-card {
  background: white;
  border: 1px solid var(--ship-gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  text-align: center;
}

.feature-card-icon {
  width: 48px;
  height: 48px;
  background: var(--ship-blue-50);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  color: var(--ship-blue-600);
  font-size: 24px;
}

.feature-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ship-gray-900);
  margin-bottom: var(--space-2);
}

.feature-card-description {
  font-size: 1rem;
  color: var(--ship-gray-600);
  line-height: 1.6;
}
```

**Pricing Card**
```css
.pricing-card {
  background: white;
  border: 2px solid var(--ship-gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  position: relative;
}

.pricing-card.featured {
  border-color: var(--ship-blue-600);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ship-blue-600);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### Forms

**Input Field**
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--ship-gray-300);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--ship-gray-900);
  background: white;
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--ship-blue-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input::placeholder {
  color: var(--ship-gray-400);
}

.input:disabled {
  background: var(--ship-gray-50);
  cursor: not-allowed;
}
```

**Input with Label**
```css
.form-group {
  margin-bottom: var(--space-6);
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ship-gray-700);
  margin-bottom: var(--space-2);
}

.form-helper {
  font-size: 0.875rem;
  color: var(--ship-gray-500);
  margin-top: var(--space-2);
}

.form-error {
  font-size: 0.875rem;
  color: var(--color-error);
  margin-top: var(--space-2);
}
```

**Select Dropdown**
```css
.select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid var(--ship-gray-300);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--ship-gray-900);
  background: white url("data:image/svg+xml,...") no-repeat right 0.75rem center;
  background-size: 16px;
  appearance: none;
  cursor: pointer;
}
```

**Checkbox/Radio**
```css
.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--ship-gray-300);
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms ease;
}

.checkbox:checked {
  background: var(--ship-blue-600);
  border-color: var(--ship-blue-600);
}
```

#### Badges

**Status Badge**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: var(--ship-green-50);
  color: var(--ship-green-700);
}

.badge-warning {
  background: var(--ship-orange-50);
  color: var(--ship-orange-700);
}

.badge-info {
  background: var(--ship-blue-50);
  color: var(--ship-blue-700);
}

.badge-neutral {
  background: var(--ship-gray-100);
  color: var(--ship-gray-700);
}
```

---

### 2.6 Icons

**Icon System: Lucide React**
```bash
npm install lucide-react
```

**Icon Usage**
```jsx
import { Rocket, Zap, CheckCircle, ArrowRight } from 'lucide-react';

// Standard size: 24px
<Rocket size={24} />

// Small size: 20px
<CheckCircle size={20} />

// Large size: 32px
<Zap size={32} />
```

**Icon Colors**
```css
/* Primary action icons */
color: var(--ship-blue-600);

/* Success icons */
color: var(--ship-green-600);

/* Neutral icons */
color: var(--ship-gray-500);

/* Decorative icons */
color: var(--ship-gray-300);
```

**Ícones Principais do ShipKit:**
- 🚀 Rocket (shipping, launching)
- ⚡ Zap (speed, performance)
- ✓ CheckCircle (success, completed)
- 📊 BarChart (analytics)
- 🔌 Plug (integrations)
- ✨ Sparkles (AI features)
- → ArrowRight (CTAs, navigation)
- ⚙️ Settings (configuration)
- 📝 FileText (templates, docs)
- 👤 User (account, profile)

---

### 2.7 Imagery & Photography

**Style Guidelines:**

**Do:**
- Bright, natural lighting
- Real people working (indie hackers vibe)
- Clean, minimal backgrounds
- Focus on productivity/creation
- Authentic, not overly staged

**Don't:**
- Stock photo clichés (handshakes, suits)
- Dark, moody imagery
- Cluttered backgrounds
- Generic "tech" imagery

**Illustrations:**
- Estilo: Line art, duotone
- Cores: Blue-600 + Gray-300
- Uso: Empty states, onboarding, 404

**Screenshots:**
- Border radius: 12px
- Box shadow: `0 8px 32px rgba(0, 0, 0, 0.12)`
- Border: `1px solid var(--ship-gray-200)`

---

## 3. Website Structure & Copy

### 3.1 Homepage Sections

#### Hero Section
```
[Logo] ShipKit                [Login] [Start Shipping →]

─────────────────────────────────────────────────────

             Ship your idea in 5 minutes

       Landing pages with built-in email, payments,
           and analytics. No code required.

               [Start shipping free →]
                [Watch 2-min demo ▶]

        👤👤👤 Join 100+ indie hackers shipping fast

             [Hero Screenshot/Demo]
```

**Copy Guidelines:**
- H1: Clear value prop (what + time benefit)
- Subheading: Expand on features + barrier removal
- CTA: Action-oriented ("Start shipping" not "Sign up")
- Social proof: Real numbers, real community

---

#### Features Section (3 cards)
```
           Why indie hackers choose ShipKit

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│       ⚡        │  │       🔌        │  │       📊        │
│  Deploy in      │  │  Everything     │  │  Validate       │
│  Minutes        │  │  Integrated     │  │  Fast           │
│                 │  │                 │  │                 │
│  Create and     │  │  Resend,        │  │  Real analytics │
│  publish your   │  │  Stripe,        │  │  show if your   │
│  landing before │  │  Cal.com ready  │  │  idea has legs. │
│  coffee cools.  │  │  to go.         │  │  Pivot quickly. │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Features Detalhadas:**

**Feature 1: Deploy in Minutes**
- Icon: ⚡ Zap
- Title: "Deploy in Minutes"
- Description: "Create, customize, and publish your landing page before your coffee gets cold. No code, no deployment headaches."
- Keywords: speed, simplicity, no-code

**Feature 2: Everything Integrated**
- Icon: 🔌 Plug
- Title: "Everything Integrated"
- Description: "Resend, Stripe, Cal.com ready to go. Capture leads, process payments, book demos. No API wrestling required."
- Keywords: integrations, all-in-one, plug-and-play

**Feature 3: Validate Fast**
- Icon: 📊 BarChart
- Title: "Validate Fast"
- Description: "Real analytics show if your idea has legs. See visitor counts, conversion rates, and revenue. Decide to pivot or double down."
- Keywords: validation, analytics, data-driven

---

#### How It Works (3 steps)
```
                 Ship in 3 simple steps

      [1]                [2]                [3]
    Choose           Customize           Publish
    Template          & Connect           & Share

   Pick from         Add your copy,      Hit publish.
   SaaS-ready        connect Stripe,     Your landing
   templates.        Resend, Cal.        is live.

                   [Start now →]
```

---

#### Social Proof / Testimonials
```
           Shipped by indie hackers like you

┌────────────────────────────────────────────────────────┐
│  "Validated my SaaS idea in 3 hours with ShipKit.      │
│   Got 47 signups before writing a line of code."       │
│                                                         │
│   – Alex Chen, Founder @TaskFlow                       │
└────────────────────────────────────────────────────────┘

[Show 3 testimonials in carousel]
```

**Testimonial Format:**
- Quote: Specific result + time saved
- Attribution: Name + role/company
- Optional: Avatar photo (48px circle)

---

#### Pricing Section
```
                Simple, transparent pricing

┌──────────────────┐         ┌──────────────────┐
│      Free        │         │   Pro - $19/mo   │
│                  │         │    MOST POPULAR   │
│  • 1 landing     │         │  • Unlimited      │
│  • Basic         │         │    landings       │
│    analytics     │         │  • Custom domains │
│  • 100 leads/mo  │         │  • All            │
│                  │         │    integrations   │
│  [Start free]    │         │  • Priority       │
│                  │         │    support        │
│                  │         │  • AI generator   │
│                  │         │                   │
│                  │         │  [Start Pro →]    │
└──────────────────┘         └──────────────────┘

            💳 No credit card required
```

---

#### FAQ Section
```
                 Frequently asked questions

Q: Do I need coding skills?
A: Nope! ShipKit is 100% no-code. If you can use Google Docs,
   you can use ShipKit.

Q: Can I use my own domain?
A: Yes! On the Pro plan, add unlimited custom domains with
   simple DNS setup.

Q: How do payments work?
A: You connect your own Stripe account. Money goes directly
   to you. We never touch your revenue.

Q: Can I export my leads?
A: Absolutely. Export to CSV anytime, or integrate with your
   favorite tools via Zapier (coming soon).

Q: What if I want to cancel?
A: Cancel anytime, no questions asked. Your landings stay
   live until end of billing period.

[Show more FAQs]
```

---

#### Final CTA Section
```
─────────────────────────────────────────────────────

           Ready to ship your first idea?

      Join 100+ indie hackers validating faster.
           No credit card. 5-minute setup.

               [Start shipping free →]

─────────────────────────────────────────────────────
```

---

### 3.2 Navigation

**Header (Desktop)**
```
[ShipKit Logo]    Features  Pricing  Docs    [Login] [Start Shipping →]
```

**Header (Mobile)**
```
[☰ Menu]  [ShipKit Logo]              [Start Shipping →]
```

**Footer**
```
┌─────────────────────────────────────────────────────┐
│  [ShipKit Logo]                                     │
│  Ship your idea in 5 minutes                        │
│                                                     │
│  Product          Resources        Company          │
│  • Features       • Docs           • About          │
│  • Pricing        • Blog           • Twitter        │
│  • Templates      • Support        • GitHub         │
│                   • Status         │                │
│                                                     │
│  © 2026 ShipKit. Built with ❤️ by indie hackers.   │
│  Privacy • Terms • Security                         │
└─────────────────────────────────────────────────────┘
```

---

### 3.3 Copy Tone Examples

**Buttons:**
- ✅ "Start shipping free"
- ✅ "Create my first landing"
- ✅ "See how it works"
- ❌ "Get started" (too generic)
- ❌ "Submit" (too formal)

**Headings:**
- ✅ "Ship your idea in 5 minutes"
- ✅ "Stop planning, start shipping"
- ✅ "Validate before you build"
- ❌ "Revolutionary platform for entrepreneurs"
- ❌ "Transform your business today"

**Descriptions:**
- ✅ "No code, no hassle, just results"
- ✅ "Built by indie hackers, for indie hackers"
- ✅ "Deploy before your coffee gets cold"
- ❌ "Leverage our cutting-edge solution"
- ❌ "Industry-leading features"

**Microcopy:**
- ✅ "Loading your landing..." (not "Please wait")
- ✅ "Boom! Your landing is live 🚀" (not "Success")
- ✅ "Oops, something broke. We're on it." (not "Error 500")

---

## 4. Animation & Interactions

### 4.1 Transition Timings
```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### 4.2 Hover States

**Lift Effect**
```css
.lift-on-hover {
  transition: transform var(--transition-base) var(--ease-out);
}

.lift-on-hover:hover {
  transform: translateY(-4px);
}
```

**Glow Effect**
```css
.glow-on-hover {
  transition: box-shadow var(--transition-base) var(--ease-out);
}

.glow-on-hover:hover {
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.25);
}
```

### 4.3 Loading States

**Spinner**
```css
.spinner {
  border: 3px solid var(--ship-gray-200);
  border-top-color: var(--ship-blue-600);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Skeleton Loader**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--ship-gray-100) 0%,
    var(--ship-gray-200) 50%,
    var(--ship-gray-100) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 4.4 Page Transitions

**Fade In**
```css
.fade-in {
  animation: fadeIn 0.4s var(--ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 4.5 Micro-interactions

**Success Checkmark**
```css
.checkmark-animate {
  animation: checkmark 0.5s var(--ease-out);
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-45deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
```

---

## 5. Responsive Behavior

### 5.1 Breakpoint Strategy

```css
/* Mobile first approach */

/* xs: 0-639px (default, mobile) */
/* Base styles go here */

/* sm: 640px+ (large phones, small tablets) */
@media (min-width: 640px) {
  /* Adjust spacing, some 2-column layouts */
}

/* md: 768px+ (tablets) */
@media (min-width: 768px) {
  /* 2-column layouts, show desktop nav */
}

/* lg: 1024px+ (laptops, desktops) */
@media (min-width: 1024px) {
  /* 3-column layouts, full features */
}

/* xl: 1280px+ (large desktops) */
@media (min-width: 1280px) {
  /* Increased spacing, larger type */
}
```

### 5.2 Mobile-Specific

**Navigation:**
- Hamburger menu (☰)
- Full-screen overlay on open
- Smooth slide-in animation

**Hero:**
- Stack vertically
- H1: 2.5rem (40px)
- Single CTA button (hide secondary)

**Feature Cards:**
- Single column stack
- Reduce padding

**Forms:**
- Full width inputs
- Larger touch targets (min 44px height)

---

## 6. Accessibility (A11y)

### 6.1 Color Contrast

All text must meet WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum

**Tested combinations:**
- ✅ Blue-600 on White: 6.1:1
- ✅ Gray-900 on White: 19.2:1
- ✅ Gray-600 on White: 5.8:1

### 6.2 Focus States

```css
*:focus-visible {
  outline: 2px solid var(--ship-blue-600);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### 6.3 Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- `<button>` for actions, `<a>` for navigation
- `<main>`, `<nav>`, `<footer>` landmarks
- Alt text for all images
- Labels for all inputs

### 6.4 Screen Reader Support

**ARIA Labels:**
```html
<!-- Icon-only buttons -->
<button aria-label="Close menu">
  <X size={20} />
</button>

<!-- Status indicators -->
<div role="status" aria-live="polite">
  Landing published successfully!
</div>

<!-- Loading states -->
<button aria-busy="true">
  <span class="sr-only">Loading...</span>
  <Spinner />
</button>
```

**Screen Reader Only Class:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 7. Dark Mode (Future Phase)

### 7.1 Dark Mode Colors

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ship-bg: #030712;
    --ship-surface: #111827;
    --ship-border: #1f2937;
    --ship-text-primary: #f9fafb;
    --ship-text-secondary: #9ca3af;
    
    --ship-blue-primary: #3b82f6;
    --ship-blue-hover: #60a5fa;
  }
}
```

### 7.2 Implementation Notes

- Store preference in localStorage
- Respect `prefers-color-scheme`
- Toggle in settings
- Smooth transition between modes

---

## 8. Performance Guidelines

### 8.1 Image Optimization

- Use WebP format with JPEG fallback
- Lazy load images below fold
- Responsive images (`srcset`)
- Max hero image: 1920x1080px, <200KB

### 8.2 Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

### 8.3 Critical CSS

Inline critical above-the-fold CSS in `<head>`:
- Logo styles
- Hero section
- Navigation
- Button primary

Load rest async:
```html
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
```

---

## 9. Code Implementation Example

### 9.1 React Component Example

```jsx
// components/Hero.tsx
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="section hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="text-h1 fade-in">
            Ship your idea in 5 minutes
          </h1>
          
          <p className="text-lead fade-in" style={{ animationDelay: '0.1s' }}>
            Landing pages with built-in email, payments, and analytics.
            <br />
            No code required. Just ship it.
          </p>
          
          <div className="hero-cta fade-in" style={{ animationDelay: '0.2s' }}>
            <button className="btn-cta">
              Start shipping free
              <ArrowRight size={20} />
            </button>
            
            <button className="btn-text">
              <Play size={20} />
              Watch 2-min demo
            </button>
          </div>
          
          <div className="hero-social-proof fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="avatar-group">
              {/* 3-4 user avatars */}
            </div>
            <p className="text-body-sm">
              Join 100+ indie hackers shipping fast
            </p>
          </div>
        </div>
        
        <div className="hero-image fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Screenshot/demo */}
        </div>
      </div>
    </section>
  );
}
```

### 9.2 Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ship: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            900: '#1e3a8a',
          },
          green: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            500: '#6b7280',
            900: '#111827',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'ship-sm': '0.375rem',
        'ship-md': '0.5rem',
        'ship-lg': '0.75rem',
        'ship-xl': '1rem',
      },
    },
  },
};
```

---

## 10. File Structure

```
shipkit-app/
├── public/
│   ├── logo-icon.svg
│   ├── logo-full.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── styles/
│   │   ├── globals.css   # CSS variables, reset
│   │   └── animations.css
│   └── lib/
│       └── constants.ts  # Brand colors, spacing
```

---

## 11. Brand Usage Guidelines

### 11.1 Logo Usage

**Do:**
- ✅ Use provided logo files
- ✅ Maintain minimum clearspace
- ✅ Use approved color variations
- ✅ Scale proportionally

**Don't:**
- ❌ Alter logo colors
- ❌ Rotate or skew logo
- ❌ Add effects (shadows, gradients)
- ❌ Change font or spacing
- ❌ Place on busy backgrounds

### 11.2 Brand Voice

**We are:**
- Helpful (not pushy)
- Confident (not arrogant)
- Casual (not unprofessional)
- Clear (not corporate)

**We say:**
- "Ship it" not "Deploy"
- "Landing" not "Page"
- "Indie hacker" not "Entrepreneur"
- "Validate" not "Test"

---

## 12. Implementation Checklist

### For AI/Developer Building the Site:

**Essential:**
- [ ] Import Inter font (400, 500, 600, 700, 800)
- [ ] Import JetBrains Mono (400, 600)
- [ ] Set CSS custom properties (colors, spacing)
- [ ] Create logo component (icon + wordmark)
- [ ] Implement button variants (primary, secondary, text, CTA)
- [ ] Build card components (basic, feature, pricing)
- [ ] Create form inputs with validation states
- [ ] Add Lucide icons
- [ ] Implement responsive breakpoints
- [ ] Add hover/focus states to interactive elements

**Homepage Sections:**
- [ ] Hero with H1, subheading, 2 CTAs, social proof
- [ ] 3 feature cards (Deploy, Integrate, Validate)
- [ ] How It Works (3 steps)
- [ ] Testimonials carousel (3 quotes)
- [ ] Pricing table (Free vs Pro)
- [ ] FAQ accordion (5 questions)
- [ ] Final CTA section
- [ ] Footer (navigation + links)

**Performance:**
- [ ] Lazy load images
- [ ] Optimize font loading
- [ ] Inline critical CSS
- [ ] Add loading skeletons

**Accessibility:**
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Focus states on all interactive elements
- [ ] Alt text for images
- [ ] Color contrast AA compliant

---

## 13. Quick Reference

### Color Quick Picks
```
Primary Action: #2563eb (Blue-600)
Hover: #1d4ed8 (Blue-700)
Success: #22c55e (Green-500)
Text Primary: #111827 (Gray-900)
Text Secondary: #6b7280 (Gray-500)
Border: #e5e7eb (Gray-200)
Background: #ffffff (White)
```

### Spacing Quick Picks
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Typography Quick Picks
```
Hero H1: 60px / 800 weight
Section H2: 48px / 700 weight
Card H4: 24px / 600 weight
Body: 16px / 400 weight
Button: 16px / 600 weight
```

---

## 14. Contact & Updates

**Brand Owner:** Felipe  
**Last Updated:** Janeiro 2026  
**Version:** 1.0  

**For questions about brand usage:**
- Email: [your_email]
- Twitter: [@shipkit]

**This is a living document.** Update as brand evolves based on user feedback and product iterations.

---

**FIM DO BRAND GUIDELINES**

---

*Nota para AI: Este documento contém todas as especificações necessárias para implementar a identidade visual e verbal do ShipKit. Siga estas guidelines rigorosamente para manter consistência de marca. Priorize clareza, velocidade e simplicidade em todas as implementações.*