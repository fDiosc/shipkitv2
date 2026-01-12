import { redirect } from "next/navigation";

interface WorkspacePageProps {
    params: Promise<{ workspaceSlug: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    const { workspaceSlug } = await params;

    // Redirect to demos as the main feature
    redirect(`/dashboard/${workspaceSlug}/demos`);
}
