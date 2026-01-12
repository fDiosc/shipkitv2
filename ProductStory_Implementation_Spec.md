# ProductStory - Especificação Técnica Completa para Implementação

## Contexto do Projeto

ProductStory é um módulo do ShipKit para criação de demos interativas de produto. O objetivo é criar uma alternativa mais simples e barata ao Storylane ($50/mês) focada em founders e indie hackers.

**Stack atual do ShipKit:** Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL

**URL base:** shipkit.app/productstory

---

# FASE 1: PARIDADE BÁSICA (Semanas 1-2)

## 1.1 Guide Edit Panel Completo

### Descrição
Painel lateral direito que aparece quando um hotspot/guide está selecionado. Substitui o "Hotspot Settings" atual.

### Estrutura de Componentes

```
components/
  demos/
    editor/
      GuideEditPanel/
        index.tsx           # Container principal
        StyleSection.tsx    # Cores e fontes
        HighlightSection.tsx # Backdrop e spotlight
        CTAsSection.tsx     # Botões de navegação
        PositionSection.tsx # Grid de posição
        ConfigSection.tsx   # Opções gerais
        ThemeSection.tsx    # Aplicar temas
```

### 1.1.1 StyleSection.tsx

```typescript
interface StyleSectionProps {
  guide: Guide;
  onUpdate: (updates: Partial<Guide>) => void;
}

interface GuideStyle {
  backgroundColor: string;      // HEX, default: "#7C3AED"
  textColor: string;            // HEX, default: "#FFFFFF"
  hotspotColor: string;         // HEX, default: "#7C3AED"
  fontFamily: string;           // default: "Inter"
  fontSize: 'sm' | 'md' | 'lg'; // default: 'md'
  borderRadius: number;         // px, default: 8
}
```

**UI Elements:**
- Color picker para `backgroundColor` com label "Background Color"
- Color picker para `hotspotColor` com label "Hotspot Color"  
- Dropdown para `fontFamily` com opções: Inter, Poppins, Roboto, System
- Checkbox "Apply Style to all steps" que propaga estilo para todos os guides

**Comportamento:**
- Mudanças aplicam em tempo real no canvas
- Cores devem ter preview visual (quadrado colorido ao lado do picker)

### 1.1.2 HighlightSection.tsx

```typescript
interface HighlightSettings {
  backdrop: {
    enabled: boolean;           // default: true
    opacity: number;            // 0-1, default: 0.6
    color: string;              // HEX, default: "#000000"
  };
  spotlight: {
    enabled: boolean;           // default: false
    color: string;              // HEX, default: "#7C3AED"
    padding: number;            // px ao redor do elemento, default: 8
    borderRadius: number;       // px, default: 4
  };
}
```

**UI Elements:**
- Toggle "Backdrop" com ícone de olho
- Slider de opacidade (aparece quando backdrop enabled)
- Toggle "Spotlight" com color picker inline
- Input numérico para padding do spotlight

### 1.1.3 CTAsSection.tsx

```typescript
interface CTASettings {
  primaryCTA: {
    enabled: boolean;           // default: true
    text: string;               // default: "Next"
    action: 'next' | 'url' | 'chapter';
    url?: string;               // se action === 'url'
    chapterId?: string;         // se action === 'chapter'
  };
  secondaryCTA: {
    enabled: boolean;           // default: false
    text: string;               // default: "Learn more"
    url: string;
  };
}
```

**UI Elements:**
- Toggle "Next Button" 
- Input de texto para label do botão (aparece quando enabled)
- Toggle "Secondary Button"
- Input de texto + URL para secondary (aparece quando enabled)

### 1.1.4 PositionSection.tsx

```typescript
interface PositionSettings {
  // Posição da seta/pointer do tooltip relativo ao elemento alvo
  arrowPosition: 
    | 'top-left' | 'top-center' | 'top-right'
    | 'middle-left' | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  // Offset fino em porcentagem
  offsetX: number;              // -100 a 100, default: 0
  offsetY: number;              // -100 a 100, default: 0
  
  // Dimensões do hotspot area (para elementos não retangulares)
  width: number;                // %, default: 13.5
  height: number;               // %, default: 15.7
}
```

**UI Elements:**
- Grid 3x3 clicável para `arrowPosition` (9 pontos)
- Inputs numéricos "X:" e "Y:" para offset
- Inputs numéricos "W:" e "H:" para dimensões

**Visual do Grid:**
```
┌───┬───┬───┐
│ ● │ ● │ ● │  ← top-left, top-center, top-right
├───┼───┼───┤
│ ● │   │ ● │  ← middle-left, (center não existe), middle-right
├───┼───┼───┤
│ ● │ ● │ ● │  ← bottom-left, bottom-center, bottom-right
└───┴───┴───┘
```

### 1.1.5 ConfigSection.tsx

```typescript
interface ConfigSettings {
  showStepNumber: boolean;      // default: true, mostra "1/10"
  showPreviousButton: boolean;  // default: false
  hideOnMouseOut: boolean;      // default: false
  autoAdvance: {
    enabled: boolean;           // default: false
    delay: number;              // segundos, default: 5
  };
}
```

**UI Elements:**
- Toggle "Show Step Number" com preview "1/10"
- Toggle "Previous Button" com ícone de seta
- Toggle "Hide text on mouse out"
- Toggle "Auto-advance" com input de delay em segundos

---

## 1.2 Backdrop com Cutout

### Descrição
Overlay escuro que cobre toda a tela EXCETO a área do elemento alvo, criando efeito de spotlight.

### Implementação CSS

```typescript
// components/demos/viewer/Backdrop.tsx

interface BackdropProps {
  targetRect: DOMRect | null;   // Coordenadas do elemento alvo
  opacity: number;
  color: string;
  padding: number;              // Espaço ao redor do elemento
  borderRadius: number;
}

const Backdrop: React.FC<BackdropProps> = ({
  targetRect,
  opacity = 0.6,
  color = '#000000',
  padding = 8,
  borderRadius = 4
}) => {
  if (!targetRect) return null;

  // Usar clip-path para criar o "buraco"
  const clipPath = `polygon(
    0% 0%,
    0% 100%,
    ${targetRect.left - padding}px 100%,
    ${targetRect.left - padding}px ${targetRect.top - padding}px,
    ${targetRect.right + padding}px ${targetRect.top - padding}px,
    ${targetRect.right + padding}px ${targetRect.bottom + padding}px,
    ${targetRect.left - padding}px ${targetRect.bottom + padding}px,
    ${targetRect.left - padding}px 100%,
    100% 100%,
    100% 0%
  )`;

  return (
    <div
      className="fixed inset-0 z-40 transition-opacity duration-300"
      style={{
        backgroundColor: color,
        opacity,
        clipPath,
      }}
    />
  );
};
```

### Alternativa com SVG Mask (melhor para border-radius)

```typescript
const BackdropSVG: React.FC<BackdropProps> = ({
  targetRect,
  opacity,
  color,
  padding,
  borderRadius
}) => {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <svg
      className="fixed inset-0 z-40 pointer-events-none"
      width={viewportWidth}
      height={viewportHeight}
    >
      <defs>
        <mask id="backdrop-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={targetRect.left - padding}
            y={targetRect.top - padding}
            width={targetRect.width + padding * 2}
            height={targetRect.height + padding * 2}
            rx={borderRadius}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={color}
        fillOpacity={opacity}
        mask="url(#backdrop-mask)"
      />
    </svg>
  );
};
```

---

## 1.3 Rich Text Editor Inline

### Descrição
Toolbar flutuante que aparece quando o usuário edita o texto do tooltip.

### Dependência Recomendada
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-color @tiptap/extension-text-style
```

### Implementação

```typescript
// components/demos/editor/RichTextToolbar.tsx

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

interface RichTextToolbarProps {
  content: string;
  onChange: (html: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  content,
  onChange,
  onSave,
  onCancel
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['paragraph'] }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <>
      <BubbleMenu editor={editor} className="flex bg-white rounded-lg shadow-lg border p-1 gap-1">
        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
          }}
          className="px-2 py-1 rounded border text-sm"
        >
          <option value="14px">Small</option>
          <option value="16px">Medium</option>
          <option value="20px">Large</option>
        </select>

        <div className="w-px bg-gray-200" />

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <BoldIcon className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <ItalicIcon className="w-4 h-4" />
        </button>

        {/* Link */}
        <button
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <ListIcon className="w-4 h-4" />
        </button>

        {/* Text Align */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100`}
        >
          <AlignLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100`}
        >
          <AlignCenterIcon className="w-4 h-4" />
        </button>

        {/* Color Picker */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 rounded cursor-pointer"
        />

        {/* Variables Dropdown */}
        <select
          onChange={(e) => {
            editor.chain().focus().insertContent(e.target.value).run();
            e.target.value = '';
          }}
          className="px-2 py-1 rounded border text-sm"
        >
          <option value="">{ } Variables</option>
          <option value="{{first_name}}">First Name</option>
          <option value="{{company}}">Company</option>
          <option value="{{email}}">Email</option>
        </select>

        <div className="w-px bg-gray-200" />

        {/* Cancel */}
        <button onClick={onCancel} className="p-2 rounded hover:bg-red-100 text-red-600">
          <XIcon className="w-4 h-4" />
        </button>

        {/* Save */}
        <button onClick={onSave} className="p-2 rounded hover:bg-green-100 text-green-600">
          <CheckIcon className="w-4 h-4" />
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </>
  );
};
```

---

## 1.4 Steps Panel com Thumbnails

### Descrição
Painel lateral direito mostrando timeline vertical de todos os steps com miniaturas.

### Estrutura

```typescript
// components/demos/editor/StepsPanel.tsx

interface Step {
  id: string;
  screenId: string;
  guideId: string | null;
  order: number;
  thumbnail: string;            // URL da miniatura
}

interface StepsPanelProps {
  steps: Step[];
  currentStepId: string;
  onSelectStep: (stepId: string) => void;
  onReorderSteps: (startIndex: number, endIndex: number) => void;
  onAddStep: (afterStepId: string) => void;
  onDeleteStep: (stepId: string) => void;
}
```

### Implementação com Drag & Drop

```typescript
// Usar @dnd-kit/core para drag and drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableStep: React.FC<{ step: Step; isActive: boolean }> = ({ step, isActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group p-2 rounded-lg cursor-pointer transition-all
        ${isActive ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'}
      `}
    >
      {/* Step Number Badge */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-medium">
        {step.order}
      </div>

      {/* Thumbnail */}
      <div className="relative w-16 h-10 rounded border overflow-hidden ml-4">
        <img src={step.thumbnail} alt="" className="w-full h-full object-cover" />
        {step.guideId && (
          <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-purple-500" />
        )}
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab"
      >
        <GripVerticalIcon className="w-4 h-4 text-gray-400" />
      </div>

      {/* Add Step Button (between steps) */}
      <button
        onClick={() => onAddStep(step.id)}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs z-10"
      >
        +
      </button>
    </div>
  );
};

const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  currentStepId,
  onSelectStep,
  onReorderSteps,
  onAddStep,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      onReorderSteps(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-20 bg-white border-l flex flex-col">
      {/* Header */}
      <div className="p-2 border-b text-xs font-medium text-gray-500 uppercase">
        Steps
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {steps.map((step) => (
              <div key={step.id} onClick={() => onSelectStep(step.id)}>
                <SortableStep step={step} isActive={step.id === currentStepId} />
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Step Button */}
      <div className="p-2 border-t">
        <button
          onClick={() => onAddStep(steps[steps.length - 1]?.id)}
          className="w-full py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded"
        >
          + ADD STEP
        </button>
      </div>
    </div>
  );
};
```

---

## 1.5 Preview Mode Melhorado

### Descrição
Modo de visualização que simula exatamente como o viewer final vai ver a demo.

### Implementação

```typescript
// components/demos/viewer/DemoViewer.tsx

interface DemoViewerProps {
  demo: Demo;
  steps: Step[];
  screens: Screen[];
  guides: Guide[];
  mode: 'preview' | 'published';
}

interface ViewerState {
  currentStepIndex: number;
  visitedSteps: Set<string>;
  isPlaying: boolean;
}

const DemoViewer: React.FC<DemoViewerProps> = ({
  demo,
  steps,
  screens,
  guides,
  mode
}) => {
  const [state, setState] = useState<ViewerState>({
    currentStepIndex: 0,
    visitedSteps: new Set(),
    isPlaying: false,
  });

  const currentStep = steps[state.currentStepIndex];
  const currentScreen = screens.find(s => s.id === currentStep?.screenId);
  const currentGuide = guides.find(g => g.id === currentStep?.guideId);

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setState(prev => ({
        ...prev,
        currentStepIndex: index,
        visitedSteps: new Set([...prev.visitedSteps, steps[index].id]),
      }));
    }
  };

  const nextStep = () => goToStep(state.currentStepIndex + 1);
  const prevStep = () => goToStep(state.currentStepIndex - 1);

  // Auto-advance
  useEffect(() => {
    if (currentGuide?.config.autoAdvance?.enabled) {
      const timer = setTimeout(() => {
        nextStep();
      }, currentGuide.config.autoAdvance.delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [state.currentStepIndex, currentGuide]);

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Screen Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative max-w-full max-h-full">
          {/* Screenshot */}
          {currentScreen && (
            <img
              src={currentScreen.imageUrl}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          )}

          {/* Backdrop */}
          {currentGuide?.highlight.backdrop.enabled && (
            <Backdrop
              targetRect={currentGuide.targetRect}
              opacity={currentGuide.highlight.backdrop.opacity}
              color={currentGuide.highlight.backdrop.color}
              padding={8}
              borderRadius={4}
            />
          )}

          {/* Guide/Tooltip */}
          {currentGuide && (
            <GuideTooltip
              guide={currentGuide}
              onNext={nextStep}
              onPrev={prevStep}
              currentStep={state.currentStepIndex + 1}
              totalSteps={steps.length}
            />
          )}
        </div>
      </div>

      {/* Step Indicators */}
      {demo.settings.showStepIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === state.currentStepIndex
                  ? 'bg-purple-500'
                  : state.visitedSteps.has(step.id)
                  ? 'bg-purple-300'
                  : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Exit Preview Button (only in preview mode) */}
      {mode === 'preview' && (
        <button className="absolute top-4 left-4 px-4 py-2 bg-white rounded-lg shadow flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Exit Preview
        </button>
      )}
    </div>
  );
};
```

---

# FASE 2: DIFERENCIAÇÃO (Semanas 3-4)

## 2.1 Sistema de Chapters

### Schema do Banco de Dados

```prisma
// prisma/schema.prisma

model Demo {
  id          String    @id @default(cuid())
  name        String
  status      DemoStatus @default(DRAFT)
  workspaceId String
  settings    Json      @default("{}")
  chapters    Chapter[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Chapter {
  id       String  @id @default(cuid())
  demoId   String
  demo     Demo    @relation(fields: [demoId], references: [id], onDelete: Cascade)
  name     String
  order    Int
  steps    Step[]
}

model Step {
  id        String  @id @default(cuid())
  chapterId String
  chapter   Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  screenId  String
  screen    Screen  @relation(fields: [screenId], references: [id])
  guideId   String? @unique
  guide     Guide?  @relation(fields: [guideId], references: [id])
  order     Int
}

model Screen {
  id        String   @id @default(cuid())
  demoId    String
  imageUrl  String
  width     Int
  height    Int
  steps     Step[]
  createdAt DateTime @default(now())
}

model Guide {
  id        String  @id @default(cuid())
  type      GuideType
  content   Json    // Rich text content
  style     Json    // GuideStyle
  highlight Json    // HighlightSettings
  ctas      Json    // CTASettings
  position  Json    // PositionSettings
  config    Json    // ConfigSettings
  step      Step?
}

enum DemoStatus {
  DRAFT
  PUBLISHED
}

enum GuideType {
  HOTSPOT
  TOOLTIP
  TEXT_MODAL
  MEDIA_MODAL
  LEAD_FORM
}
```

### Componente ChaptersMenu

```typescript
// components/demos/viewer/ChaptersMenu.tsx

interface ChaptersMenuProps {
  chapters: Chapter[];
  currentChapterId: string;
  completedChapterIds: Set<string>;
  onSelectChapter: (chapterId: string) => void;
  position: 'left' | 'center' | 'right';
  buttonText: string;
  buttonColor: string;
}

const ChaptersMenu: React.FC<ChaptersMenuProps> = ({
  chapters,
  currentChapterId,
  completedChapterIds,
  onSelectChapter,
  position,
  buttonText,
  buttonColor
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    left: 'bottom-4 left-4',
    center: 'bottom-4 left-1/2 -translate-x-1/2',
    right: 'bottom-4 right-4',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-50`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: buttonColor }}
        className="px-4 py-2 rounded-lg text-white font-medium shadow-lg flex items-center gap-2"
      >
        <ListIcon className="w-4 h-4" />
        {buttonText}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-xl border overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Chapters</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => {
              const isCompleted = completedChapterIds.has(chapter.id);
              const isCurrent = chapter.id === currentChapterId;

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    onSelectChapter(chapter.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    isCurrent ? 'bg-purple-50' : ''
                  }`}
                >
                  {/* Status Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isCurrent
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Chapter Name */}
                  <span className={`flex-1 text-left ${
                    isCurrent ? 'font-medium text-purple-700' : 'text-gray-700'
                  }`}>
                    {chapter.name}
                  </span>

                  {/* Step Count */}
                  <span className="text-xs text-gray-400">
                    {chapter.steps.length} steps
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 2.2 Demo Themes (Presets Salvos)

### Schema

```prisma
model DemoTheme {
  id          String  @id @default(cuid())
  workspaceId String
  name        String
  isDefault   Boolean @default(false)
  
  // Guide Styles
  hotspotStyle   Json  // GuideStyle para hotspots
  tooltipStyle   Json  // GuideStyle para tooltips
  modalStyle     Json  // GuideStyle para modals
  
  // Global Settings
  backdropColor     String @default("#000000")
  backdropOpacity   Float  @default(0.6)
  stepIndicatorColor String @default("#7C3AED")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Endpoints

```typescript
// app/api/themes/route.ts

// GET /api/themes - Lista todos os temas do workspace
// POST /api/themes - Cria novo tema
// PATCH /api/themes/:id - Atualiza tema
// DELETE /api/themes/:id - Deleta tema
// POST /api/themes/:id/apply - Aplica tema a uma demo
```

### Componente ThemeSelector

```typescript
// components/demos/editor/ThemeSelector.tsx

interface ThemeSelectorProps {
  themes: DemoTheme[];
  currentThemeId: string | null;
  onSelectTheme: (themeId: string) => void;
  onCreateTheme: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentThemeId,
  onSelectTheme,
  onCreateTheme
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Demo Theme</label>
      
      <div className="grid grid-cols-2 gap-2">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              theme.id === currentThemeId
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Theme Preview */}
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: theme.tooltipStyle.backgroundColor }}
              />
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.hotspotStyle.hotspotColor }}
              />
            </div>
            <span className="text-xs font-medium">{theme.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onCreateTheme}
        className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded border border-dashed border-purple-300"
      >
        + Create New Theme
      </button>
    </div>
  );
};
```

---

## 2.3 Text Modals

### Implementação

```typescript
// components/demos/viewer/TextModal.tsx

interface TextModalProps {
  guide: Guide; // type === 'TEXT_MODAL'
  onNext: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  currentStep: number;
  totalSteps: number;
}

const TextModal: React.FC<TextModalProps> = ({
  guide,
  onNext,
  onPrev,
  onClose,
  currentStep,
  totalSteps
}) => {
  const { style, content, ctas, config } = guide;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: guide.highlight.backdrop.color,
          opacity: guide.highlight.backdrop.opacity 
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: style.backgroundColor,
          fontFamily: style.fontFamily,
        }}
      >
        {/* Header with close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div
          className="p-8"
          style={{ color: style.textColor }}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          {/* Step indicator */}
          {config.showStepNumber && (
            <span className="text-sm opacity-70" style={{ color: style.textColor }}>
              {currentStep} of {totalSteps}
            </span>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-3 ml-auto">
            {config.showPreviousButton && onPrev && currentStep > 1 && (
              <button
                onClick={onPrev}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                style={{ color: style.textColor }}
              >
                Back
              </button>
            )}

            {ctas.secondaryCTA?.enabled && (
              <a
                href={ctas.secondaryCTA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                style={{ color: style.textColor }}
              >
                {ctas.secondaryCTA.text}
              </a>
            )}

            {ctas.primaryCTA?.enabled && (
              <button
                onClick={onNext}
                className="px-6 py-2 text-sm font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {ctas.primaryCTA.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 2.4 Step Indicators

### Implementação

```typescript
// components/demos/viewer/StepIndicators.tsx

interface StepIndicatorsProps {
  steps: Step[];
  currentIndex: number;
  visitedIndices: Set<number>;
  onClickStep?: (index: number) => void;
  color: string;
  position: 'bottom' | 'top';
}

const StepIndicators: React.FC<StepIndicatorsProps> = ({
  steps,
  currentIndex,
  visitedIndices,
  onClickStep,
  color,
  position
}) => {
  const positionClass = position === 'bottom' ? 'bottom-6' : 'top-6';

  return (
    <div className={`absolute ${positionClass} left-1/2 -translate-x-1/2 flex items-center gap-2 z-40`}>
      {steps.map((_, index) => {
        const isActive = index === currentIndex;
        const isVisited = visitedIndices.has(index);
        const isClickable = !!onClickStep;

        return (
          <button
            key={index}
            onClick={() => isClickable && onClickStep?.(index)}
            disabled={!isClickable}
            className={`transition-all duration-200 rounded-full ${
              isClickable ? 'cursor-pointer' : 'cursor-default'
            } ${
              isActive
                ? 'w-8 h-2'
                : 'w-2 h-2'
            }`}
            style={{
              backgroundColor: isActive || isVisited ? color : '#D1D5DB',
              opacity: isActive ? 1 : isVisited ? 0.7 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
};
```

---

## 2.5 Embed Code Generator

### API Endpoint

```typescript
// app/api/demos/[id]/embed/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const demoId = params.id;
  const searchParams = req.nextUrl.searchParams;
  
  const width = searchParams.get('width') || '100%';
  const height = searchParams.get('height') || '600px';
  const autoplay = searchParams.get('autoplay') === 'true';

  const embedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/embed/${demoId}`;

  const iframeCode = `<iframe 
  src="${embedUrl}${autoplay ? '?autoplay=true' : ''}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allowfullscreen
  allow="clipboard-write"
></iframe>`;

  const scriptCode = `<div id="productstory-${demoId}"></div>
<script src="${process.env.NEXT_PUBLIC_APP_URL}/embed.js"></script>
<script>
  ProductStory.init({
    container: '#productstory-${demoId}',
    demoId: '${demoId}',
    width: '${width}',
    height: '${height}',
    autoplay: ${autoplay}
  });
</script>`;

  return NextResponse.json({
    iframe: iframeCode,
    script: scriptCode,
    directLink: embedUrl,
  });
}
```

### Componente EmbedModal

```typescript
// components/demos/editor/EmbedModal.tsx

interface EmbedModalProps {
  demoId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EmbedModal: React.FC<EmbedModalProps> = ({ demoId, isOpen, onClose }) => {
  const [embedType, setEmbedType] = useState<'iframe' | 'script' | 'link'>('iframe');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('600px');
  const [autoplay, setAutoplay] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: embedData } = useSWR(
    `/api/demos/${demoId}/embed?width=${width}&height=${height}&autoplay=${autoplay}`
  );

  const copyToClipboard = async () => {
    const text = embedType === 'iframe' 
      ? embedData?.iframe 
      : embedType === 'script'
      ? embedData?.script
      : embedData?.directLink;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Embed Demo</h2>
          <button onClick={onClose}>
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Embed Type Tabs */}
          <div className="flex gap-2">
            {(['iframe', 'script', 'link'] as const).map(type => (
              <button
                key={type}
                onClick={() => setEmbedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  embedType === type
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'iframe' ? 'iFrame' : type === 'script' ? 'JavaScript' : 'Direct Link'}
              </button>
            ))}
          </div>

          {/* Settings */}
          {embedType !== 'link' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="100% or 800px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="600px"
                />
              </div>
            </div>
          )}

          {/* Autoplay Toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Auto-play demo</span>
          </label>

          {/* Code Block */}
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {embedType === 'iframe' && embedData?.iframe}
              {embedType === 'script' && embedData?.script}
              {embedType === 'link' && embedData?.directLink}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

# FASE 3: FEATURES AVANÇADAS (Semanas 5-8)

## 3.1 Analytics Básico

### Schema

```prisma
model DemoView {
  id           String   @id @default(cuid())
  demoId       String
  sessionId    String   // UUID gerado no client
  visitorId    String?  // Identificador persistente (cookie)
  
  // Visitor Info
  ipAddress    String?
  userAgent    String?
  referrer     String?
  country      String?
  city         String?
  
  // Engagement
  startedAt    DateTime @default(now())
  endedAt      DateTime?
  completed    Boolean  @default(false)
  
  // Step Tracking
  stepViews    StepView[]
  
  // Lead Info (se preencheu form)
  email        String?
  firstName    String?
  lastName     String?
  company      String?
}

model StepView {
  id         String   @id @default(cuid())
  viewId     String
  view       DemoView @relation(fields: [viewId], references: [id], onDelete: Cascade)
  stepId     String
  viewedAt   DateTime @default(now())
  timeSpent  Int      // segundos
  clicked    Boolean  @default(false) // clicou no CTA
}
```

### API Endpoints

```typescript
// app/api/analytics/track/route.ts

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event, demoId, sessionId, data } = body;

  switch (event) {
    case 'view_start':
      await prisma.demoView.create({
        data: {
          demoId,
          sessionId,
          visitorId: data.visitorId,
          ipAddress: req.ip,
          userAgent: req.headers.get('user-agent'),
          referrer: data.referrer,
        }
      });
      break;

    case 'step_view':
      await prisma.stepView.create({
        data: {
          viewId: data.viewId,
          stepId: data.stepId,
          timeSpent: data.timeSpent,
        }
      });
      break;

    case 'view_complete':
      await prisma.demoView.update({
        where: { id: data.viewId },
        data: {
          endedAt: new Date(),
          completed: true,
        }
      });
      break;

    case 'lead_capture':
      await prisma.demoView.update({
        where: { id: data.viewId },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
        }
      });
      break;
  }

  return NextResponse.json({ success: true });
}

// app/api/demos/[id]/analytics/route.ts

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const demoId = params.id;
  const searchParams = req.nextUrl.searchParams;
  const period = searchParams.get('period') || '7d';

  const startDate = getStartDate(period);

  // Total views
  const totalViews = await prisma.demoView.count({
    where: { demoId, startedAt: { gte: startDate } }
  });

  // Completion rate
  const completedViews = await prisma.demoView.count({
    where: { demoId, startedAt: { gte: startDate }, completed: true }
  });

  // Average time spent
  const avgTimeSpent = await prisma.stepView.aggregate({
    where: { view: { demoId, startedAt: { gte: startDate } } },
    _avg: { timeSpent: true }
  });

  // Step drop-off analysis
  const stepViews = await prisma.stepView.groupBy({
    by: ['stepId'],
    where: { view: { demoId, startedAt: { gte: startDate } } },
    _count: true,
    orderBy: { _count: { stepId: 'desc' } }
  });

  // Leads captured
  const leadsCount = await prisma.demoView.count({
    where: { demoId, startedAt: { gte: startDate }, email: { not: null } }
  });

  return NextResponse.json({
    totalViews,
    completionRate: totalViews > 0 ? (completedViews / totalViews) * 100 : 0,
    avgTimeSpent: avgTimeSpent._avg.timeSpent || 0,
    stepDropoff: stepViews,
    leadsCount,
  });
}
```

### Dashboard Component

```typescript
// components/demos/analytics/AnalyticsDashboard.tsx

interface AnalyticsDashboardProps {
  demoId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ demoId }) => {
  const [period, setPeriod] = useState('7d');
  const { data, isLoading } = useSWR(`/api/demos/${demoId}/analytics?period=${period}`);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center gap-2">
        {['24h', '7d', '30d', '90d'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded text-sm ${
              period === p ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={data.totalViews}
          icon={<EyeIcon />}
        />
        <MetricCard
          title="Completion Rate"
          value={`${data.completionRate.toFixed(1)}%`}
          icon={<CheckCircleIcon />}
        />
        <MetricCard
          title="Avg. Time Spent"
          value={formatDuration(data.avgTimeSpent)}
          icon={<ClockIcon />}
        />
        <MetricCard
          title="Leads Captured"
          value={data.leadsCount}
          icon={<UserIcon />}
        />
      </div>

      {/* Drop-off Funnel */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">Step Drop-off</h3>
        <DropoffFunnel data={data.stepDropoff} />
      </div>
    </div>
  );
};
```

---

## 3.2 Lead Forms

### Schema

```prisma
model LeadForm {
  id        String   @id @default(cuid())
  demoId    String   @unique
  demo      Demo     @relation(fields: [demoId], references: [id], onDelete: Cascade)
  
  enabled   Boolean  @default(false)
  trigger   LeadFormTrigger @default(ON_OPEN)
  delay     Int?     // segundos, se trigger === AFTER_DELAY
  stepIndex Int?     // se trigger === AFTER_STEP
  
  // Fields config
  fields    Json     // Array de LeadFormField
  
  // Styling
  title     String   @default("Get a personalized demo")
  subtitle  String?
  buttonText String  @default("Continue")
  
  // Integration
  webhookUrl String?
  hubspotEnabled Boolean @default(false)
  hubspotFormId String?
}

enum LeadFormTrigger {
  ON_OPEN
  AFTER_DELAY
  AFTER_STEP
  ON_EXIT
}
```

### Component

```typescript
// components/demos/viewer/LeadFormModal.tsx

interface LeadFormField {
  id: string;
  type: 'email' | 'text' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // para select
}

interface LeadFormModalProps {
  form: LeadForm;
  onSubmit: (data: Record<string, string>) => void;
  onSkip?: () => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ form, onSubmit, onSkip }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    form.fields.forEach((field: LeadFormField) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required';
      }
      if (field.type === 'email' && formData[field.id] && !isValidEmail(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid email';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">{form.title}</h2>
            {form.subtitle && (
              <p className="mt-2 text-gray-600">{form.subtitle}</p>
            )}
          </div>

          {/* Fields */}
          <div className="px-6 space-y-4">
            {form.fields.map((field: LeadFormField) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
                
                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : form.buttonText}
            </button>
            
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
              >
                Skip for now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## 3.3 Tokens/Variables (Personalização)

### Schema

```prisma
model DemoToken {
  id          String  @id @default(cuid())
  demoId      String
  demo        Demo    @relation(fields: [demoId], references: [id], onDelete: Cascade)
  
  key         String  // ex: "first_name", "company"
  label       String  // ex: "First Name", "Company"
  defaultValue String
  
  @@unique([demoId, key])
}
```

### Uso no Viewer

```typescript
// lib/tokens.ts

export function replaceTokens(
  content: string,
  tokens: Record<string, string>
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return tokens[key] || match;
  });
}

// No DemoViewer
const DemoViewer = ({ demo, urlParams }) => {
  // Extrair tokens da URL
  const tokens: Record<string, string> = {};
  demo.tokens.forEach(token => {
    tokens[token.key] = urlParams.get(`token[${token.key}]`) || token.defaultValue;
  });

  // Aplicar tokens ao conteúdo do guide
  const processedContent = replaceTokens(currentGuide.content.html, tokens);
};
```

### URL com Tokens

```
https://shipkit.app/demo/abc123?token[first_name]=João&token[company]=Acme
```

---

## 3.4 AI Auto-Flow (Diferenciador Principal)

### Descrição
IA analisa as screenshots uploadadas e automaticamente:
1. Sugere ordem lógica das telas
2. Gera copy para cada step
3. Identifica elementos importantes para hotspots

### API Endpoint

```typescript
// app/api/demos/[id]/ai-generate/route.ts

import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const demoId = params.id;
  
  // Buscar screenshots da demo
  const screens = await prisma.screen.findMany({
    where: { demoId },
    orderBy: { createdAt: 'asc' }
  });

  // Preparar imagens para a API
  const imageUrls = screens.map(s => s.imageUrl);

  // Prompt para análise
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a product demo expert. Analyze these product screenshots and generate an interactive demo flow.

For each screen, provide:
1. A suggested order (which screen should come first, second, etc.)
2. A title for the step (max 50 chars)
3. A description/tooltip text (max 200 chars)
4. Suggested hotspot position as percentage from top-left (x%, y%)
5. What the hotspot should highlight (button, form, feature, etc.)

Return as JSON array:
[{
  "screenIndex": 0,
  "order": 1,
  "title": "Welcome to Dashboard",
  "description": "This is your main dashboard where you can see all your key metrics at a glance.",
  "hotspot": { "x": 25, "y": 30, "target": "navigation menu" }
}]`
      },
      {
        role: 'user',
        content: imageUrls.map((url, i) => ({
          type: 'image_url',
          image_url: { url }
        }))
      }
    ],
    max_tokens: 2000,
  });

  const generatedFlow = JSON.parse(response.choices[0].message.content);

  // Criar steps baseado na análise
  const chapter = await prisma.chapter.create({
    data: {
      demoId,
      name: 'Generated Flow',
      order: 0,
    }
  });

  for (const item of generatedFlow) {
    const screen = screens[item.screenIndex];
    
    // Criar guide
    const guide = await prisma.guide.create({
      data: {
        type: 'TOOLTIP',
        content: { html: `<p><strong>${item.title}</strong></p><p>${item.description}</p>` },
        style: { backgroundColor: '#7C3AED', textColor: '#FFFFFF', fontFamily: 'Inter' },
        highlight: { backdrop: { enabled: true, opacity: 0.6, color: '#000000' }, spotlight: { enabled: false } },
        ctas: { primaryCTA: { enabled: true, text: 'Next', action: 'next' }, secondaryCTA: { enabled: false } },
        position: { arrowPosition: 'top-left', offsetX: item.hotspot.x, offsetY: item.hotspot.y, width: 15, height: 15 },
        config: { showStepNumber: true, showPreviousButton: false, hideOnMouseOut: false, autoAdvance: { enabled: false } },
      }
    });

    // Criar step
    await prisma.step.create({
      data: {
        chapterId: chapter.id,
        screenId: screen.id,
        guideId: guide.id,
        order: item.order,
      }
    });
  }

  return NextResponse.json({ success: true, stepsCreated: generatedFlow.length });
}
```

### UI Component

```typescript
// components/demos/editor/AIGenerateButton.tsx

const AIGenerateButton: React.FC<{ demoId: string; onComplete: () => void }> = ({
  demoId,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress('Analyzing screenshots...');

    try {
      const response = await fetch(`/api/demos/${demoId}/ai-generate`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProgress(`Created ${data.stepsCreated} steps!`);
        setTimeout(() => {
          setIsGenerating(false);
          onComplete();
        }, 1500);
      }
    } catch (error) {
      setProgress('Error generating flow');
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <LoadingSpinner className="w-4 h-4" />
          {progress}
        </>
      ) : (
        <>
          <SparklesIcon className="w-4 h-4" />
          Generate with AI
        </>
      )}
    </button>
  );
};
```

---

# APÊNDICE A: ESTRUTURA DE ARQUIVOS COMPLETA

```
app/
  (dashboard)/
    demos/
      page.tsx                    # Lista de demos
      [id]/
        page.tsx                  # Editor de demo
        preview/page.tsx          # Preview mode
        analytics/page.tsx        # Dashboard de analytics
        settings/page.tsx         # Configurações da demo
  
  embed/
    [id]/page.tsx                 # Demo embeddable
  
  api/
    demos/
      route.ts                    # CRUD demos
      [id]/
        route.ts                  # CRUD demo específica
        embed/route.ts            # Gerar embed code
        analytics/route.ts        # Analytics data
        ai-generate/route.ts      # AI flow generation
        publish/route.ts          # Publicar demo
    
    screens/
      route.ts                    # Upload screenshots
      [id]/route.ts               # CRUD screen
    
    guides/
      route.ts                    # CRUD guides
      [id]/route.ts
    
    chapters/
      route.ts
      [id]/route.ts
    
    steps/
      route.ts
      [id]/route.ts
    
    themes/
      route.ts
      [id]/
        route.ts
        apply/route.ts
    
    analytics/
      track/route.ts              # Tracking endpoint

components/
  demos/
    editor/
      DemoEditor.tsx              # Container principal do editor
      TopBar.tsx                  # Header com nome, preview, publish
      LeftSidebar.tsx             # Lista de screens
      Canvas.tsx                  # Área central de edição
      GuideEditPanel/
        index.tsx
        StyleSection.tsx
        HighlightSection.tsx
        CTAsSection.tsx
        PositionSection.tsx
        ConfigSection.tsx
        ThemeSection.tsx
      StepsPanel.tsx              # Timeline de steps (direita)
      RichTextToolbar.tsx         # Editor de texto inline
      ScreenUploader.tsx          # Upload de screenshots
      GuideSelector.tsx           # Modal para escolher tipo de guide
      EmbedModal.tsx              # Modal com embed codes
      AIGenerateButton.tsx        # Botão de geração IA
    
    viewer/
      DemoViewer.tsx              # Viewer principal
      Backdrop.tsx                # Overlay com cutout
      GuideTooltip.tsx            # Renderiza tooltip/hotspot
      TextModal.tsx               # Modal de texto
      MediaModal.tsx              # Modal com mídia
      LeadFormModal.tsx           # Formulário de captura
      ChaptersMenu.tsx            # Menu de chapters
      StepIndicators.tsx          # Dots de progresso
    
    analytics/
      AnalyticsDashboard.tsx      # Dashboard principal
      MetricCard.tsx              # Card de métrica
      DropoffFunnel.tsx           # Visualização de drop-off
      ViewsChart.tsx              # Gráfico de views

lib/
  prisma.ts                       # Client Prisma
  tokens.ts                       # Utilitários de tokens
  analytics.ts                    # Funções de tracking
  openai.ts                       # Client OpenAI

hooks/
  useDemo.ts                      # Hook para dados da demo
  useGuide.ts                     # Hook para edição de guide
  useAnalytics.ts                 # Hook para tracking
```

---

# APÊNDICE B: VARIÁVEIS DE AMBIENTE

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="https://shipkit.app"

# OpenAI (para AI features)
OPENAI_API_KEY="sk-..."

# Storage (para screenshots)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="shipkit-demos"
AWS_REGION="us-east-1"

# Analytics (opcional)
MIXPANEL_TOKEN="..."

# Integrations (opcional)
HUBSPOT_API_KEY="..."
```

---

# APÊNDICE C: COMANDOS DE SETUP

```bash
# Instalar dependências
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-color @tiptap/extension-text-style
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install openai
npm install swr

# Gerar Prisma client após atualizar schema
npx prisma generate
npx prisma db push

# Rodar migrações
npx prisma migrate dev --name add_demo_models
```

---

# APÊNDICE D: CHECKLIST DE IMPLEMENTAÇÃO

## Fase 1
- [ ] GuideEditPanel com todas as 6 seções
- [ ] Backdrop com cutout (clip-path ou SVG mask)
- [ ] Rich text editor com TipTap
- [ ] Steps panel com drag & drop
- [ ] Preview mode funcional

## Fase 2
- [ ] Sistema de Chapters
- [ ] Demo Themes
- [ ] Text Modals
- [ ] Step indicators
- [ ] Embed code generator

## Fase 3
- [ ] Analytics tracking
- [ ] Analytics dashboard
- [ ] Lead forms
- [ ] Tokens/Variables
- [ ] AI auto-flow generation

---

**FIM DO DOCUMENTO**
