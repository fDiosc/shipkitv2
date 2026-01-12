"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import {
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    AlignLeft,
    AlignCenter,
    AlignRight,
    X,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextToolbarProps {
    content: string;
    onChange: (html: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    placeholder?: string;
    className?: string;
}

export function RichTextToolbar({
    content,
    onChange,
    onSave,
    onCancel,
    placeholder = "Enter text...",
    className,
}: RichTextToolbarProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                code: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-400 underline',
                },
            }),
            TextAlign.configure({
                types: ['paragraph']
            }),
            TextStyle,
            Color,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[60px] p-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const insertVariable = (variable: string) => {
        editor.chain().focus().insertContent(`{{${variable}}}`).run();
    };

    return (
        <div className={cn("relative", className)}>
            {/* Floating Toolbar */}
            {editor.isFocused && (
                <div className="absolute -top-12 left-0 flex bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 p-1 gap-0.5 z-50">
                    {/* Bold */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive('bold') && "bg-neutral-700"
                        )}
                        title="Bold"
                    >
                        <Bold className="w-3.5 h-3.5" />
                    </button>

                    {/* Italic */}
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive('italic') && "bg-neutral-700"
                        )}
                        title="Italic"
                    >
                        <Italic className="w-3.5 h-3.5" />
                    </button>

                    {/* Link */}
                    <button
                        onClick={addLink}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive('link') && "bg-neutral-700"
                        )}
                        title="Add Link"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px bg-neutral-700 mx-1" />

                    {/* Bullet List */}
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive('bulletList') && "bg-neutral-700"
                        )}
                        title="Bullet List"
                    >
                        <List className="w-3.5 h-3.5" />
                    </button>

                    {/* Text Align */}
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive({ textAlign: 'left' }) && "bg-neutral-700"
                        )}
                        title="Align Left"
                    >
                        <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive({ textAlign: 'center' }) && "bg-neutral-700"
                        )}
                        title="Align Center"
                    >
                        <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={cn(
                            "p-1.5 rounded hover:bg-neutral-800 text-white",
                            editor.isActive({ textAlign: 'right' }) && "bg-neutral-700"
                        )}
                        title="Align Right"
                    >
                        <AlignRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px bg-neutral-700 mx-1" />

                    {/* Color Picker */}
                    <input
                        type="color"
                        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        className="w-6 h-6 rounded cursor-pointer border-none"
                        title="Text Color"
                    />

                    {/* Variables Dropdown */}
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                insertVariable(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        className="px-2 py-1 rounded bg-neutral-800 text-white text-xs border-none focus:outline-none"
                        title="Insert Variable"
                    >
                        <option value="">{'{ }'}</option>
                        <option value="first_name">First Name</option>
                        <option value="company">Company</option>
                        <option value="email">Email</option>
                    </select>

                    {onCancel && onSave && (
                        <>
                            <div className="w-px bg-neutral-700 mx-1" />

                            {/* Cancel */}
                            <button
                                onClick={onCancel}
                                className="p-1.5 rounded hover:bg-red-900/50 text-red-400"
                                title="Cancel"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Save */}
                            <button
                                onClick={onSave}
                                className="p-1.5 rounded hover:bg-green-900/50 text-green-400"
                                title="Save"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="border border-neutral-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent"
            />
        </div>
    );
}

/**
 * Simple inline editor for tooltip text
 */
export function SimpleRichTextEditor({
    content,
    onChange,
    placeholder = "Enter tooltip text...",
    backgroundColor = "#7C3AED",
    textColor = "#FFFFFF",
    className,
}: {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    backgroundColor?: string;
    textColor?: string;
    className?: string;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                code: false,
            }),
            Link.configure({ openOnClick: false }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[40px]',
                style: `color: ${textColor}`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div
            className={cn("rounded-lg p-3", className)}
            style={{ backgroundColor }}
        >
            <EditorContent editor={editor} />
            {!content && (
                <p className="text-sm opacity-50" style={{ color: textColor }}>
                    {placeholder}
                </p>
            )}
        </div>
    );
}
