import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles, workspaces, workspaceMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Helper to generate a unique slug
async function generateUniqueSlug(name: string): Promise<string> {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 30);
    let attempts = 0;

    while (attempts < 10) {
        const existing = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, slug),
        });

        if (!existing) return slug;

        const suffix = Math.random().toString(36).substring(2, 6);
        slug = `${slug.substring(0, 25)}-${suffix}`;
        attempts++;
    }

    return `workspace-${Date.now()}`;
}

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
            status: 400,
        })
    }

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        const { first_name, last_name, image_url, email_addresses } = evt.data
        const email = email_addresses?.[0]?.email_address
        const fullName = `${first_name || ''} ${last_name || ''}`.trim() || email?.split('@')[0] || 'User'

        // Create profile
        await db.insert(profiles)
            .values({
                id: id as string,
                fullName,
                avatarUrl: image_url,
            })
            .onConflictDoNothing()

        // Create personal workspace
        const workspaceName = `${fullName}'s Workspace`
        const slug = await generateUniqueSlug(workspaceName)

        const [workspace] = await db.insert(workspaces)
            .values({
                name: workspaceName,
                slug,
            })
            .returning()

        // Add user as owner
        await db.insert(workspaceMembers)
            .values({
                workspaceId: workspace.id,
                userId: id as string,
                role: 'owner',
            })

        console.log(`Created workspace '${workspaceName}' for user ${id}`)
    }

    if (eventType === 'user.updated') {
        const { first_name, last_name, image_url } = evt.data
        const fullName = `${first_name || ''} ${last_name || ''}`.trim()

        await db.update(profiles)
            .set({
                fullName,
                avatarUrl: image_url,
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, id as string))
    }

    if (eventType === 'user.deleted') {
        // Workspaces and memberships will be deleted via cascade
        await db.delete(profiles).where(eq(profiles.id, id as string))
    }

    return new Response('Webhook received', { status: 200 })
}

