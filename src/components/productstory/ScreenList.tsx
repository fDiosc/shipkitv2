import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2 } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    hotspots: any[];
}

interface ScreenListProps {
    screens: Screen[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReorder: (newOrder: string[]) => void;
    onDelete?: (id: string) => void;
}

function SortableScreenItem({
    screen,
    index,
    isSelected,
    onSelect,
    onDelete
}: {
    screen: Screen;
    index: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete?: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: screen.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left group relative",
                isSelected
                    ? "bg-blue-50 ring-2 ring-blue-500"
                    : "hover:bg-neutral-50",
                isDragging && "opacity-50 shadow-lg bg-white"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="opacity-0 group-hover:opacity-100 cursor-grab p-1 hover:text-neutral-500 transition-opacity"
            >
                <GripVertical className="h-4 w-4 text-neutral-300" />
            </div>

            {/* Clickable content */}
            <button
                onClick={() => onSelect(screen.id)}
                className="flex-1 flex items-center gap-2 min-w-0"
            >
                {/* Thumbnail */}
                <div className="w-16 h-10 rounded bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                    <img
                        src={screen.imageUrl}
                        alt={`Screen ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-neutral-700 truncate">
                        S{index + 1}: Screen
                    </p>
                    <p className="text-xs text-neutral-400">
                        {screen.hotspots.length} hotspot{screen.hotspots.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </button>

            {/* Delete button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(screen.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded text-red-500 transition-all"
                    title="Delete screen"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}

export function ScreenList({ screens, selectedId, onSelect, onReorder, onDelete }: ScreenListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const sortedScreens = useMemo(() => {
        return [...screens].sort((a, b) => a.order - b.order);
    }, [screens]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedScreens.findIndex((s) => s.id === active.id);
            const newIndex = sortedScreens.findIndex((s) => s.id === over.id);

            const newOrder = arrayMove(sortedScreens, oldIndex, newIndex).map(s => s.id);
            onReorder(newOrder);
        }
    };

    if (screens.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-400 text-sm">
                No screens uploaded
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sortedScreens.map(s => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-1.5 p-1">
                    {sortedScreens.map((screen, index) => (
                        <SortableScreenItem
                            key={screen.id}
                            screen={screen}
                            index={index}
                            isSelected={selectedId === screen.id}
                            onSelect={onSelect}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

