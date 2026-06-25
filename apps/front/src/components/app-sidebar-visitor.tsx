'use client';

import * as React from 'react';

import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Settings2Icon, FrameIcon, PieChartIcon, Command, TerminalSquareIcon } from 'lucide-react';
import { useCurrentUser } from '@/features/user/hooks/use_currentUser';
import { Link } from 'react-router';
// import { NavMain } from './nav-main';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useCurrentUser();

    const data = {
        user: {
            name: user.name ?? '',
            email: user.email ?? '',
            avatar: user.avatar ?? '',
        },
        navMain: [
            {
                title: 'Playground',
                url: '#',
                icon: <TerminalSquareIcon />,
                isActive: true,
                items: [
                    {
                        title: 'Evènements',
                        url: '/me/events',
                    },
                    {
                        title: 'Missions',
                        url: '#',
                    },
                    {
                        title: 'Participation',
                        url: '#',
                    },
                ],
            },
            {
                title: 'Settings',
                url: '#',
                icon: <Settings2Icon />,
                items: [
                    {
                        title: 'General',
                        url: '/settings',
                    },
                    {
                        title: 'Team',
                        url: '#',
                    },
                    {
                        title: 'Billing',
                        url: '#',
                    },
                    {
                        title: 'Limits',
                        url: '#',
                    },
                ],
            },
        ],
        projects: [
            {
                name: 'Accueil',
                url: '/',
                icon: <FrameIcon />,
            },
            {
                name: 'Evènements',
                url: '/me/events',
                icon: <FrameIcon />,
            },
            {
                name: 'Missions',
                url: '/me/missions',
                icon: <PieChartIcon />,
            },
            {
                name: 'Paramètres',
                url: '/settings',
                icon: <Settings2Icon />,
            },
        ],
    };
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">H.E.L.P</span>
                                    <span className="truncate text-xs">
                                        Hub for Event Logistic & People
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* <NavMain items={data.navMain} /> */}
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
