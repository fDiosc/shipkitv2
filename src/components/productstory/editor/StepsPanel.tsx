"use client";

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

interface Step {
    id: string;
    order: number;
    screenId: string;
    hotspotId: string | null;
    title: string | null;
    body: string | null;
}

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
}

interface StepsPanelProps {
    steps: Step[];
    screens: Screen[];
    currentStepId: string | null;
    onSelectStep: (stepId: string) => void;
    onReorderSteps: (startIndex: number, endIndex: number) => void;
    onAddStep: (afterStepId?: string) => void;
    onDeleteStep: (stepId: string) => void;
}

interface SortableStepProps {
    step: Step;
    index: number;
    isActive: boolean;
    screen: Screen | undefined;
    onSelect: () => void;
    onAddAfter: () => void;
    onDelete: () => void;
}

function SortableStep({ step, index, isActive, screen, onSelect, onAddAfter, onDelete }: SortableStepProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onSelect}
            className={cn(
                "relative group p-2 rounded-lg cursor-pointer transition-all",
                isActive
                    ? "ring-2 ring-violet-500 bg-violet-50"
                    : "hover:bg-neutral-50",
                isDragging && "opacity-50 shadow-lg"
            )}
        >
            {/* Step Number Badge */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-medium shadow-sm">
                {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="relative w-full h-12 rounded border overflow-hidden ml-4 bg-neutral-100">
                {screen ? (
                    <img
                        src={screen.imageUrl}
                        alt={`Step ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No screen
                    </div>
                )}

                {/* Hotspot indicator */}
                {step.hotspotId && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
                )}
            </div>

            {/* Step Title */}
            {step.title && (
                <p className="mt-1 ml-4 text-xs text-neutral-600 truncate">
                    {step.title}
                </p>
            )}

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-200"
            >
                <GripVertical className="w-3 h-3 text-neutral-400" />
            </div>

            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500"
            >
                <Trash2 className="w-3 h-3" />
            </button>

            {/* Add Step Button (between steps) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddAfter();
                }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs z-10 hover:bg-violet-700 shadow-sm"
            >
                <Plus className="w-3 h-3" />
            </button>
        </div>
    );
}

export function StepsPanel({
    steps,
    screens,
    currentStepId,
    onSelectStep,
    onReorderSteps,
    onAddStep,
    onDeleteStep,
}: StepsPanelProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = steps.findIndex((s) => s.id === active.id);
            const newIndex = steps.findIndex((s) => s.id === over.id);
            onReorderSteps(oldIndex, newIndex);
        }
    };

    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    const getScreenForStep = (screenId: string) => {
        return screens.find(s => s.id === screenId);
    };

    return (
        <div className="w-24 bg-white border-l flex flex-col h-full">
            {/* Header */}
            <div className="p-2 border-b">
                <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Steps
                </h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                    {steps.length} step{steps.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Steps List */}
            <div className="flex-1 overflow-y-auto p-2 pt-4 space-y-6">
                {sortedSteps.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-xs text-neutral-400">No steps yet</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sortedSteps.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sortedSteps.map((step, index) => (
                                <SortableStep
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    isActive={step.id === currentStepId}
                                    screen={getScreenForStep(step.screenId)}
                                    onSelect={() => onSelectStep(step.id)}
                                    onAddAfter={() => onAddStep(step.id)}
                                    onDelete={() => onDeleteStep(step.id)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Add Step Button */}
            <div className="p-2 border-t">
                <button
                    onClick={() => onAddStep()}
                    className="w-full py-2 text-xs font-medium text-violet-600 hover:bg-violet-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    ADD STEP
                </button>
            </div>
        </div>
    );
}
