import { Outlet } from 'react-router';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export function VisitorLayout() {
    return (
        <SidebarProvider>
            <AppSidebar view="visitor" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <main className="flex-1 w-full p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
