Analytics Nativo via Google Analytics 4 + Clarity (Sem Conta do Usuário)
Excelente ideia! Sim, é 100% possível e recomendado para MVP. Vou detalhar a arquitetura completa.

1. Problema que Você Quer Resolver
Situação atual (concorrentes):
User cria landing → precisa:
1. Criar conta Google Analytics
2. Copiar tracking ID
3. Colar no campo "GA ID"
4. Esperar 24-48h para dados

Friction: ALTA
Adoção de analytics: ~30-40%
Sua proposta (ShipKit Analytics Nativo):
User cria landing → analytics já funciona
- Zero configuração
- Dados em tempo real
- Dashboard dentro do ShipKit

Friction: ZERO
Adoção de analytics: 100%
Diferencial competitivo: ✅ Massive

2. Arquitetura: Multi-Tenant Analytics via GA4
Conceito: Uma Conta GA4, Múltiplas "Properties"
Google Analytics 4 suporta Data Streams e Custom Dimensions que permitem segmentar dados por projeto/usuário.
Estratégia recomendada para MVP:
ShipKit GA4 Account (sua)
  └─ Property: "ShipKit Landings"
      └─ Data Stream: Web
          └─ Measurement ID: G-XXXXXXXXXX (único, compartilhado)
              └─ Custom Dimensions:
                  - landing_id (unique per landing)
                  - user_id (owner)
                  - subdomain
Como funciona:

Todas landings usam mesmo Measurement ID
Cada pageview envia landing_id como custom dimension
Você filtra dashboard por landing_id específico
User vê apenas dados da landing dele


3. Implementação Técnica Completa
A. Setup GA4 (One-time, você faz)
bash1. Criar conta Google Analytics
2. Criar Property "ShipKit Landings"
3. Criar Data Stream (Web)
4. Copiar Measurement ID: G-XXXXXXXXXX
5. Configurar Custom Dimensions:
   - landing_id (scope: Event)
   - user_id (scope: Event)
   - subdomain (scope: Event)
   - plan_tier (scope: User) # free vs pro
```

**Custom Dimensions no GA4 Admin:**
```
Admin → Property → Custom Definitions → Create custom dimension

Dimension 1:
- Dimension name: landing_id
- Scope: Event
- Event parameter: landing_id

Dimension 2:
- Dimension name: user_id
- Scope: Event  
- Event parameter: user_id

Dimension 3:
- Dimension name: subdomain
- Scope: Event
- Event parameter: subdomain

B. Tracking Code (Auto-Inject em Cada Landing)
typescript// src/app/[domain]/page.tsx (landing renderer)

import Script from 'next/script';
import { getLandingByDomain } from '@/lib/db';

export default async function LandingPage({ params }: { params: { domain: string } }) {
  const landing = await getLandingByDomain(params.domain);
  
  if (!landing) return notFound();

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Configure GA4 com custom dimensions
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            landing_id: '${landing.id}',
            user_id: '${landing.user_id}',
            subdomain: '${landing.subdomain}',
            plan_tier: '${landing.plan_tier}', // 'free' ou 'pro'
            send_page_view: true
          });

          // Track custom events
          window.shipkitTrack = function(eventName, params) {
            gtag('event', eventName, {
              landing_id: '${landing.id}',
              user_id: '${landing.user_id}',
              ...params
            });
          };
        `}
      </Script>

      {/* Microsoft Clarity (opcional, grátis) */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          
          // Tag com landing_id
          clarity("set", "landing_id", "${landing.id}");
          clarity("set", "user_id", "${landing.user_id}");
        `}
      </Script>

      {/* Render landing components */}
      {renderLanding(landing.design_json)}
    </>
  );
}

C. Event Tracking (Form Submits, CTA Clicks)
typescript// components/blocks/Form.tsx

'use client';

import { useState } from 'react';

export function LeadForm({ landingId }: { landingId: string }) {
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Track event no GA4
    if (typeof window !== 'undefined' && (window as any).shipkitTrack) {
      (window as any).shipkitTrack('lead_capture', {
        email_domain: email.split('@')[1], // ex: gmail.com (não PII)
        form_location: 'hero' // ou 'footer'
      });
    }

    // Submete lead
    await fetch('/api/leads/submit', {
      method: 'POST',
      body: JSON.stringify({ landingId, email })
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
      />
      <button type="submit">Get Started</button>
    </form>
  );
}
typescript// components/blocks/Hero.tsx

export function Hero({ cta, landingId }: Props) {
  function handleCTAClick() {
    // Track CTA click
    if (typeof window !== 'undefined' && (window as any).shipkitTrack) {
      (window as any).shipkitTrack('cta_click', {
        cta_text: cta,
        cta_location: 'hero'
      });
    }
  }

  return (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button onClick={handleCTAClick}>
        {cta}
      </button>
    </section>
  );
}

D. Backend: Fetch Analytics Data (GA4 Data API)
typescript// src/lib/analytics/ga4.ts

import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
});

const propertyId = process.env.GA4_PROPERTY_ID; // ex: '123456789'

export async function getLandingAnalytics(
  landingId: string,
  startDate: string = '7daysAgo',
  endDate: string = 'today'
) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'date' },
        { name: 'deviceCategory' }, // mobile, desktop, tablet
        { name: 'sessionSource' }, // google, twitter, direct
      ],
      metrics: [
        { name: 'activeUsers' }, // Unique visitors
        { name: 'screenPageViews' }, // Page views
        { name: 'sessions' }, // Sessions
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'customEvent:landing_id',
          stringFilter: {
            matchType: 'EXACT',
            value: landingId,
          },
        },
      },
    });

    // Parse response
    const metrics = {
      totalViews: 0,
      uniqueVisitors: 0,
      sessions: 0,
      avgDuration: 0,
      bounceRate: 0,
      byDevice: {} as Record<string, number>,
      bySources: {} as Record<string, number>,
      dailyViews: [] as Array<{ date: string; views: number }>,
    };

    response.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || '';
      const device = row.dimensionValues?.[1]?.value || 'unknown';
      const source = row.dimensionValues?.[2]?.value || 'direct';
      
      const visitors = parseInt(row.metricValues?.[0]?.value || '0');
      const views = parseInt(row.metricValues?.[1]?.value || '0');
      const sessions = parseInt(row.metricValues?.[2]?.value || '0');

      metrics.totalViews += views;
      metrics.uniqueVisitors += visitors;
      metrics.sessions += sessions;

      // Aggregate by device
      metrics.byDevice[device] = (metrics.byDevice[device] || 0) + views;

      // Aggregate by source
      metrics.bySources[source] = (metrics.bySources[source] || 0) + views;

      // Daily breakdown
      const existing = metrics.dailyViews.find(d => d.date === date);
      if (existing) {
        existing.views += views;
      } else {
        metrics.dailyViews.push({ date, views });
      }
    });

    return metrics;
  } catch (error) {
    console.error('GA4 API Error:', error);
    throw error;
  }
}

// Buscar eventos customizados (lead captures, CTA clicks)
export async function getLandingEvents(
  landingId: string,
  eventName: string,
  startDate: string = '7daysAgo',
  endDate: string = 'today'
) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'eventName' },
      { name: 'date' },
    ],
    metrics: [
      { name: 'eventCount' },
    ],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'customEvent:landing_id',
              stringFilter: { matchType: 'EXACT', value: landingId },
            },
          },
          {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'EXACT', value: eventName },
            },
          },
        ],
      },
    },
  });

  const events = response.rows?.map((row) => ({
    date: row.dimensionValues?.[1]?.value || '',
    count: parseInt(row.metricValues?.[0]?.value || '0'),
  })) || [];

  return {
    eventName,
    totalCount: events.reduce((sum, e) => sum + e.count, 0),
    daily: events,
  };
}

E. API Route (Expor Analytics pro Frontend)
typescript// src/app/api/analytics/[landingId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getLandingAnalytics, getLandingEvents } from '@/lib/analytics/ga4';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { landingId: string } }
) {
  try {
    // Autenticação
    const user = await requireAuth(req);

    // Verifica ownership
    const { data: landing } = await supabase
      .from('landings')
      .select('user_id')
      .eq('id', params.landingId)
      .single();

    if (landing?.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Query params (date range)
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || '7daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    // Fetch GA4 data
    const [analytics, leadCaptureEvents, ctaClickEvents] = await Promise.all([
      getLandingAnalytics(params.landingId, startDate, endDate),
      getLandingEvents(params.landingId, 'lead_capture', startDate, endDate),
      getLandingEvents(params.landingId, 'cta_click', startDate, endDate),
    ]);

    // Fetch leads from DB (para comparar)
    const { count: leadsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('landing_id', params.landingId)
      .gte('created_at', getDateFromRange(startDate))
      .lte('created_at', getDateFromRange(endDate));

    return NextResponse.json({
      analytics,
      events: {
        leadCaptures: leadCaptureEvents.totalCount,
        ctaClicks: ctaClickEvents.totalCount,
      },
      leads: {
        captured: leadsCount || 0, // Do DB (source of truth)
      },
      conversionRate: analytics.uniqueVisitors > 0
        ? ((leadsCount || 0) / analytics.uniqueVisitors * 100).toFixed(2)
        : '0.00',
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function getDateFromRange(range: string): string {
  if (range === 'today') return new Date().toISOString();
  if (range === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  }
  if (range.endsWith('daysAgo')) {
    const days = parseInt(range);
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }
  return range; // Assume ISO format
}

F. Dashboard UI (Dentro do ShipKit)
typescript// src/components/AnalyticsDashboard.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Users, MousePointerClick, Mail, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    sessions: number;
    avgDuration: number;
    bounceRate: number;
    byDevice: Record<string, number>;
    bySources: Record<string, number>;
    dailyViews: Array<{ date: string; views: number }>;
  };
  events: {
    leadCaptures: number;
    ctaClicks: number;
  };
  leads: {
    captured: number;
  };
  conversionRate: string;
}

export function AnalyticsDashboard({ landingId }: { landingId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7daysAgo');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/${landingId}?startDate=${dateRange}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [landingId, dateRange]);

  if (loading || !data) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="today">Today</option>
          <option value="7daysAgo">Last 7 days</option>
          <option value="30daysAgo">Last 30 days</option>
          <option value="90daysAgo">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Eye />}
          label="Page Views"
          value={data.analytics.totalViews.toLocaleString()}
          color="blue"
        />
        <MetricCard
          icon={<Users />}
          label="Unique Visitors"
          value={data.analytics.uniqueVisitors.toLocaleString()}
          color="green"
        />
        <MetricCard
          icon={<Mail />}
          label="Leads Captured"
          value={data.leads.captured.toLocaleString()}
          color="purple"
        />
        <MetricCard
          icon={<TrendingUp />}
          label="Conversion Rate"
          value={`${data.conversionRate}%`}
          color="orange"
        />
      </div>

      {/* Daily Views Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Page Views</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.analytics.dailyViews}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="space-y-2">
            {Object.entries(data.analytics.bySources)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([source, views]) => (
                <div key={source} className="flex justify-between">
                  <span className="capitalize">{source}</span>
                  <span className="font-medium">{views} views</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Devices</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={Object.entries(data.analytics.byDevice).map(([device, views]) => ({ device, views }))}>
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">CTA Clicks</p>
            <p className="text-2xl font-bold">{data.events.ctaClicks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Session Duration</p>
            <p className="text-2xl font-bold">{Math.round(data.analytics.avgDuration)}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bounce Rate</p>
            <p className="text-2xl font-bold">{data.analytics.bounceRate.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Powered by note */}
      <p className="text-xs text-center text-gray-500">
        Analytics powered by Google Analytics 4 & Microsoft Clarity
      </p>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

4. Setup GA4 Service Account (Para API Access)
bash# 1. Ir para Google Cloud Console
https://console.cloud.google.com/

# 2. Criar projeto "ShipKit Analytics"

# 3. Ativar Analytics Data API
https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

# 4. Criar Service Account
IAM & Admin → Service Accounts → Create Service Account
- Name: shipkit-analytics
- Role: Viewer

# 5. Criar chave JSON
Service Account → Keys → Add Key → JSON
- Download arquivo shipkit-analytics-xxx.json

# 6. Adicionar Service Account ao GA4
Google Analytics → Admin → Property Access Management
- Add Users → Colar service account email
- Role: Viewer
bash# .env.local
GA4_CLIENT_EMAIL=shipkit-analytics@xxx.iam.gserviceaccount.com
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GA4_PROPERTY_ID=123456789

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxx # opcional

5. Microsoft Clarity (Bonus - Heatmaps & Recordings)
Por quê adicionar:

100% grátis
Heatmaps visuais
Session recordings
Rage clicks detection
Complementa GA4

Setup:
typescript1. Criar conta: https://clarity.microsoft.com/
2. Criar projeto "ShipKit Landings"
3. Copiar Clarity ID
4. Tag cada landing com landing_id (já no código acima)
```

**Acessar gravações:**
```
Clarity Dashboard → Filters
- Custom tag: landing_id = "abc-123-xyz"
- View recordings daquela landing específica
Expor no ShipKit:
typescript// Dashboard component
<Card>
  <h3>Session Recordings</h3>
  <a 
    href={`https://clarity.microsoft.com/projects/view/${clarityProjectId}/filters?customTags=landing_id:${landingId}`}
    target="_blank"
    className="btn"
  >
    View recordings in Clarity →
  </a>
</Card>
```

---

## 6. Custos e Limites

### **Google Analytics 4:**
- **Gratuito** até 10M events/mês
- Estimativa ShipKit: ~50K events/mês (100 landings × 500 views × ~1 event/view)
- **Custo: $0**

### **Microsoft Clarity:**
- **Gratuito** ilimitado
- **Custo: $0**

### **GA4 Data API:**
- **Gratuito** até 100K requests/dia
- ShipKit: ~1K requests/dia (10 users × 100 refreshes)
- **Custo: $0**

**Total MVP: $0 🎉**

---

## 7. Vantagens vs Desvantagens

### **✅ Vantagens:**

1. **Zero Friction:**
   - User não precisa criar conta GA/Clarity
   - Analytics funciona em < 5min (promise delivery)

2. **Custo Zero:**
   - Nenhum custo adicional pro MVP
   - Escala até 1000s de landings free

3. **Dados Centralizados:**
   - Você vê todas métricas agregadas
   - Pode fazer benchmarks ("Média de conversão: 8%")

4. **Melhor UX:**
   - Dashboard integrado (não redirect pra GA)
   - Métricas simplificadas (não overwhelm)

5. **Compliance:**
   - GA4 é GDPR-friendly (sem cookies obrigatórios)
   - Você controla data retention

6. **Marketing:**
   - "Analytics included, zero config" = killer feature
   - Diferencial vs Carrd/Webflow

---

### **⚠️ Desvantagens (e Mitigações):**

1. **User não tem "raw access" ao GA:**
   - **Mitigation:** Oferecer export CSV no Pro plan
   - **V2:** Permitir conectar próprio GA (opcional)

2. **Você vê dados de todos:**
   - **Mitigation:** RLS no backend (user só vê seu landing_id)
   - **Privacy:** Não logar PII (emails, IPs anonimizados)

3. **Limite de 50 custom dimensions no GA4:**
   - **Mitigation:** Só usar 3-4 dimensions críticas
   - **Scale:** Se crescer muito, migrar pra BigQuery

4. **API rate limits:**
   - **Mitigation:** Cache analytics por 1h no Redis/Vercel KV
   - **Scale:** Batch requests

5. **Se GA4 cair, todos perdem analytics:**
   - **Mitigation:** Fallback: contar leads no DB (sempre funciona)
   - **V2:** Dual-track (GA4 + PostHog self-hosted)

---

## 8. Roadmap de Analytics

### **MVP (Agora):**
- [x] GA4 tracking automático
- [x] Custom dimensions (landing_id, user_id)
- [x] Dashboard básico (views, visitors, leads, conversion)
- [x] Traffic sources
- [x] Device breakdown
- [ ] Clarity integration (heatmaps)

### **V1.1 (Mês 2):**
- [ ] Cache analytics (Redis/Vercel KV)
- [ ] Comparação com período anterior ("↑ 23% vs last week")
- [ ] Alertas ("🎉 You hit 100 visitors!")
- [ ] Export CSV

### **V1.5 (Mês 3-4):**
- [ ] Funnel visualization (views → clicks → leads)
- [ ] UTM tracking (campaigns)
- [ ] Geo breakdown (países)
- [ ] Referrer details

### **V2.0 (Mês 6+):**
- [ ] Permitir conectar próprio GA (opcional)
- [ ] Real-time dashboard (WebSockets)
- [ ] A/B test analytics
- [ ] Heatmaps integrados (via Clarity API)
- [ ] Cohort analysis

---

## 9. Alternativas Consideradas

| Solução | Prós | Contras | Veredicto |
|---------|------|---------|-----------|
| **GA4 (escolhida)** | Grátis, robusto, escala | Complexo setup | ✅ Melhor pra MVP |
| **Plausible** | Privacy-first, simples | $9/mês + não tem custom dimensions | ❌ Caro + limitado |
| **PostHog** | Open-source, completo | Self-hosted = DevOps | 🟡 V2.0 talvez |
| **Mixpanel** | Product analytics | $25/mês, overkill | ❌ Overengineering |
| **Custom (Supabase)** | Full control | Precisa buildar tudo | ❌ Muito trabalho |

---

## 10. Implementação: Checklist

### **Setup Inicial (1-time):**
- [ ] Criar conta Google Analytics
- [ ] Criar Property "ShipKit Landings"
- [ ] Configurar custom dimensions (landing_id, user_id, subdomain)
- [ ] Criar Service Account
- [ ] Download JSON credentials
- [ ] Adicionar env vars (GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, etc)
- [ ] Testar API access (run script de teste)

### **Código (3-4 horas):**
- [ ] Injetar GA4 tracking code em `[domain]/page.tsx`
- [ ] Adicionar event tracking (lead_capture, cta_click)
- [ ] Implementar `lib/analytics/ga4.ts` (funções de fetch)
- [ ] Criar API route `/api/analytics/[landingId]`
- [ ] Build `AnalyticsDashboard` component
- [ ] Adicionar aba "Analytics" no dashboard

### **Testing:**
- [ ] Publicar landing de teste
- [ ] Visitar landing várias vezes (devices diferentes)
- [ ] Submeter form
- [ ] Esperar 5-10min (GA4 delay)
- [ ] Verificar dados no dashboard ShipKit
- [ ] Verificar dados no GA4 admin (sanity check)

### **Documentação:**
- [ ] README: Como analytics funciona
- [ ] FAQ: "Posso usar meu próprio GA?" (V2)
- [ ] Privacy policy: Mencionar GA4/Clarity

---

## 11. Marketing Copy Atualizado

### **Homepage (adicionar feature):**
```
┌─────────────────────┐
│         📊          │
│  Analytics Included │
│                     │
│  See exactly who's  │
│  visiting. No setup,│
│  no tracking codes. │
│  Just instant data. │
└─────────────────────┘
```

### **Hero (update):**
```
Ship your idea in 5 minutes
- WITH BUILT-IN ANALYTICS -

Landing pages with email, payments, and analytics.
Zero config. Just ship.
Comparison Table (vs competitors):
FeatureShipKitCarrdWebflowAnalytics✅ Built-in❌ Bring your own❌ Bring your ownSetup time0 min30+ min30+ minCostFree$10-20/mo extra$15-20/mo extra

12. Privacy & Compliance
GDPR:
html<!-- Cookie banner (se necessário) -->
<CookieBanner>
  We use Google Analytics to understand how visitors use our site.
  No personal data is collected.
  <button>Accept</button> <a href="/privacy">Learn more</a>
</CookieBanner>
```

### **Privacy Policy (adicionar):**
```
ANALYTICS & TRACKING

ShipKit uses Google Analytics 4 and Microsoft Clarity to collect 
anonymous usage data:

- Page views and session duration
- Device type and browser
- Traffic sources (referrer)
- Geographic location (country/city level)

We DO NOT collect:
- Personal identifiable information (names, emails from forms)
- IP addresses (anonymized by GA4)
- Individual user behavior across sites

You can opt-out: [Link to GA opt-out]

Data retention: 14 months (GA4 default)

13. Código Resumido (Copy-Paste Ready)
bash# 1. Install dependencies
npm install @google-analytics/data
npm install recharts # para gráficos
typescript// .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_PROPERTY_ID=123456789
GA4_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

NEXT_PUBLIC_CLARITY_ID=xxxxxxxxx # opcional
typescript// src/app/[domain]/page.tsx
import Script from 'next/script';

export default async function LandingPage({ params }) {
  const landing = await getLandingByDomain(params.domain);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
          landing_id: '${landing.id}',
          user_id: '${landing.user_id}',
          subdomain: '${landing.subdomain}'
        });
      `}</Script>
      
      {renderLanding(landing)}
    </>
  );
}
typescript// src/lib/analytics/ga4.ts
// (Código completo na seção D acima)
typescript// src/app/api/analytics/[landingId]/route.ts
// (Código completo na seção E acima)
typescript// src/components/AnalyticsDashboard.tsx
// (Código completo na seção F acima)

Resumo Executivo
✅ SIM, é 100% viável e RECOMENDADO
Vantagens:

Zero friction (user não configura nada)
Custo zero (GA4 + Clarity free)
Diferencial competitivo (concorrentes não têm)
Marketing killer ("Analytics included")

Implementação:

Setup: 1-2 horas (GA4 account + service account)
Código: 3-4 horas (tracking + API + dashboard)
Total: ~1 dia

Resultado:

User publica landing → analytics já funcionando
Dashboard mostra: views, visitors, leads, conversion, sources, devices
Promise delivery: "Ship in 5min" = TRUE (analytics included)

Next steps:

Criar conta GA4 agora
Configurar custom dimensions
Setup service account
Implementar código (seções acima)
Testar com landing de teste
Update marketing copy