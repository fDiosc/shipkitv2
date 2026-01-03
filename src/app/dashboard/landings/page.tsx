import { db } from "@/db";
import { landings } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Edit3, Users } from "lucide-react";
import { NewLandingModal } from "@/components/dashboard/NewLandingModal";
import { DeleteLandingAction } from "@/components/dashboard/DeleteLandingAction";
import Link from "next/link";
import { getLandingUrl } from "@/lib/urls";

export default async function LandingsPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const userLandings = await db.query.landings.findMany({
        where: eq(landings.userId, userId),
        orderBy: [desc(landings.createdAt)],
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">My Landings</h1>
                    <p className="text-neutral-500">Manage and monitor your landing pages.</p>
                </div>
                <NewLandingModal />
            </div>

            <div className="rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                            <TableHead className="w-[300px]">Project</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subdomain</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userLandings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                                    You haven't created any landing pages yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            userLandings.map((landing) => (
                                <TableRow key={landing.id} className="group cursor-pointer hover:bg-neutral-50/50">
                                    <TableCell className="font-medium">
                                        <Link href={`/editor/${landing.id}`} className="hover:text-blue-600">
                                            {landing.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={landing.status === "published" ? "default" : "secondary"}
                                            className={landing.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 shadow-none"}
                                        >
                                            {landing.status === "published" ? "Live" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-500">
                                        <span className="flex items-center gap-1">
                                            {landing.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || (process.env.NODE_ENV === "development" ? "localhost:3000" : "landingbuilder.com")}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-neutral-500">
                                        {new Date(landing.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/editor/${landing.id}`} className="flex items-center gap-2">
                                                        <Edit3 className="h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/leads?landingId=${landing.id}`} className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" /> View Leads
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={getLandingUrl(landing.subdomain)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" /> View Live
                                                    </a>
                                                </DropdownMenuItem>
                                                <DeleteLandingAction id={landing.id} name={landing.name} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
