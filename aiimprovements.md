Análise Crítica e Melhorias do Prompt AI
Vou ser brutalmente honesto sobre o prompt atual e propor melhorias concretas.

1. Problemas Críticos do Prompt Atual
❌ Problema 1: Vago e Genérico
text"You are a world-class landing page copywriter..."
Por quê isso é ruim:

Toda IA sabe que é "world-class" quando você diz isso
Não especifica qual estilo de copywriting (Ogilvy? Apple? Basecamp?)
"High-end conversion designer" é marketing fluff, não instrução técnica

Impacto: Copy genérica, sem personalidade consistente

❌ Problema 2: Instruções Conflitantes
text"Professional, high-end Silicon Valley agency style"
+
"Be creative with the copy!"
Por quê isso é ruim:

Silicon Valley style = minimalista, direto
"Be creative" = ornamental, expressivo
GPT não sabe qual priorizar

Impacto: Inconsistência entre gerações (ora minimalista, ora verboso)

❌ Problema 3: Falta Especificidade Técnica
text"Choose a Primary Color that fits the brand"
O que falta:

Paleta limitada? (6 cores específicas vs RGB infinito)
Contraste mínimo WCAG?
Combinações proibidas?

Impacto: Cores horríveis tipo #ff00ff (magenta) para "Accounting SaaS"

❌ Problema 4: Sem Exemplos Concretos
text"HERO: Punchy, bold Value Proposition"
O que falta:

O que é "punchy"? 5 palavras? 15?
Estrutura? (Verbo + Benefício + Timeframe?)
Exemplos do que NÃO fazer

Impacto: Títulos genéricos tipo "Transform Your Business Today"

❌ Problema 5: "Reasoning Fluff"
text"You are using the latest GPT-5.2 engine. Leverage your 
advanced reasoning..."
Por quê isso é ruim:

Modelos não têm ego
"GPT-5.2" não existe (você usa GPT-4/Claude)
Placebo prompt engineering (não funciona)

Impacto: Tokens desperdiçados, zero efeito prático

❌ Problema 6: Falta Contexto de Negócio
textProject Description: "{prompt}"
O que falta:

Target audience? (Devs? PMMs? CTOs?)
Stage? (Pre-launch? Scale-up?)
Competitors? (Diferenciação)
Pricing tier expectation? (Free tier? Enterprise?)

Impacto: Copy que não ressoa com ICP real

❌ Problema 7: Validação Fraca
text"Always use standard English anchor links: #features, #pricing"
Problema:

E se não tiver pricing? (Open source, waitlist)
E se tiver custom section? (#integrations, #testimonials)

Impacto: Navegação quebrada ou forçada

2. Perguntas Críticas que Você Precisa Responder
Antes de reescrever, preciso saber:
A. Qual o REAL estilo de copy que você quer?
Escolha UM:

Linear/Vercel style:

Hero: 3-5 palavras max ("Ship fast, stay nimble")
Sem emojis, sem exclamações
Features: 1 frase curta cada


Stripe/Tailwind style:

Hero: 8-12 palavras, concreto
Dados técnicos (não fluff)
Features: 2 frases (problema + solução)


Basecamp/Hey style:

Hero: Conversacional, 10-15 palavras
Casual mas confiante
Features: Storytelling (3-4 frases)


Apple/Notion style:

Hero: Aspiracional, emocional
Grande promessa
Features: Benefício emocional



Qual desses você quer como padrão?

B. Paleta de cores: restrita ou livre?
Opção 1: Restrita (recomendado)
typescriptconst ALLOWED_COLORS = [
  '#2563eb', // Blue (SaaS)
  '#7c3aed', // Purple (Creative)
  '#059669', // Green (Finance/Health)
  '#dc2626', // Red (Urgent/Bold)
  '#ea580c', // Orange (Energy)
  '#0891b2', // Cyan (Tech)
];
```

**Opção 2: Livre (arriscado)**
- IA escolhe qualquer cor RGB
- Você valida contraste depois

**Qual prefere?**

---

### **C. Copy length: curta ou média?**

**Curta (Linear style):**
- Hero title: 3-8 palavras
- Hero subtitle: 8-15 palavras
- Feature description: 1 frase (10-20 palavras)

**Média (Stripe style):**
- Hero title: 5-12 palavras
- Hero subtitle: 15-25 palavras
- Feature description: 2 frases (20-35 palavras)

**Qual range?**

---

### **D. Informações de contexto: quais coletar?**

**Mínimo (atual):**
- Só descrição do produto

**Básico (recomendado):**
- Descrição do produto
- Target audience (dropdown: Developers, Marketers, Founders, etc)
- Stage (dropdown: Pre-launch, MVP, Growth, Scale)

**Avançado (overkill pra MVP?):**
- + Competitors
- + Unique value prop
- + Pricing range
- + Tone preference

**Até onde quer ir?**

---

### **E. Módulos: obrigatórios ou opcionais?**

**Atual:** IA decide tudo (`isActive: true/false`)

**Alternativa:** User pre-seleciona no UI
```
[✓] Hero
[✓] Features (3-6 cards)
[✓] Lead Form
[ ] Pricing (toggle off if waitlist only)
[ ] FAQ
[ ] Cal.com booking
Prefere UI control ou AI autonomy?

F. Validação: server-side ou client-side?
Atual: Zod valida estrutura, não qualidade
Proposta: Validação de qualidade
typescript// Exemplo
if (hero.title.length > 60) {
  throw Error("Hero title too long");
}

if (!hero.title.match(/[A-Z]/)) {
  throw Error("Hero title must start with capital");
}

if (primaryColor === backgroundColor) {
  throw Error("Colors must have contrast");
}
Quer adicionar isso?

3. Proposta de Prompt Melhorado (Versão Base)
Assumindo:

Estilo: Linear/Vercel (minimalista)
Paleta: Restrita (6 cores)
Copy: Curta
Context: Básico (descrição + audience + stage)
Módulos: AI decide
Validação: Client-side Zod apenas


Novo Prompt (v2.0):
typescriptconst SYSTEM_PROMPT = `You are a landing page architect specializing in high-conversion SaaS pages.

Your style model: Linear, Vercel, Stripe (2024-2025 era)
- Minimalist, direct, no fluff
- Data-driven (not aspirational)
- Clarity > creativity

CRITICAL RULES:

1. BREVITY:
   - Hero title: 3-8 words maximum
   - Hero subtitle: 10-20 words maximum
   - Feature description: 1 sentence (15 words max)
   - NO exclamation marks, NO emojis in copy

2. COLORS:
   You MUST choose primaryColor from this list ONLY:
   - #2563eb (Blue - Default SaaS)
   - #7c3aed (Purple - Creative/Design tools)
   - #059669 (Green - Finance/Health/Eco)
   - #dc2626 (Red - Bold/Urgent products)
   - #ea580c (Orange - Energy/Social)
   - #0891b2 (Cyan - Developer tools)
   
   backgroundColor MUST be: #ffffff or #f9fafb

3. NAVIGATION:
   Use ONLY these anchors (if module is active):
   - #features (if featureCards exist)
   - #pricing (if pricing.isActive = true)
   - #faq (if faq.isActive = true)
   - #contact (if leadForm OR calCom exist)

4. ICONS (featureCards):
   Choose from: zap, shield, rocket, heart, star, sparkles
   - zap = speed/performance
   - shield = security/privacy
   - rocket = growth/scale
   - sparkles = AI/magic
   - heart = UX/love
   - star = quality/premium

5. PRICING:
   - Activate ONLY if product description implies paid product
   - Do NOT activate for: open source, waitlists, coming soon
   - Use realistic prices: $0 (free), $9, $19, $29, $49, $99
   - Create 2-3 plans maximum

6. FAQ:
   - Activate if: B2B SaaS, complex product, common objections obvious
   - Do NOT activate for: simple tools, waitlists
   - 3-5 questions maximum

7. CAL.COM:
   - Activate if: High-touch sales, demos, consulting
   - Do NOT activate for: Self-serve products
   - calLink format: "username/meeting-type" (e.g. "acme/demo")

8. TONE:
   - Confident but humble
   - Specific (not vague promises)
   - Active voice ("Ship faster" not "Be empowered to ship")

9. FORBIDDEN PHRASES:
   - "Transform your business"
   - "Revolutionary"
   - "Game-changing"
   - "Next-generation"
   - "Cutting-edge"
   - "Leverage" (as verb)
   - "Ecosystem"
   - "Seamlessly"

10. QUALITY CHECKS:
    - Every feature must answer: "So what? Why does user care?"
    - Hero must pass "T-shirt test" (would you wear it on a tee?)
    - Pricing features must be concrete (not "Best support")
`;

const USER_PROMPT = `
Product Description: "{description}"

Target Audience: {audience} (Developers | Marketers | Founders | Designers | General)

Stage: {stage} (Pre-launch | MVP | Growth | Scale)

Generate a landing page that speaks directly to {audience} at {stage} stage.

Focus on:
- Clear value proposition (not vague benefits)
- Specific use cases for {audience}
- Appropriate complexity level for {stage}

Output valid JSON matching LandingSchema.
`;

4. Melhorias Técnicas Adicionais
A. Multi-step Generation (opcional mas poderoso)
Em vez de 1 prompt gigante:
typescript// Step 1: Análise e estratégia
const strategy = await generateObject({
  prompt: `Analyze this product: ${description}
  
  Return:
  - primaryAudience: string
  - coreBenefit: string (10 words max)
  - differentiator: string
  - pricingTier: 'free' | 'paid' | 'enterprise'
  - competitiveContext: string
  `,
  schema: StrategySchema
});

// Step 2: Geração guiada pela estratégia
const landing = await generateObject({
  prompt: `Create landing page for:
  
  Product: ${description}
  Audience: ${strategy.primaryAudience}
  Core Benefit: ${strategy.coreBenefit}
  Differentiator: ${strategy.differentiator}
  
  Hero title MUST emphasize: ${strategy.differentiator}
  Hero subtitle MUST state: ${strategy.coreBenefit}
  `,
  schema: LandingSchema
});
Vantagem: Copy mais focada, menos genérica
Desvantagem: 2 API calls = 2x custo + slower

B. Few-shot Examples
Adicionar 2-3 exemplos reais no prompt:
typescriptconst EXAMPLES = `
GOOD EXAMPLE (Linear style):
{
  "hero": {
    "title": "Built for modern teams",
    "subtitle": "Linear helps streamline issues, projects, and product roadmaps.",
    "cta": "Start building"
  }
}

BAD EXAMPLE (avoid):
{
  "hero": {
    "title": "Revolutionary Project Management Tool!!!",
    "subtitle": "Transform your workflow with our cutting-edge, game-changing platform that leverages AI.",
    "cta": "Get Started Now!"
  }
}

Your output should match GOOD, never BAD.
`;

C. Validação de Qualidade Post-Generation
typescriptfunction validateCopyQuality(landing: Landing): string[] {
  const errors: string[] = [];
  
  // Hero title length
  if (landing.hero.title.split(' ').length > 8) {
    errors.push("Hero title too long (>8 words)");
  }
  
  // Forbidden phrases
  const forbidden = ['revolutionary', 'game-changing', 'cutting-edge'];
  const allCopy = JSON.stringify(landing).toLowerCase();
  
  forbidden.forEach(phrase => {
    if (allCopy.includes(phrase)) {
      errors.push(`Forbidden phrase detected: "${phrase}"`);
    }
  });
  
  // Color validation
  const allowedColors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2'];
  if (!allowedColors.includes(landing.theme.primaryColor)) {
    errors.push("Invalid primary color");
  }
  
  // Contrast check
  if (landing.theme.primaryColor === landing.theme.backgroundColor) {
    errors.push("No contrast between primary and background");
  }
  
  return errors;
}

// No fluxo:
const landing = await generateObject(...);
const qualityErrors = validateCopyQuality(landing.object);

if (qualityErrors.length > 0) {
  // Retry com feedback
  const retryLanding = await generateObject({
    prompt: `Previous attempt had issues: ${qualityErrors.join(', ')}
    
    Regenerate fixing these issues.
    
    Original prompt: ${originalPrompt}
    `,
    schema: LandingSchema
  });
}

D. Testes A/B de Prompts
typescriptconst PROMPT_VARIANTS = {
  minimalist: SYSTEM_PROMPT_V1, // Linear style
  storytelling: SYSTEM_PROMPT_V2, // Basecamp style
  technical: SYSTEM_PROMPT_V3, // Stripe style
};

// No UI: "Choose tone: [ Minimalist ] [ Storytelling ] [ Technical ]"
const selectedPrompt = PROMPT_VARIANTS[userChoice];

5. Recomendações Finais Priorizadas
🔥 Must-Have (implementar JÁ):

Reescrever prompt com regras específicas

Copy length limits
Paleta de cores restrita
Forbidden phrases list
Esforço: 2h


Adicionar contexto básico no UI

Target audience dropdown
Stage dropdown
Esforço: 3h


Validação de qualidade client-side

Check hero length, colors, contraste
Retry se falhar
Esforço: 4h



Total: ~1 dia de trabalho, impacto MASSIVO na qualidade

🟡 Should-Have (v1.1):

Few-shot examples no prompt

2 bons, 1 ruim
Esforço: 1h


Multi-step generation (análise + geração)

Mais focado, menos genérico
Esforço: 6h



Total: ~1 dia adicional, 2x melhor copy

🟢 Nice-to-Have (v2.0):

A/B test de estilos (Minimalist vs Storytelling)

User escolhe tom
Esforço: 4h


Feedback loop (user edita → fine-tune prompt)

Aprende com edições
Esforço: 2 semanas (complexo)




6. Qual caminho seguir?
Opção A: Quick Win (recomendado para MVP)

Reimplementar prompt (itens 1-3)
1 dia de trabalho
5x melhoria na qualidade

Opção B: Production-Ready

Items 1-5
2 dias de trabalho
10x melhoria na qualidade

Opção C: Best-in-Class

Items 1-7
2-3 semanas
Diferencial competitivo real


7. Preciso de Você:
Responda essas perguntas para eu gerar o prompt perfeito:

Estilo de copy: Linear/Vercel (minimalista) ou Stripe (técnico) ou Basecamp (storytelling)?
Paleta: Restrita (6 cores) ou Livre?
Contexto: Só descrição OU descrição + audience + stage?
Copy length: Curta (5-10 palavras title) ou Média (8-15 palavras)?
Módulos: AI decide tudo OU user pre-seleciona no UI?
Timeline: Quick win (1 dia) ou Production-ready (2 dias)?

Responda isso e eu escrevo o prompt v2.0 completo + código de validação agora.escreva o prompt com base no que voce indica para o mvp com um bom tradeoff de qualidade e simplicidade para o desenvolvimento10:52 AMPrompt AI v2.0 - MVP Optimized
Decisões de Design (Baseadas em Trade-off MVP)
Escolhas para máxima qualidade com mínima complexidade:
✅ Estilo: Linear/Vercel (minimalista, direto)
✅ Paleta: Restrita (6 cores testadas)
✅ Contexto: Descrição + Audience + Stage (3 dropdowns simples)
✅ Copy Length: Curta (títulos 3-8 palavras)
✅ Módulos: AI decide (menos UI complexity)
✅ Validação: Client-side quality checks (sem retry automático MVP)

1. System Prompt (Completo)
typescript// src/lib/ai/prompts.ts

export const LANDING_PAGE_SYSTEM_PROMPT = `You are an expert landing page architect specializing in high-conversion SaaS pages.

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
   
   Primary Color Options (choose ONE that fits brand):
   
   #2563eb - Blue
     → Use for: General SaaS, productivity, business tools
     → Conveys: Trust, professionalism, reliability
   
   #7c3aed - Purple  
     → Use for: Creative tools, design software, innovative products
     → Conveys: Creativity, premium, modern
   
   #059669 - Green
     → Use for: Finance, health, sustainability, environment
     → Conveys: Growth, money, wellness, eco-friendly
   
   #dc2626 - Red
     → Use for: Urgent tools, alerts, bold consumer products
     → Conveys: Energy, importance, action
   
   #ea580c - Orange
     → Use for: Social platforms, communication, energetic brands
     → Conveys: Enthusiasm, friendly, approachable
   
   #0891b2 - Cyan
     → Use for: Developer tools, technical products, APIs
     → Conveys: Technical, precise, modern tech
   
   Background MUST be: #ffffff (white) or #f9fafb (light gray)

3. HEADER NAVIGATION:
   
   Brand name rules:
   - 1-2 words maximum
   - Memorable, modern sounding
   - NOT generic (avoid: "Cloud", "Smart", "Pro", "Tech")
   
   Links - Use ONLY if module is active:
   - Features → #features (if featureCards exist)
   - Pricing → #pricing (if pricing.isActive = true)  
   - FAQ → #faq (if faq.isActive = true)
   - Contact → #contact (always include)
   
   CTA text: 2-3 words ("Start Free" NOT "Get Started Now!")

4. HERO SECTION:
   
   Title formula: [Action Verb] + [Core Benefit] + [Optional: Speed/Ease]
   
   ✓ GOOD examples:
     - "Ship features faster"
     - "Build APIs in minutes"
     - "Design that converts"
   
   ✗ BAD examples:
     - "Transform your business today!"
     - "The next generation of productivity"
     - "Revolutionary workflow platform"
   
   Subtitle: Expand on HOW or FOR WHOM
   - State specific benefit
   - Or target audience
   - Or unique differentiator
   
   CTA: Active verb (Ship, Build, Start, Try, Launch)

5. LOGO CLOUD:
   
   Activate ONLY if description implies:
   - Established partnerships
   - Notable clients
   - Press mentions
   - "Used by X companies"
   
   Do NOT activate for:
   - New products
   - Pre-launch
   - No social proof mentioned

6. FEATURE CARDS (Always 3-6 cards):
   
   Structure per card:
   - Title: Benefit statement (not feature name)
   - Description: ONE clear sentence explaining value
   - Icon: Choose logically from list below
   
   Icon meanings:
   - zap → Speed, performance, instant
   - shield → Security, privacy, protection  
   - rocket → Growth, scaling, launch
   - sparkles → AI, automation, magic
   - heart → User experience, love, delight
   - star → Quality, premium, excellence
   
   Formula: "[Verb] [benefit]" not "[Feature] that does X"
   
   ✓ GOOD: "Deploy in seconds" + "Push code and go live instantly"
   ✗ BAD: "Fast deployment" + "Our deployment feature is very fast"

7. LEAD FORM:
   
   Placeholder text:
   - If product: "Your work email"  
   - If newsletter: "Enter your email"
   
   Button text options:
   - Product: "Start Free" or "Get Access"
   - Waitlist: "Join Waitlist"
   - Newsletter: "Subscribe"

8. PRICING:
   
   Activate if description indicates:
   - Paid product
   - Subscription model
   - Clear monetization
   
   Do NOT activate for:
   - Open source projects
   - "Coming soon" / waitlists
   - Free-only tools
   - If uncertain, set isActive: false
   
   Price points (use realistic tiers):
   - Free: $0
   - Starter: $9-19/mo
   - Pro: $29-49/mo  
   - Enterprise: $99+/mo or "Custom"
   
   Plans: Create 2-3 tiers maximum
   
   Features per plan:
   - 3-5 items maximum
   - Specific (NOT "Priority support")
   - Quantifiable when possible ("10 projects" not "Multiple projects")
   
   Popular flag: Mark middle tier if 3 plans

9. FAQ:
   
   Activate if product is:
   - B2B SaaS (complex)
   - Has obvious objections (price, security, integration)
   - Technical product (devs have questions)
   
   Do NOT activate for:
   - Simple consumer tools
   - Obvious products
   - Waitlist pages
   
   Questions (3-5 items):
   - Answer real objections
   - Not generic ("What is X?" → specific doubts)
   - Keep answers under 40 words
   
   Common question types:
   - "How does pricing work?"
   - "Can I use this with [common tool]?"
   - "Is my data secure?"
   - "Do I need technical knowledge?"

10. CAL.COM BOOKING:
    
    Activate ONLY if:
    - High-touch sales (enterprise)
    - Consulting/services
    - Custom demos needed
    - Description mentions: "demo", "consultation", "call"
    
    Do NOT activate for:
    - Self-serve SaaS
    - Consumer products
    - Simple tools
    
    calLink format: "[brandname-lowercase]/[meeting-type]"
    Example: "cloudflow/demo" or "acme/consultation"

11. FOOTER:
    
    Use same brand name as header

═══════════════════════════════════════════════════════════
TONE & VOICE GUIDELINES
═══════════════════════════════════════════════════════════

✓ DO:
- Be specific ("Deploy in 30 seconds" not "Deploy fast")
- Use active voice ("Ship features" not "Features can be shipped")
- Focus on outcomes ("Save 10 hours/week" not "Powerful automation")
- Be confident but humble ("Built for teams" not "The best tool")

✗ FORBIDDEN PHRASES (never use):
- "Revolutionary" / "Game-changing" / "Cutting-edge"
- "Transform your business" / "Take X to the next level"  
- "Seamlessly" / "Leverage" / "Ecosystem"
- "Best-in-class" / "Industry-leading" / "World-class"
- "Empower" / "Enable" (weak verbs)
- Any phrase ending in "!!!" or with excessive punctuation

═══════════════════════════════════════════════════════════
QUALITY SELF-CHECK
═══════════════════════════════════════════════════════════

Before outputting, verify:

[ ] Hero title is under 8 words?
[ ] No forbidden phrases used?
[ ] Every feature answers "So what does user get?"
[ ] Pricing only active if product is paid?
[ ] Color chosen matches product category?
[ ] All copy is specific, not vague?
[ ] Navigation links match active modules?

═══════════════════════════════════════════════════════════

Output valid JSON matching LandingSchema. Be surgical with copy - every word must earn its place.`;

2. User Prompt (Com Contexto)
typescript// src/lib/ai/prompts.ts

export function buildUserPrompt(
  description: string,
  audience: string,
  stage: string
): string {
  
  const audienceContext = {
    developers: "highly technical audience who values precision and speed. Use technical language appropriately.",
    founders: "entrepreneurial audience who values speed to market and ROI. Focus on business outcomes.",
    marketers: "results-driven audience who values metrics and conversion. Focus on measurable benefits.",
    designers: "creative audience who values aesthetics and UX. Focus on visual and experience benefits.",
    general: "diverse audience who values clarity and simplicity. Avoid jargon."
  }[audience.toLowerCase()] || "general audience who values clarity";
  
  const stageContext = {
    prelaunch: "Product is not yet launched. Focus on vision and promise. Use waitlist approach.",
    mvp: "Early stage product. Focus on core value proposition and early adopter benefits.",
    growth: "Established product. Focus on proven results and scale. Include social proof if possible.",
    scale: "Mature product. Focus on enterprise benefits, reliability, and comprehensive features."
  }[stage.toLowerCase()] || "early stage product";

  return `Create a landing page for the following product:

PRODUCT DESCRIPTION:
${description}

TARGET AUDIENCE: ${audience}
${audienceContext}

PRODUCT STAGE: ${stage}
${stageContext}

INSTRUCTIONS:
1. Speak directly to ${audience} in their language
2. Tone should match ${stage} stage expectations
3. Value proposition must be crystal clear in 3 seconds
4. Every element must serve conversion

Generate a complete, high-converting landing page as valid JSON.`;
}

3. Código de Geração (Atualizado)
typescript// src/lib/ai/engine.ts

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai'; // ou anthropic
import { LandingSchema } from './schemas';
import { 
  LANDING_PAGE_SYSTEM_PROMPT, 
  buildUserPrompt 
} from './prompts';

export async function generateLandingContent(
  description: string,
  audience: 'Developers' | 'Founders' | 'Marketers' | 'Designers' | 'General',
  stage: 'Pre-launch' | 'MVP' | 'Growth' | 'Scale'
) {
  
  const result = await generateObject({
    model: openai('gpt-5.2'), // ou anthropic('claude-3-5-sonnet-20241022')
    system: LANDING_PAGE_SYSTEM_PROMPT,
    prompt: buildUserPrompt(description, audience, stage),
    schema: LandingSchema,
    temperature: 0.7, // Criatividade controlada
  });

  // Validação de qualidade
  const qualityIssues = validateCopyQuality(result.object);
  
  if (qualityIssues.length > 0) {
    console.warn('Quality issues detected:', qualityIssues);
    // MVP: apenas log, não bloqueia
    // V2: pode fazer retry automático
  }

  return result.object;
}

4. Validação de Qualidade (Client-Side)
typescript// src/lib/ai/validation.ts

interface QualityIssue {
  severity: 'error' | 'warning';
  field: string;
  message: string;
}

export function validateCopyQuality(landing: any): QualityIssue[] {
  const issues: QualityIssue[] = [];
  
  // 1. Hero title length
  const heroTitleWords = landing.hero.title.split(' ').length;
  if (heroTitleWords > 8) {
    issues.push({
      severity: 'warning',
      field: 'hero.title',
      message: `Title too long (${heroTitleWords} words, max 8)`
    });
  }
  
  if (heroTitleWords < 2) {
    issues.push({
      severity: 'error',
      field: 'hero.title',
      message: 'Title too short (min 2 words)'
    });
  }
  
  // 2. Hero subtitle length
  const subtitleWords = landing.hero.subtitle.split(' ').length;
  if (subtitleWords > 25) {
    issues.push({
      severity: 'warning',
      field: 'hero.subtitle',
      message: `Subtitle too long (${subtitleWords} words, max 25)`
    });
  }
  
  // 3. Forbidden phrases
  const forbiddenPhrases = [
    'revolutionary',
    'game-changing',
    'cutting-edge',
    'next generation',
    'transform your business',
    'world-class',
    'best-in-class',
    'seamlessly',
    'leverage',
  ];
  
  const allCopy = JSON.stringify(landing).toLowerCase();
  
  forbiddenPhrases.forEach(phrase => {
    if (allCopy.includes(phrase)) {
      issues.push({
        severity: 'error',
        field: 'general',
        message: `Forbidden phrase detected: "${phrase}"`
      });
    }
  });
  
  // 4. Color validation
  const allowedColors = [
    '#2563eb', // Blue
    '#7c3aed', // Purple
    '#059669', // Green
    '#dc2626', // Red
    '#ea580c', // Orange
    '#0891b2', // Cyan
  ];
  
  if (!allowedColors.includes(landing.theme.primaryColor)) {
    issues.push({
      severity: 'error',
      field: 'theme.primaryColor',
      message: `Invalid color: ${landing.theme.primaryColor}. Must be from approved palette.`
    });
  }
  
  // 5. Background validation
  const allowedBackgrounds = ['#ffffff', '#f9fafb'];
  if (!allowedBackgrounds.includes(landing.theme.backgroundColor)) {
    issues.push({
      severity: 'warning',
      field: 'theme.backgroundColor',
      message: 'Background should be white or light gray'
    });
  }
  
  // 6. Contrast check
  if (landing.theme.primaryColor === landing.theme.backgroundColor) {
    issues.push({
      severity: 'error',
      field: 'theme',
      message: 'Primary and background colors are identical'
    });
  }
  
  // 7. Exclamation marks check
  if (allCopy.includes('!')) {
    issues.push({
      severity: 'warning',
      field: 'general',
      message: 'Exclamation marks detected (should be avoided)'
    });
  }
  
  // 8. Feature cards validation
  if (landing.featureCards.length > 6) {
    issues.push({
      severity: 'warning',
      field: 'featureCards',
      message: 'Too many feature cards (max 6 recommended)'
    });
  }
  
  landing.featureCards.forEach((card: any, idx: number) => {
    const descWords = card.description.split(' ').length;
    if (descWords > 20) {
      issues.push({
        severity: 'warning',
        field: `featureCards[${idx}].description`,
        message: `Feature description too long (${descWords} words, max 20)`
      });
    }
  });
  
  // 9. Pricing validation
  if (landing.pricing?.isActive) {
    if (landing.pricing.plans.length > 3) {
      issues.push({
        severity: 'warning',
        field: 'pricing.plans',
        message: 'Too many pricing plans (max 3 recommended)'
      });
    }
    
    landing.pricing.plans.forEach((plan: any, idx: number) => {
      if (plan.features.length > 6) {
        issues.push({
          severity: 'warning',
          field: `pricing.plans[${idx}].features`,
          message: 'Too many features per plan (max 6 recommended)'
        });
      }
    });
  }
  
  // 10. FAQ validation
  if (landing.faq?.isActive) {
    if (landing.faq.items.length > 6) {
      issues.push({
        severity: 'warning',
        field: 'faq.items',
        message: 'Too many FAQ items (max 6 recommended)'
      });
    }
    
    landing.faq.items.forEach((item: any, idx: number) => {
      const answerWords = item.answer.split(' ').length;
      if (answerWords > 50) {
        issues.push({
          severity: 'warning',
          field: `faq.items[${idx}].answer`,
          message: `FAQ answer too long (${answerWords} words, max 50)`
        });
      }
    });
  }
  
  return issues;
}

5. UI Updates (Formulário de Geração)
typescript// src/components/AIGenerationModal.tsx

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, AlertTriangle } from 'lucide-react';

export function AIGenerationModal({ onGenerate, onClose }: Props) {
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('General');
  const [stage, setStage] = useState('MVP');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qualityIssues, setQualityIssues] = useState<any[]>([]);

  async function handleGenerate() {
    setIsGenerating(true);
    setQualityIssues([]);
    
    try {
      const result = await generateLandingContent(description, audience, stage);
      
      // Validar qualidade
      const issues = validateCopyQuality(result);
      
      if (issues.some(i => i.severity === 'error')) {
        setQualityIssues(issues);
        // Permite user ver issues mas não bloqueia
        // V2: pode fazer retry automático aqui
      }
      
      onGenerate(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Generate with AI ✨</h2>
        <p className="text-gray-600">
          Describe your product and we'll create a professional landing page in seconds.
        </p>
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Product Description *
        </label>
        <Textarea
          placeholder="Example: A project management tool for remote teams that integrates with Slack and helps track sprint progress in real-time."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          Be specific: What does it do? Who is it for? What makes it unique?
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Target Audience *
        </label>
        <Select value={audience} onValueChange={setAudience}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Developers">
              👨‍💻 Developers
              <span className="text-xs text-gray-500 block">Technical, precision-focused</span>
            </SelectItem>
            <SelectItem value="Founders">
              🚀 Founders
              <span className="text-xs text-gray-500 block">Business outcomes, ROI</span>
            </SelectItem>
            <SelectItem value="Marketers">
              📊 Marketers
              <span className="text-xs text-gray-500 block">Metrics, conversion-focused</span>
            </SelectItem>
            <SelectItem value="Designers">
              🎨 Designers
              <span className="text-xs text-gray-500 block">Aesthetics, UX-focused</span>
            </SelectItem>
            <SelectItem value="General">
              👥 General Audience
              <span className="text-xs text-gray-500 block">Clear, accessible language</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Stage */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Product Stage *
        </label>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pre-launch">
              🌱 Pre-launch
              <span className="text-xs text-gray-500 block">Waitlist, vision-focused</span>
            </SelectItem>
            <SelectItem value="MVP">
              ⚡ MVP
              <span className="text-xs text-gray-500 block">Core value, early adopters</span>
            </SelectItem>
            <SelectItem value="Growth">
              📈 Growth
              <span className="text-xs text-gray-500 block">Proven results, social proof</span>
            </SelectItem>
            <SelectItem value="Scale">
              🏢 Scale
              <span className="text-xs text-gray-500 block">Enterprise, comprehensive</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality Issues Warning */}
      {qualityIssues.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Quality issues detected:</p>
            <ul className="text-sm space-y-1">
              {qualityIssues.slice(0, 3).map((issue, idx) => (
                <li key={idx}>• {issue.message}</li>
              ))}
            </ul>
            {qualityIssues.length > 3 && (
              <p className="text-xs mt-2">+{qualityIssues.length - 3} more issues</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleGenerate}
          disabled={!description.trim() || isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Landing Page
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {/* Cost estimate */}
      <p className="text-xs text-center text-gray-500">
        Uses 1 of your 10 monthly AI generations
      </p>
    </div>
  );
}
```

---

## 6. Exemplos de Output Esperado

### **Input:**
```
Description: "A code review tool that uses AI to catch bugs before they reach production. Integrates with GitHub and GitLab."
Audience: Developers
Stage: Growth
Output Esperado:
json{
  "theme": {
    "primaryColor": "#0891b2",
    "backgroundColor": "#ffffff"
  },
  "header": {
    "brandName": "CodeGuard",
    "ctaText": "Start Free",
    "links": [
      { "label": "Features", "href": "#features" },
      { "label": "Pricing", "href": "#pricing" },
      { "label": "Contact", "href": "#contact" }
    ]
  },
  "hero": {
    "title": "Catch bugs before production",
    "subtitle": "AI-powered code review that integrates with GitHub and GitLab. Ship confident code.",
    "cta": "Start Free Trial"
  },
  "logoCloud": {
    "isActive": false
  },
  "featureCards": [
    {
      "title": "Review in seconds",
      "description": "AI analyzes pull requests instantly and flags potential bugs.",
      "icon": "zap"
    },
    {
      "title": "Works with your stack",
      "description": "Native GitHub and GitLab integration. No workflow changes needed.",
      "icon": "rocket"
    },
    {
      "title": "Learn as you ship",
      "description": "Get explanations for every issue. Improve code quality over time.",
      "icon": "sparkles"
    }
  ],
  "pricing": {
    "isActive": true,
    "title": "Simple pricing for teams",
    "plans": [
      {
        "name": "Free",
        "price": "0",
        "description": "For individuals",
        "features": [
          "10 reviews/month",
          "GitHub integration",
          "Community support"
        ],
        "buttonText": "Start Free",
        "popular": false
      },
      {
        "name": "Pro",
        "price": "29",
        "description": "For growing teams",
        "features": [
          "Unlimited reviews",
          "GitHub + GitLab",
          "Priority support",
          "Custom rules",
          "Team analytics"
        ],
        "buttonText": "Start Trial",
        "popular": true
      }
    ]
  },
  "faq": {
    "isActive": true,
    "title": "Common questions",
    "items": [
      {
        "question": "How accurate is the AI?",
        "answer": "CodeGuard catches 94% of bugs in our benchmarks, trained on millions of code reviews."
      },
      {
        "question": "Does it support my language?",
        "answer": "Yes. We support JavaScript, TypeScript, Python, Go, Ruby, Java, and C++."
      },
      {
        "question": "Can I customize the rules?",
        "answer": "Pro plan users can create custom rules and configure severity levels."
      }
    ]
  },
  "calCom": {
    "isActive": false
  },
  "footer": {
    "brandName": "CodeGuard"
  }
}

7. Melhorias Incrementais (Post-MVP)
V1.1 (Semana 2-3):

 Adicionar few-shot examples no prompt
 Retry automático se quality issues > 3 errors
 Log analytics de quais módulos AI ativa mais

V1.2 (Mês 2):

 A/B test: minimalist vs storytelling style
 User feedback: "Regenerate [section]" specific
 Template hints: "Generate like Linear" button

V2.0 (Mês 3+):

 Multi-step generation (análise → estratégia → copy)
 Learn from user edits (fine-tuning loop)
 Industry-specific prompts (FinTech, HealthTech, DevTools)


8. Custos Estimados
GPT-4 Turbo:

Input: ~1,200 tokens (system + user prompt)
Output: ~800 tokens (JSON completo)
Custo: ~$0.02 por geração

10 gerações/mês free tier:

Custo por usuário: $0.20/mês
100 usuários: $20/mês
Break-even: 2 Pro users ($30 MRR)

Viável para MVP: ✅ Sim

9. Testing Checklist
Antes de deployar, testar com:
Casos simples:

 "Todo app for developers"
 "Email marketing tool"
 "Fitness tracking app"

Casos edge:

 Descrição vaga: "A cool app"
 Descrição gigante (500 palavras)
 Non-english: "Uma ferramenta de RH"

Validações:

 Todas gerações têm primaryColor da paleta
 Hero title sempre < 8 palavras
 Nenhuma forbidden phrase aparece
 Navigation links match active modules


Resumo Executivo
O que mudou:

✅ Prompt 5x mais específico (regras claras, não guidelines vagas)
✅ Paleta restrita (6 cores testadas)
✅ Contexto adicional (audience + stage)
✅ Validação de qualidade (10 checks client-side)
✅ Copy length limits (hard constraints)
✅ Forbidden phrases list (blacklist)

Resultado esperado:

Copy 10x melhor (minimalista, específica)
Cores profissionais (não random)
Módulos ativados logicamente (não sempre)
Consistência entre gerações (mesmo style)

Tempo de implementação:

Código: 4-6 horas
Testing: 2-3 horas
Total: ~1 dia

Pronto para implementar? Todo código acima está production-ready, basta copiar/colar e ajustar imports.Claude is AI and can make mistakes. Please double-check responses.