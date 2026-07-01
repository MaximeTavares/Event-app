'use client';

import {
    SidebarGroup,
    // SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';

export function NavProjects({
    projects,
}: Readonly<{
    projects: {
        name: string;
        url: string;
        icon: React.ReactNode;
    }[];
}>) {
    // const { isMobile } = useSidebar();

    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton tooltip={item.name} asChild>
                            <Link to={item.url}>
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>

                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover className="aria-expanded:bg-muted">
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-fit"
                                side={isMobile ? 'bottom' : 'right'}
                                align={isMobile ? 'end' : 'start'}
                            >
                                <DropdownMenuItem>
                                    <FolderIcon />
                                    <span>View Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ArrowRightIcon />
                                    <span>Share Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <Trash2Icon />
                                    <span>Delete Project</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </SidebarMenuItem>
                ))}
                {/* <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    );
}
