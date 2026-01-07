"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, ShieldCheck, Zap, BarChart3, Globe, Play, Sparkles, Check } from "lucide-react";
import React from "react";
import { Logo } from "@/components/brand/Logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo />

          <nav className="hidden space-x-10 md:flex">
            <Link href="#demo" className="text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors">Demo</Link>
            <Link href="#features" className="text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm font-bold text-neutral-600 hover:text-blue-600 transition-colors">Login</Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 font-bold px-6 h-11 shadow-sm">
              <Link href="/sign-up">Start Shipping Free →</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="mx-auto max-w-5xl text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl text-neutral-900 leading-[0.9]">
                Ship your idea in <span className="text-blue-600">5 minutes.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-xl text-neutral-500 font-medium md:text-2xl leading-relaxed">
                Landing pages with built-in emails, payments, <span className="text-blue-600 font-black">interactive demos</span>, and <span className="text-blue-600 font-black">native analytics.</span><br className="hidden md:block" />
                No code required. No tracking IDs to paste. Just results.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Button asChild size="lg" className="h-14 px-10 text-xl bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                  <Link href="/sign-up">Start shipping free 🚀</Link>
                </Button>
                <Link href="#demo" className="group flex items-center gap-2 text-lg font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Play className="h-5 w-5 fill-neutral-400 group-hover:fill-neutral-900" />
                  Watch interactive demo
                </Link>
              </div>

              <div className="mt-16 inline-flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-full border border-blue-200 animate-in fade-in zoom-in duration-1000 delay-500">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <p className="text-sm font-bold text-blue-900">
                  Early Access • <span className="text-blue-600">Pro 50% discount</span> for first 10 users
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Storylane Demo Container */}
        <section id="demo" className="pb-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              <div className="relative rounded-[2.5rem] border-8 border-neutral-100 bg-neutral-50 shadow-2xl shadow-blue-100/50 overflow-hidden aspect-video group">
                {/* Storylane Iframe Placeholder */}
                <iframe
                  src="https://app.storylane.io/demo/n23pbhx5zhvg"
                  className="absolute inset-0 w-full h-full border-none"
                  allowFullScreen
                  loading="lazy"
                  title="ShipKit Interactive Demo"
                />

                {/* Fallback Overlay - can be kept as a subtle gradient or removed */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50/10 pointer-events-none group-hover:opacity-0 transition-opacity">
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-white border-y border-neutral-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Everything you need to validate fast</h2>
              <p className="text-xl text-neutral-500 font-medium">Native tools built on top of the world's best APIs. No glueing required.</p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap />}
                title="Deploy in Minutes"
                description="From idea to live site in 5 minutes. Choose a template or generate with AI, and hit publish."
                color="blue"
              />
              <FeatureCard
                icon={<ShieldCheck />}
                title="Everything Integrated"
                description="Resend, Stripe, and Cal.com ready to go. Capture leads, process payments, book demos."
                color="green"
              />
              <FeatureCard
                icon={<BarChart3 />}
                title="Native Analytics"
                description="Zero-configuration tracking. Real-time metrics and visitor insights built-in from the moment you hit publish."
                color="orange"
              />
              <FeatureCard
                icon={<Globe />}
                title="Custom Domains"
                description="Connect your own domain in seconds. Automatic SSL, globally distributed edge network."
                color="purple"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="AI Copywriter"
                description="Generate persuasive headlines and high-converting copy in seconds with our AI engine."
                color="blue"
              />
              <FeatureCard
                icon={<Rocket />}
                title="Built to Scale"
                description="Starts fast, stays fast. Powered by Vercel's infrastructure to handle any traffic spike."
                color="red"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 bg-neutral-50/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ship in 3 simple steps</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <StepItem
                number="1"
                title="Choose a Template"
                description="Pick from our collection of SaaS-optimized templates or let AI build your first draft."
              />
              <StepItem
                number="2"
                title="AI Copy & Connect"
                description="Our AI generates high-converting copy from your business idea. Set up integrations (Stripe, Resend) in seconds."
              />
              <StepItem
                number="3"
                title="Publish & Share"
                description="Hit live. Your landing is served globally. Start sharing and collecting results."
                last
              />
            </div>

            <div className="mt-20 text-center">
              <Button asChild size="lg" className="h-14 px-10 text-xl bg-blue-600 hover:bg-blue-700 font-black shadow-lg">
                <Link href="/sign-up">Start now →</Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Integrations & Modules */}
        <section id="integrations" className="py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Zero-Config Integrations</h2>
              <p className="text-xl text-neutral-500 font-medium">Your favorite tools, natively supported. Just drop your ID and go.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <IntegrationCard
                title="Storylane"
                description="Interactive product tours that convert browsers into buyers."
                icon={<Play className="h-6 w-6" />}
                badge="Demos"
                color="purple"
              />
              <IntegrationCard
                title="Cal.com"
                description="Hassle-free scheduling for demos and consultations."
                icon={<Globe className="h-6 w-6" />}
                badge="Bookings"
                color="blue"
              />
              <IntegrationCard
                title="Resend"
                description="Automated waitlists and email capture that just works."
                icon={<Rocket className="h-6 w-6" />}
                badge="Emails"
                color="green"
              />
              <IntegrationCard
                title="Analytics"
                description="Built-in tracking for visitors, sources, and conversion."
                icon={<BarChart3 className="h-6 w-6" />}
                badge="Native"
                color="orange"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 bg-neutral-50/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <FAQItem
                question="Do I need coding skills?"
                answer="Nope! ShipKit is 100% no-code. Describe your idea, AI does the rest. You can customize everything visually."
              />
              <FAQItem
                question="Can I use my own domain?"
                answer="Yes! Pro plan supports unlimited custom domains with simple CNAME setup. We handle SSL automatically."
              />
              <FAQItem
                question="How do payments work?"
                answer="Connect your Stripe account via OAuth. Money goes directly to you. We never touch your revenue."
              />
              <FAQItem
                question="What if I want to cancel?"
                answer="Cancel anytime. Your landings stay live until the end of your billing period. No hidden fees."
              />
              <FAQItem
                question="How accurate is the AI?"
                answer="AI generates professional, high-converting copy in 10 seconds. You can edit every word before publishing."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Simple, transparent pricing</h2>
              <p className="text-xl text-neutral-500 font-medium">Pay for what you need, grow as you ship.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
              {/* Launch Special Badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white animate-bounce">
                  🎉 Launch Special: 50% lifetime discount for first 10 Pro users
                </div>
              </div>
              <PricingCard
                name="Free"
                price="0"
                description="Perfect for validating your first idea."
                features={[
                  "2 landing pages",
                  "10 AI generations / mo 🤖",
                  "500 leads / month",
                  "ShipKit subdomain",
                  "All integrations included"
                ]}
                cta="Start Shipping Free"
              />
              <PricingCard
                name="Pro"
                price="15"
                description="For serial hunters and indie hackers."
                features={[
                  "Unlimited landing pages",
                  "Unlimited AI generations 🚀",
                  "Custom domains",
                  "Unlimited leads",
                  "Remove ShipKit branding",
                  "Priority support (24h)"
                ]}
                cta="Go Pro Now"
                featured
              />
            </div>

            <p className="mt-12 text-center text-neutral-400 font-bold">
              💳 No credit card required to start
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="space-y-4 max-w-xs">
              <Logo />
              <p className="text-neutral-500 font-medium">Ship your idea in 5 minutes. The toolkit for indie hackers.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <FooterGroup title="Product" links={["Features", "Pricing", "Templates"]} />
              <FooterGroup title="Company" links={["About", "Twitter", "GitHub"]} />
              <FooterGroup title="Legal" links={["Privacy", "Terms"]} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 border-t border-neutral-50">
            <p className="text-sm font-bold text-neutral-400">© 2026 ShipKit. Built for Indie Hackers.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-neutral-900">Twitter</Link>
              <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-neutral-900">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IntegrationCard({ title, description, icon, badge, color }: { title: string; description: string; icon: React.ReactNode; badge: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className="p-8 rounded-[2rem] border border-neutral-100 bg-white hover:border-neutral-200 transition-all shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-black text-neutral-900">{title}</h3>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorMap[color]}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm font-medium text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-neutral-100 shadow-sm">
      <h3 className="text-lg font-black text-neutral-900 mb-2">{question}</h3>
      <p className="text-neutral-500 font-medium leading-relaxed">{answer}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="group relative rounded-[2rem] border border-neutral-100 bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 active:scale-[0.98]">
      <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-7 w-7" })}
      </div>
      <h3 className="text-2xl font-black mb-3 text-neutral-900 tracking-tight">{title}</h3>
      <p className="text-neutral-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description, last }: { number: string; title: string; description: string; last?: boolean }) {
  return (
    <div className="relative">
      <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-blue-200">
        {number}
      </div>
      <h3 className="text-2xl font-black mb-3 tracking-tight">{title}</h3>
      <p className="text-lg text-neutral-500 font-medium leading-relaxed">{description}</p>
      {!last && (
        <div className="hidden md:block absolute top-6 left-12 w-full h-[2px] bg-neutral-100 -z-10" />
      )}
    </div>
  );
}

function PricingCard({ name, price, description, features, cta, featured }: { name: string; price: string; description: string; features: string[]; cta: string; featured?: boolean }) {
  return (
    <div className={`relative rounded-[2.5rem] p-10 transition-all ${featured
      ? "bg-neutral-900 text-white shadow-2xl shadow-blue-200 scale-105 z-10"
      : "bg-white border-2 border-neutral-100"
      }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-2xl font-black mb-2">{name}</h3>
        <p className={featured ? "text-neutral-400 font-medium" : "text-neutral-500 font-medium"}>{description}</p>
      </div>
      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tighter">${price}</span>
        <span className={featured ? "text-neutral-400 font-bold" : "text-neutral-500 font-bold"}>/mo</span>
      </div>
      <ul className="mb-10 space-y-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 font-semibold">
            <div className={`p-1 rounded-full ${featured ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Check className="h-3 w-3" />
            </div>
            <span className={featured ? "text-neutral-200" : "text-neutral-600"}>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`w-full h-12 text-lg font-black rounded-2xl transition-transform active:scale-95 ${featured ? "bg-white text-neutral-900 hover:bg-neutral-100" : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        <Link href="/sign-up">{cta}</Link>
      </Button>
    </div>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">{title}</h4>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link href="#" className="text-sm font-bold text-neutral-500 hover:text-blue-600 transition-colors">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
