/**
 * Special fullscreen layout for the demo editor
 * 
 * This layout removes the sidebar and topbar to give the editor
 * maximum screen real estate while maintaining workspace context.
 */
export default function DemoEditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout just renders children without any wrapper
    // The parent dashboard layout's sidebar/topbar won't show
    // because this layout intercepts the rendering
    return (
        <div className="fixed inset-0 z-50 bg-neutral-900">
            {children}
        </div>
    );
}
