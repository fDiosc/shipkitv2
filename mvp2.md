A seguir está um blueprint MVP-first (rápido de construir, barato de operar) para você ter um “Storylane simples” dentro do Shipkit, cobrindo exatamente os 4 pontos: criar, publicar, embed/URL e analytics.

Objetivo do MVP

Entregar demos clicáveis (hotspots sobre telas), com modo guiado opcional, URL única e embed, e analytics essenciais (views, completions, drop-off), sem complexidade enterprise.

1) Criar as demos
Funcionalidades básicas (MVP)
A. Input de “telas”

Upload de imagens (PNG/JPG/WebP) em lote

Ordenar/reordenar telas (drag & drop)

(Opcional v1.1) Import Figma via export ou plugin; para MVP, upload resolve

B. Editor de demo (core)

Canvas com a tela atual

Criar hotspots (retângulos) clicáveis

Hotspot → “vai para tela X”

Hotspot → ação opcional “mostra tooltip”

Lista de hotspots por tela (para editar/remover)

Pré-visualização “Play”

C. Modo guiado (MVP minimal)

Criar steps (uma sequência linear)

Step: (tela, hotspot alvo opcional, texto, posição do tooltip)

Navegação: Next / Back

“Autoplay” não precisa

D. Assistência por IA (opcional, mas alinhada ao seu plano)

IA analisa as telas e sugere:

ordem provável (login → dashboard → feature)

hotspots prováveis (CTAs)

texto curto por step

Importante: IA gera rascunho; o usuário ajusta.

Implementação (como fazer rápido)

Hotspot = bounding box em coordenadas relativas (%):

x, y, w, h em 0..1

Render no front com divs absolutas sobre a imagem.

2) Publicar as demos
Funcionalidades básicas (MVP)

Status: Draft / Published

Slug/ID da demo (URL pública)

Configurações de publicação:

Título, descrição

Capa/thumbnail (primeira tela)

Branding (watermark on/off dependendo do plano)

(Opcional) Proteção por senha (v1.1)

(Opcional) Allowlist de domínio para embeds (v1.1)

Fluxo simples

Usuário cria → Preview → “Publish”

Ao publicar:

gera publicId (UUID curto / nanoid)

salva snapshot de config publicada

3) Renderizar (URL única e embed em terceiros via script)

Você precisa de dois modos: URL pública e embed.

A. URL pública

Formato:

https://shipkit.app/productstory/d/{publicId}
ou

https://demo.shipkit.app/d/{publicId} (mais limpo, mas opcional)

A página pública:

carrega JSON da demo (telas, hotspots, steps)

renderiza player

envia eventos de analytics

B. Embed via script (recomendado para MVP)

O embed mais simples e robusto é iframe, mas controlado por um script loader.

Opção 1 (mais fácil): iframe direto

O usuário cola:

<iframe
  src="https://shipkit.app/productstory/embed/{publicId}"
  width="100%"
  height="640"
  frameborder="0"
  allowfullscreen
></iframe>


Vantagens: rápido, seguro, sem CORS complexo.

Opção 2 (melhor UX): script que injeta iframe + resize

O usuário cola:

<div data-productstory="PUBLIC_ID"></div>
<script async src="https://shipkit.app/productstory/embed.js"></script>


O embed.js:

encontra div[data-productstory]

cria iframe apontando para /embed/{publicId}

faz auto-resize via postMessage

Recomendação: comece com iframe direto (MVP), e em seguida adicione embed.js para facilitar.

C. Requisitos técnicos do embed

Endpoint /embed/{publicId} serve uma UI sem header/footer, só o player

Suporte a postMessage:

iframe → parent: { type: "productstory:height", value: 812 }

parent ajusta height

Segurança mínima

Para MVP, embed “público” é suficiente.

V1.1: “domínios permitidos”:

no embed, valide document.referrer (não é perfeito) e/ou configure allowlist por demo

mais robusto: tokens assinados por domínio (já é v2)

4) Capturar insights (views, etc.)
Eventos mínimos (MVP)

Você precisa de um schema de eventos simples.

Eventos recomendados

demo_view (carregou)

screen_view (tela X vista)

hotspot_click (clicou hotspot)

step_next / step_back (modo guiado)

demo_complete (chegou ao último step ou atingiu condição)

exit (fechou / ficou inativo) — opcional

Métricas derivadas (o que mostrar no dashboard)

Views (por dia)

Unique viewers (cookie/session)

Avg time on demo

Completion rate

Drop-off por step (funil)

Top clicked hotspots

Coleta: simples e eficiente

No client, gere:

viewerId (cookie/localStorage)

sessionId (por visita)

Envie eventos para um endpoint:

POST /api/analytics/events

Para performance:

batch a cada 5–10 eventos ou a cada 5–10 segundos

use navigator.sendBeacon no unload

Onde armazenar (MVP)

Banco principal (Postgres) com tabela de eventos já funciona, mas cresce rápido.

Sugestão pragmática:

MVP: Postgres com particionamento ou tabela simples + retenção de 90 dias

V2: ClickHouse/BigQuery/Timescale se crescer muito

Arquitetura necessária (MVP rápido)
Componentes

Web app (Shipkit)

Editor (authenticated)

Dashboard analytics (authenticated)

Public player

Rotas públicas /d/{publicId} e /embed/{publicId}

API

CRUD demos, telas, hotspots, steps

Public fetch demo by publicId

Ingest de analytics

Storage de imagens

S3/R2 (ideal) ou storage do seu provedor

CDN se possível

DB

Postgres (demos + config + analytics events)

Queue (opcional)

Para processar thumbnails, otimização de imagens, agregações de analytics

Sugestão de stack (rápida, padrão SaaS)

Next.js (App Router) + API routes

Postgres (Prisma)

S3/R2 para imagens

Redis opcional (rate-limit e caching)

Worker opcional (BullMQ / Cloudflare Queues / etc.)

Modelo de dados (mínimo)
demos

id (uuid)

orgId/userId

name, description

status (draft/published)

publicId (nanoid)

createdAt, updatedAt

demo_screens

id

demoId

order

imageUrl, width, height

demo_hotspots

id

screenId

type (navigate / tooltip)

targetScreenId (nullable)

x, y, w, h (float 0..1)

label / tooltipText (nullable)

demo_steps (guided mode)

id

demoId

order

screenId

hotspotId (nullable)

title, body

placement (top/right/bottom/left)

analytics_events

id

demoId, publicId

viewerId, sessionId

eventType

screenId, stepIndex, hotspotId (nullable)

ts

referrer, utm_*, userAgent (opcional)

(Opcional, para performance) analytics_daily

demoId, date

views, uniques, completions, etc.

Roadmap MVP em 2 camadas (pra você não overbuild)
MVP (o essencial para você usar e substituir Storylane)

Upload de telas

Hotspots navigate

Public URL /d/{publicId}

Embed iframe /embed/{publicId}

Eventos: view, screen_view, hotspot_click

Dashboard: views, uniques, top hotspots

MVP+ (o que dá “cara” e eleva valor)

Guided steps + completion rate + drop-off

Script embed com auto-resize

Password protection e allowlist de domínio

IA: sugestão de fluxo + textos

Decisões críticas (pra não se enrolar)

Iframe-first para embed. Script vem depois.

Coordenadas relativas para hotspots. Evita bugs responsivos.

Analytics por eventos brutos + agregação simples. Não invente BI agora.

PublicId separado do id interno (evita enumeração e facilita sharing).


basedo em storylane