import { generateObject } from 'ai';
import { z } from 'zod';
import { getAIProvider } from './config';

// Define the schema of what the AI should output (mappings to Craft.js components)
const LandingSchema = z.object({
    theme: z.object({
        primaryColor: z.string().describe("Hex color for primary actions, e.g., #6366f1"),
        backgroundColor: z.string().describe("Hex color for the page background, e.g., #ffffff or #f9fafb"),
    }).strict(),
    header: z.object({
        brandName: z.string(),
        ctaText: z.string(),
        links: z.array(z.object({
            label: z.string(),
            href: z.string(),
        })).describe("3 logical nav links, e.g., Features, Pricing, About"),
    }).strict(),
    footer: z.object({
        brandName: z.string(),
    }).strict(),
    hero: z.object({
        title: z.string(),
        subtitle: z.string(),
        cta: z.string(),
    }).strict(),
    logoCloud: z.object({
        isActive: z.boolean().describe("Set to true if business has partnerships or clients"),
        title: z.string(),
        logos: z.array(z.string()).describe("6 names of famous companies or relevant partners"),
    }).strict(),
    leadForm: z.object({
        placeholder: z.string(),
        buttonText: z.string(),
    }).strict(),
    featureCards: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.enum(["zap", "shield", "rocket", "heart", "star", "sparkles"]),
    }).strict()),
    pricing: z.object({
        isActive: z.boolean().describe("Set to true for productized SaaS or services"),
        title: z.string(),
        plans: z.array(z.object({
            name: z.string(),
            price: z.string(),
            description: z.string(),
            features: z.array(z.string()),
            buttonText: z.string(),
            popular: z.boolean(),
        }).strict()),
    }).strict(),
    faq: z.object({
        isActive: z.boolean().describe("Set to true to answer common user questions"),
        title: z.string(),
        items: z.array(z.object({
            question: z.string(),
            answer: z.string(),
        }).strict()),
    }).strict(),
    calCom: z.object({
        isActive: z.boolean().describe("Set to true for high-touch services or demos"),
        title: z.string(),
        subtitle: z.string(),
        calLink: z.string().describe("A guess for a cal.com link, e.g. company/demo"),
    }).strict(),
}).strict();

// System Prompt for high-conversion minimalist design
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

export function buildUserPrompt(
    description: string,
    audience: string,
    stage: string
): string {

    const audienceContext: Record<string, string> = {
        developers: "highly technical audience who values precision and speed. Use technical language appropriately.",
        founders: "entrepreneurial audience who values speed to market and ROI. Focus on business outcomes.",
        marketers: "results-driven audience who values metrics and conversion. Focus on measurable benefits.",
        designers: "creative audience who values aesthetics and UX. Focus on visual and experience benefits.",
        general: "diverse audience who values clarity and simplicity. Avoid jargon."
    };

    const stageContext: Record<string, string> = {
        prelaunch: "Product is not yet launched. Focus on vision and promise. Use waitlist approach.",
        mvp: "Early stage product. Focus on core value proposition and early adopter benefits.",
        growth: "Established product. Focus on proven results and scale. Include social proof if possible.",
        scale: "Mature product. Focus on enterprise benefits, reliability, and comprehensive features."
    };

    const selectedAudience = audienceContext[audience.toLowerCase()] || audienceContext.general;
    const selectedStage = stageContext[stage.toLowerCase()] || stageContext.mvp;

    return `Create a landing page for the following product:

PRODUCT DESCRIPTION:
${description}

TARGET AUDIENCE: ${audience}
${selectedAudience}

PRODUCT STAGE: ${stage}
${selectedStage}

INSTRUCTIONS:
1. Speak directly to ${audience} in their language
2. Tone should match ${stage} stage expectations
3. Value proposition must be crystal clear in 3 seconds
4. Every element must serve conversion

Generate a complete, high-converting landing page as valid JSON.`;
}

export async function generateLandingContent(
    description: string,
    audience: string = 'General',
    stage: string = 'MVP'
) {
    const model = getAIProvider();

    const { object } = await generateObject({
        model,
        schema: LandingSchema,
        system: LANDING_PAGE_SYSTEM_PROMPT,
        prompt: buildUserPrompt(description, audience, stage),
    });

    // Simple quality validation log
    const heroWords = object.hero.title.split(' ').length;
    if (heroWords > 8) {
        console.warn(`[AI Quality] Hero title too long: ${heroWords} words`);
    }

    const forbidden = ["revolutionary", "game-changing", "cutting-edge", "transform your business", "seamlessly", "leverage"];
    const allCopy = JSON.stringify(object).toLowerCase();
    forbidden.forEach(phrase => {
        if (allCopy.includes(phrase)) console.warn(`[AI Quality] Forbidden phrase detected: ${phrase}`);
    });

    return object;
}
