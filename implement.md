# ProductStory - Implementação Completa

> Documento gerado em: 11/01/2026  
> Resumo de todas as funcionalidades implementadas

---

## 📋 Visão Geral

ProductStory é um módulo de demos interativos integrado ao ShipKit, permitindo criar tours guiados de produtos similar ao Storylane.

---

## 🗄️ Schema do Banco de Dados

### Tabelas Criadas/Modificadas

#### `demos`
Tabela principal para armazenar demos.
- `id`, `workspaceId`, `name`, `description`, `status`
- `publicId` - ID único para URLs públicas
- `thumbnailUrl`, `showBranding`
- Timestamps

#### `demoScreens`
Telas/screenshots de cada demo.
- `id`, `demoId`, `imageUrl`, `order`
- `width`, `height`, `title`

#### `demoHotspots` (25+ campos)
Hotspots interativos com configuração completa:

| Categoria | Campos |
|-----------|--------|
| **Básico** | `id`, `screenId`, `type`, `targetScreenId`, `x`, `y`, `w`, `h`, `label`, `tooltipText` |
| **Style** | `backgroundColor`, `textColor`, `hotspotColor`, `fontFamily`, `fontSize`, `borderRadius`, `htmlContent` |
| **Highlight** | `backdropEnabled`, `backdropOpacity`, `backdropColor`, `spotlightEnabled`, `spotlightColor`, `spotlightPadding` |
| **CTAs** | `primaryCtaEnabled`, `primaryCtaText`, `primaryCtaAction`, `primaryCtaUrl`, `secondaryCtaEnabled`, `secondaryCtaText`, `secondaryCtaUrl` |
| **Position** | `arrowPosition` (9 posições), `offsetX`, `offsetY` |
| **Config** | `showStepNumber`, `showPreviousButton`, `hideOnMouseOut`, `autoAdvanceEnabled`, `autoAdvanceDelay` |

#### `demoSteps`
Passos guiados do demo.
- `id`, `demoId`, `screenId`, `hotspotId`, `order`
- `title`, `body`, `placement`

#### `demoChapters`
Agrupamento de steps em capítulos.
- `id`, `demoId`, `name`, `order`

#### `demoThemes`
Temas reutilizáveis para styling.
- `id`, `demoId`, `name`, `isDefault`
- `backgroundColor`, `textColor`, `hotspotColor`, `fontFamily`, `borderRadius`

#### `demoLeadForms`
Formulários de captura de leads.
- `id`, `demoId`, `enabled`, `trigger`
- `title`, `description`, `fields` (JSON), `submitButtonText`

#### `demoAnalyticsEvents`
Eventos de analytics.
- `id`, `demoId`, `type`, `viewerId`, `sessionId`
- `screenId`, `hotspotId`, `stepIndex`, `ts`, `metadata`

---

## 🎨 Componentes de UI

### Editor (`/src/components/productstory/editor/`)

#### `DemoEditor.tsx`
Componente principal do editor com:
- Upload de screenshots (drag & drop)
- Lista de telas com thumbnails
- Canvas interativo
- Modo hotspots/steps/preview
- Integração com GuideEditPanel

#### `ScreenCanvas.tsx`
Canvas de edição de hotspots estilo Storylane:
- ✅ **Click-to-add**: Clique para adicionar hotspot
- ✅ **1 por tela**: Limite de 1 hotspot por screen
- ✅ **Beacon pulsante**: Círculo azul (#4F46E5) com animação
- ✅ **Drag to move**: Arraste o beacon para reposicionar
- ✅ **Resize handles**: 4 alças nos cantos para redimensionar
- ✅ **Inline editing**: Edição de texto direto no tooltip
- ✅ **Position grid**: 9 posições suportadas

#### `GuideEditPanel/`
Painel de configuração com 5 abas:

| Aba | Funcionalidades |
|-----|-----------------|
| **Style** | Cores (bg/text/hotspot), fonte, border radius |
| **Highlight** | Backdrop toggle, spotlight toggle |
| **CTAs** | Botão primário, secundário, ações |
| **Position** | Grid 9 posições, offset X/Y, dimensões W/H |
| **Config** | Step number, previous button, auto-advance |

Inclui **seletor de tipo** no topo:
- 🎬 **Intro** - Modal de abertura
- 👆 **Action** - Hotspot de ação
- 🎉 **Closing** - Modal de finalização

#### `RichTextToolbar.tsx`
Editor rich text com TipTap:
- Bold, italic, link
- Listas, alinhamento
- Color picker, variáveis

#### `StepsPanel.tsx`
Painel de steps com:
- Timeline vertical
- Drag-and-drop (dnd-kit)
- Thumbnails, badges

#### `EmbedModal.tsx`
Modal para gerar códigos de embed:
- iFrame, JavaScript, Link direto
- Configurações de dimensão e autoplay

#### `ThemeSelector.tsx`
Seletor de temas:
- Grid de temas pré-definidos
- Criar novo tema
- Aplicar a todos os hotspots

### Viewer (`/src/components/productstory/viewer/`)

#### `DemoPlayer.tsx`
Player público para demos:
- ✅ Beacon pulsante estilo Storylane
- ✅ Tooltip com step indicator
- ✅ Navegação por teclado (setas, espaço)
- ✅ Progress bar clicável
- ✅ Setas laterais de navegação
- ✅ Branding "Powered by ProductStory"

#### `DemoViewer.tsx`
Viewer com features avançadas:
- Backdrop com spotlight
- Keyboard navigation
- Step indicators
- Fullscreen mode
- Auto-advance

#### `Backdrop.tsx`
SVG backdrop com mask para spotlight:
- Opacidade configurável
- Cor configurável
- Animação de borda

#### `ChaptersMenu.tsx`
Menu de capítulos:
- Dropdown navigation
- Completion tracking
- Step counts

#### `TextModal.tsx` / `MediaModal.tsx`
Modals para intro/outro:
- Rich content
- CTAs customizáveis

#### `LeadFormModal.tsx`
Modal de captura de leads:
- Campos configuráveis
- Validação
- Styling

### Analytics (`/src/components/productstory/analytics/`)

#### `AnalyticsDashboard.tsx`
Dashboard de métricas:
- Cards: Views, Completion Rate, Time Spent, Leads
- Funnel de drop-off por step
- Gráfico de views over time
- Seletor de período (24h/7d/30d/90d)

---

## 🛣️ Rotas e Páginas

### Dashboard (`/dashboard/[workspaceSlug]/`)

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard principal do workspace |
| `/demos` | Lista de demos |
| `/demos/new` | Criar novo demo |
| `/demos/[demoId]` | Editor de demo |
| `/landings` | Lista de landing pages |
| `/leads` | Leads capturados |
| `/analytics` | Analytics do workspace |
| `/settings` | Configurações do workspace |

### Público

| Rota | Descrição |
|------|-----------|
| `/productstory/d/[publicId]` | Demo público (viewer) |

---

## ⚙️ Server Actions (`/src/app/actions/`)

### `demos.ts`
```typescript
createDemo(workspaceId, data)
updateDemo(demoId, data)
deleteDemo(demoId)
getDemo(demoId)
getDemosByWorkspace(workspaceId)
publishDemo(demoId)
unpublishDemo(demoId)

createScreen(demoId, imageUrl, order)
reorderScreens(demoId, screenIds)
deleteScreen(screenId)

createHotspot(screenId, data)
updateHotspot(hotspotId, data)  // 25+ campos suportados
deleteHotspot(hotspotId)

createStep(demoId, data)
updateStep(stepId, data)
deleteStep(stepId)
reorderSteps(demoId, stepIds)
```

### `demo-settings.ts`
```typescript
createChapter(demoId, data)
updateChapter(chapterId, data)
deleteChapter(chapterId)

createTheme(demoId, data)
deleteTheme(themeId)
applyThemeToAllHotspots(demoId, themeId)

updateLeadForm(demoId, data)
getLeadForm(demoId)
```

### `workspaces.ts`
```typescript
createWorkspace(data)
createPersonalWorkspace(userId)
getWorkspaces()
getWorkspaceBySlug(slug)
ensureProfileExists(userId)  // Fix para race condition
```

---

## 🔌 API Routes

### `/api/demos/[id]/analytics`
GET - Retorna analytics de um demo:
- Período: 24h, 7d, 30d, 90d
- Métricas: views, completion, avg time, leads
- Step drop-off funnel
- Views over time

### `/api/analytics/demo-events`
POST - Recebe eventos de analytics:
- `demo_view`, `screen_view`, `hotspot_click`
- `step_next`, `step_back`, `demo_complete`
- Suporta `sendBeacon` para reliability

### `/api/upload`
POST - Upload de screenshots:
- Produção: Vercel Blob
- Dev: Base64 data URLs

---

## 📦 Dependências Adicionadas

```json
{
  "@tiptap/react": "rich text editor",
  "@tiptap/starter-kit": "extensões básicas",
  "@tiptap/extension-link": "links",
  "@tiptap/extension-text-align": "alinhamento",
  "@tiptap/extension-color": "cores",
  "@tiptap/extension-text-style": "estilos",
  "@dnd-kit/core": "drag and drop",
  "@dnd-kit/sortable": "sorting",
  "@dnd-kit/utilities": "utilitários"
}
```

---

## 🎯 UX Storylane-Style

### Hotspot Visual
- Círculo azul pulsante (#4F46E5 - brand color)
- Ícone de cursor no centro
- Ring de seleção quando ativo
- Animação ping contínua

### Tooltip Balloon
- Fundo azul (#4F46E5)
- Step indicator "Step X of Y"
- Título (opcional) + descrição
- Seta apontando para o beacon
- 9 posições de placement

### Interação
- Click no beacon = avança para próxima tela
- Drag beacon = reposiciona
- Click no tooltip = edita texto (modo editor)
- Teclado → ← = navegação
- Progress bar = navegação direta

---

## 📁 Estrutura de Arquivos Chave

```
src/
├── app/
│   ├── actions/
│   │   ├── demos.ts
│   │   ├── demo-settings.ts
│   │   └── workspaces.ts
│   ├── api/
│   │   ├── demos/[id]/analytics/route.ts
│   │   ├── analytics/demo-events/route.ts
│   │   └── upload/route.ts
│   ├── dashboard/[workspaceSlug]/
│   │   ├── demos/
│   │   │   ├── [demoId]/page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   ├── landings/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   └── productstory/d/[publicId]/
│       ├── page.tsx
│       └── DemoPlayerWrapper.tsx
├── components/productstory/
│   ├── DemoEditor.tsx
│   ├── DemoPlayer.tsx
│   ├── ScreenCanvas.tsx
│   ├── ScreenList.tsx
│   ├── editor/
│   │   ├── GuideEditPanel/
│   │   │   ├── index.tsx
│   │   │   ├── StyleSection.tsx
│   │   │   ├── HighlightSection.tsx
│   │   │   ├── CTAsSection.tsx
│   │   │   ├── PositionSection.tsx
│   │   │   └── ConfigSection.tsx
│   │   ├── RichTextToolbar.tsx
│   │   ├── StepsPanel.tsx
│   │   ├── EmbedModal.tsx
│   │   └── ThemeSelector.tsx
│   ├── viewer/
│   │   ├── DemoViewer.tsx
│   │   ├── Backdrop.tsx
│   │   ├── ChaptersMenu.tsx
│   │   ├── TextModal.tsx
│   │   └── LeadFormModal.tsx
│   └── analytics/
│       └── AnalyticsDashboard.tsx
├── db/
│   └── schema.ts (expandido com 6 novas tabelas)
└── public/
    └── embed.js
```

---

## ✅ Status Final

| Feature | Status |
|---------|--------|
| Schema completo | ✅ |
| CRUD de demos | ✅ |
| Upload de screenshots | ✅ |
| Editor visual | ✅ |
| Hotspots Storylane-style | ✅ |
| 3 tipos de hotspot | ✅ |
| 9 posições de tooltip | ✅ |
| GuideEditPanel (5 abas) | ✅ |
| DemoPlayer público | ✅ |
| Navegação por teclado | ✅ |
| Progress bar | ✅ |
| Analytics tracking | ✅ |
| Embed codes | ✅ |
| Themes | ✅ |
| Lead forms | ✅ |
| Dashboard workspace-aware | ✅ |
| TypeScript sem erros | ✅ |

---

**Desenvolvido com ❤️ para ShipKit**
