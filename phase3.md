# Phase 3 - Implementação Robusta ProductStory

> Plano de correção estrutural para viabilidade comercial  
> Baseado em análise crítica das lacunas atuais

---

## 🎯 Objetivo

Transformar ProductStory de "feature completa mas frágil" para "produto mínimo mas vendável".

**Premissa:** Storylane cobra $40-$500/mês. Para competir com "80% do valor por 40% do preço", precisamos:
1. Multi-hotspot por tela
2. Embed bulletproof
3. Published snapshots
4. Simplicidade percebida

---

## 📊 Priorização

| # | Item | Impacto | Esforço | Prioridade |
|---|------|---------|---------|------------|
| 1 | Multi-hotspot por tela | 🔴 Crítico | Alto | P0 |
| 2 | Embed bulletproof | 🔴 Crítico | Médio | P0 |
| 3 | Published snapshots | 🔴 Crítico | Médio | P0 |
| 4 | Separar hotspot de step | 🟡 Alto | Alto | P1 |
| 5 | Analytics confiável | 🟡 Alto | Médio | P1 |
| 6 | Rate limit & abuse | 🟡 Alto | Baixo | P1 |
| 7 | Performance (imagens) | 🟡 Alto | Médio | P2 |
| 8 | Mobile/responsive | 🟡 Alto | Alto | P2 |
| 9 | Simplificar UI (presets) | 🟢 Médio | Baixo | P2 |
| 10 | Lead forms compliance | 🟢 Médio | Baixo | P3 |

---

## 🔴 P0 - Crítico (Bloqueia Venda)

### 1. Multi-Hotspot por Tela

**Problema atual:** Limite de 1 hotspot/screen mata 70% dos casos reais.

**Solução:**

#### 1.1 Schema (já suporta)
```typescript
// demoHotspots já tem screenId - múltiplos registros OK
// Adicionar campo para ordenação dentro da tela
demoHotspots: {
  ...existing,
  orderInScreen: integer("order_in_screen").default(0),
}
```

#### 1.2 Editor - ScreenCanvas.tsx
```typescript
// Remover:
const hasHotspot = screen.hotspots.length > 0;
if (hasHotspot) return; // ← REMOVER

// Adicionar:
const handleCanvasClick = (e) => {
  // Criar hotspot sem limite
  const coords = getRelativeCoords(e);
  onHotspotCreate({ x: coords.x, y: coords.y });
};

// Lista lateral de hotspots por tela
<HotspotList 
  hotspots={screen.hotspots}
  selectedId={selectedHotspotId}
  onSelect={setSelectedHotspotId}
  onReorder={handleReorder}
  onDelete={handleDelete}
/>
```

#### 1.3 Viewer - Modos de navegação
```typescript
type NavigationMode = 'guided' | 'free_explore';

// Guided: steps definem qual hotspot está ativo
// Free: todos os hotspots clicáveis
```

#### 1.4 Arquivos a modificar
- [ ] `src/db/schema.ts` - adicionar `orderInScreen`
- [ ] `src/components/productstory/ScreenCanvas.tsx` - remover limite
- [ ] `src/components/productstory/DemoEditor.tsx` - lista de hotspots
- [ ] `src/components/productstory/DemoPlayer.tsx` - renderizar múltiplos
- [ ] `src/app/actions/demos.ts` - reorder hotspots

---

### 2. Embed Bulletproof

**Problema atual:** Embed "meio implementado" quebra adoção.

#### 2.1 Rota dedicada de embed
```
/productstory/embed/[publicId]/page.tsx
```

```typescript
// Diferenças do viewer normal:
// - Layout mínimo (sem header/footer)
// - CSP para frame-ancestors
// - PostMessage para resize
// - Parâmetros de tema

export default function EmbedPage({ params, searchParams }) {
  const { publicId } = await params;
  const { theme, hideBranding, autoplay } = searchParams;
  
  return (
    <html>
      <head>
        {/* CSP header via middleware ou meta */}
      </head>
      <body className="m-0 p-0 overflow-hidden">
        <DemoPlayer 
          embedded={true}
          hideBranding={hideBranding === 'true'}
          theme={theme}
        />
        <EmbedResizeHandler />
      </body>
    </html>
  );
}
```

#### 2.2 PostMessage para auto-resize
```typescript
// src/components/productstory/EmbedResizeHandler.tsx
"use client";

import { useEffect, useRef } from "react";

export function EmbedResizeHandler() {
  const lastHeight = useRef(0);
  
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      if (height !== lastHeight.current) {
        lastHeight.current = height;
        window.parent.postMessage({
          type: 'productstory:resize',
          height,
        }, '*');
      }
    };
    
    // Observer para mudanças de tamanho
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    
    // Também enviar no load
    sendHeight();
    
    return () => observer.disconnect();
  }, []);
  
  return null;
}
```

#### 2.3 Atualizar embed.js
```javascript
// public/embed.js
(function() {
  const containers = document.querySelectorAll('[data-productstory]');
  
  containers.forEach(container => {
    const demoId = container.dataset.productstory;
    const iframe = document.createElement('iframe');
    
    iframe.src = `${BASE_URL}/productstory/embed/${demoId}`;
    iframe.style.width = '100%';
    iframe.style.height = container.dataset.height || '600px';
    iframe.style.border = 'none';
    iframe.allow = 'fullscreen';
    
    container.appendChild(iframe);
  });
  
  // Listener para resize
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'productstory:resize') {
      const iframes = document.querySelectorAll('iframe[src*="productstory/embed"]');
      iframes.forEach(iframe => {
        if (iframe.contentWindow === e.source) {
          iframe.style.height = `${e.data.height}px`;
        }
      });
    }
  });
})();
```

#### 2.4 CSP e segurança
```typescript
// src/middleware.ts
if (pathname.startsWith('/productstory/embed/')) {
  // Permitir embedding em qualquer domínio (v1)
  // ou implementar allowlist (v2)
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('Content-Security-Policy', "frame-ancestors *");
}
```

#### 2.5 Arquivos a criar/modificar
- [ ] `src/app/productstory/embed/[publicId]/page.tsx` - nova rota
- [ ] `src/components/productstory/EmbedResizeHandler.tsx` - novo
- [ ] `public/embed.js` - atualizar
- [ ] `src/middleware.ts` - CSP headers
- [ ] `src/components/productstory/editor/EmbedModal.tsx` - URLs corretas

---

### 3. Published Snapshots

**Problema atual:** Editar demo quebra versão publicada sem querer.

#### 3.1 Schema
```typescript
// Nova tabela
demoRevisions: pgTable("demo_revisions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => createId()),
  demoId: varchar("demo_id", { length: 36 }).references(() => demos.id),
  revisionNumber: integer("revision_number").notNull(),
  content: jsonb("content").notNull(), // snapshot completo
  publishedAt: timestamp("published_at").defaultNow(),
  publishedBy: varchar("published_by", { length: 36 }),
});

// Adicionar em demos
demos: {
  ...existing,
  currentRevisionId: varchar("current_revision_id", { length: 36 }),
}
```

#### 3.2 Fluxo de publicação
```typescript
// src/app/actions/demos.ts
export async function publishDemo(demoId: string) {
  // 1. Buscar demo completo com screens, hotspots, steps
  const demo = await getFullDemo(demoId);
  
  // 2. Gerar snapshot
  const snapshot = {
    screens: demo.screens,
    hotspots: demo.screens.flatMap(s => s.hotspots),
    steps: demo.steps,
    settings: { showBranding: demo.showBranding },
  };
  
  // 3. Criar revision
  const revision = await db.insert(demoRevisions).values({
    demoId,
    revisionNumber: (await getLastRevisionNumber(demoId)) + 1,
    content: snapshot,
    publishedBy: userId,
  }).returning();
  
  // 4. Atualizar demo
  await db.update(demos)
    .set({ 
      status: 'published',
      currentRevisionId: revision[0].id,
    })
    .where(eq(demos.id, demoId));
}
```

#### 3.3 Viewer usa revision
```typescript
// src/app/productstory/d/[publicId]/page.tsx
async function getPublicDemo(publicId: string) {
  const demo = await db.query.demos.findFirst({
    where: and(
      eq(demos.publicId, publicId),
      eq(demos.status, 'published'),
    ),
  });
  
  if (!demo?.currentRevisionId) return null;
  
  // Buscar conteúdo do snapshot
  const revision = await db.query.demoRevisions.findFirst({
    where: eq(demoRevisions.id, demo.currentRevisionId),
  });
  
  return revision?.content;
}
```

#### 3.4 Rollback
```typescript
export async function rollbackDemo(demoId: string, revisionId: string) {
  await db.update(demos)
    .set({ currentRevisionId: revisionId })
    .where(eq(demos.id, demoId));
}
```

#### 3.5 Arquivos a modificar
- [ ] `src/db/schema.ts` - adicionar `demoRevisions`
- [ ] `src/app/actions/demos.ts` - publishDemo com snapshot
- [ ] `src/app/productstory/d/[publicId]/page.tsx` - usar revision
- [ ] `src/app/dashboard/[ws]/demos/[id]/page.tsx` - UI de revisions

---

## 🟡 P1 - Alto (Qualidade)

### 4. Separar Hotspot de Step

**Problema:** Hotspot virou "objeto deus" com 25+ campos.

#### Proposta de separação
```
Hotspot (área clicável):
  - id, screenId, x, y, w, h
  - type: 'navigate' | 'external_link' | 'tooltip' | 'modal'
  - targetScreenId (se navigate)
  - externalUrl (se external_link)
  - label (identificador)

Step (narrativa):
  - id, demoId, order
  - screenId
  - hotspotId (opcional - pode não ter hotspot)
  - title, body
  - highlight: { enabled, color, padding }
  - tooltip: { position, backgroundColor, textColor }
  - autoAdvance: { enabled, delay }
```

**Impacto:** Refatoração grande. Fazer em fase posterior ou aceitar debt.

---

### 5. Analytics Confiável

#### 5.1 ViewerId resiliente
```typescript
// src/lib/analytics/viewerId.ts
export function getViewerId(): string {
  // Tentar localStorage
  let viewerId = localStorage.getItem('ps_viewer_id');
  if (viewerId) return viewerId;
  
  // Tentar cookie
  viewerId = getCookie('ps_viewer_id');
  if (viewerId) return viewerId;
  
  // Gerar novo
  viewerId = crypto.randomUUID();
  
  // Salvar em ambos
  try {
    localStorage.setItem('ps_viewer_id', viewerId);
  } catch {}
  
  try {
    document.cookie = `ps_viewer_id=${viewerId};max-age=31536000;path=/;SameSite=Lax`;
  } catch {}
  
  return viewerId;
}
```

#### 5.2 Batch & retry
```typescript
// src/lib/analytics/eventQueue.ts
class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private flushInterval = 5000;
  
  add(event: AnalyticsEvent) {
    this.queue.push(event);
    if (this.queue.length >= 10) {
      this.flush();
    }
  }
  
  async flush() {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    try {
      await fetch('/api/analytics/demo-events', {
        method: 'POST',
        body: JSON.stringify({ events }),
        keepalive: true,
      });
    } catch {
      // Re-queue failed events
      this.queue = [...events, ...this.queue];
    }
  }
}
```

---

### 6. Rate Limit & Abuse Prevention

```typescript
// src/app/api/analytics/demo-events/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 req/min
  analytics: true,
});

export async function POST(request: Request) {
  // Rate limit por IP
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json({ error: "Rate limited" }, { status: 429 });
  }
  
  // Validar payload
  const body = await request.json();
  
  if (!Array.isArray(body.events) || body.events.length > 50) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  
  // Validar timestamps (não aceitar > 1h no futuro ou passado)
  const now = Date.now();
  const validEvents = body.events.filter(e => {
    const ts = new Date(e.ts).getTime();
    return Math.abs(now - ts) < 3600000;
  });
  
  // Processar...
}
```

---

## 🟡 P2 - Médio (Polimento)

### 7. Performance de Imagens

```typescript
// src/app/api/upload/route.ts
import sharp from 'sharp';

// Gerar versões otimizadas
const optimized = await sharp(buffer)
  .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 85 })
  .toBuffer();

const thumbnail = await sharp(buffer)
  .resize(400, 225, { fit: 'cover' })
  .webp({ quality: 70 })
  .toBuffer();

// Salvar ambas versões
const [fullUrl, thumbUrl] = await Promise.all([
  uploadToBlob(optimized, `${id}.webp`),
  uploadToBlob(thumbnail, `${id}-thumb.webp`),
]);
```

### 8. Mobile/Responsive

```typescript
// src/components/productstory/DemoPlayer.tsx

// Detectar mobile
const isMobile = window.innerWidth < 768;

// Ajustar tooltip
const tooltipStyle = isMobile ? {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  borderRadius: '16px 16px 0 0',
} : getTooltipPosition(hotspot);

// Touch events
<div
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
```

### 9. UI Simplificada (Presets)

```typescript
// Esconder complexidade atrás de presets
const HOTSPOT_PRESETS = {
  simple: {
    backdropEnabled: false,
    spotlightEnabled: false,
    primaryCtaEnabled: false,
  },
  spotlight: {
    backdropEnabled: true,
    backdropOpacity: 0.7,
    spotlightEnabled: true,
    spotlightPadding: 8,
  },
  cta: {
    primaryCtaEnabled: true,
    primaryCtaText: 'Continue',
  },
};

// UI mostra presets primeiro, "Advanced" escondido
<Select onValueChange={applyPreset}>
  <SelectItem value="simple">Simple Highlight</SelectItem>
  <SelectItem value="spotlight">Spotlight Effect</SelectItem>
  <SelectItem value="cta">With CTA Button</SelectItem>
</Select>

<Collapsible>
  <CollapsibleTrigger>Advanced Settings</CollapsibleTrigger>
  <CollapsibleContent>
    {/* 25+ campos aqui */}
  </CollapsibleContent>
</Collapsible>
```

---

## 📅 Cronograma Sugerido

### Semana 1: P0 Core
- [ ] Dia 1-2: Multi-hotspot (remover limite, lista lateral)
- [ ] Dia 3-4: Embed route + resize handler
- [ ] Dia 5: CSP + embed.js atualizado

### Semana 2: P0 + P1
- [ ] Dia 1-2: Published snapshots (schema + fluxo)
- [ ] Dia 3: Analytics resiliente
- [ ] Dia 4: Rate limiting
- [ ] Dia 5: Testes manuais

### Semana 3: P2 (se tempo)
- [ ] Performance de imagens
- [ ] Mobile responsivo
- [ ] UI presets

---

## ✅ Checklist de Validação

### Multi-Hotspot
```
[ ] Posso criar 5 hotspots na mesma tela
[ ] Posso reordenar hotspots
[ ] No viewer, todos aparecem simultaneamente
[ ] Em guided mode, apenas o do step atual está "ativo"
```

### Embed
```
[ ] Embed funciona em Webflow
[ ] Embed funciona em Notion (embed block)
[ ] Embed funciona em docs HTML simples
[ ] Auto-resize funciona
[ ] Fallback de altura funciona se postMessage falhar
```

### Snapshots
```
[ ] Editar demo não quebra versão publicada
[ ] Posso ver histórico de revisions
[ ] Posso fazer rollback
[ ] Analytics separado por revision
```

---

## 🚫 O Que NÃO Fazer Agora

1. **Themes elaborados** - Presets são suficientes
2. **Chapters** - Complicação desnecessária para MVP
3. **Auto-advance** - Nice to have, não crítico
4. **Rich text avançado** - Markdown simples basta
5. **Ramificações** - Fase 4, se validar demanda
6. **AI features** - Zero utilidade se base estiver frágil

---

## 📈 Métricas de Sucesso

| Métrica | Alvo |
|---------|------|
| Embeds funcionando em 1º try | > 95% |
| Demos com 3+ hotspots/tela | > 50% |
| Publicações sem edição acidental | 100% |
| Uptime de analytics | > 99% |

---

**Resumo:** Implementar P0 (3 itens críticos) é a diferença entre "projeto pessoal" e "produto vendável". Todo o resto é polish.
