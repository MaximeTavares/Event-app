import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useSignout } from '@/features/auth/hooks/use_auth.service';
import { ChevronsUpDownIcon, BadgeCheckIcon, BellIcon, LogOutIcon, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from './theme-provider';

export function NavUser({
    user,
}: Readonly<{
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}>) {
    const { isMobile } = useSidebar();
    const { setTheme } = useTheme();

    const navigate = useNavigate();

    const signoutMutation = useSignout();

    const handleSignout = async () => {
        await signoutMutation.mutateAsync();
        await navigate('/');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">N.A</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-fit"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheckIcon />
                                Account (WIP)
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BellIcon />
                                Notifications (WIP)
                            </DropdownMenuItem>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                    <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                    Thème
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        Clair
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                                        Sombre
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('system')}>
                                        Système
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignout}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
