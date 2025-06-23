import { AppSidebar } from '@/components/shared/app-sidebar';
import { UserNav } from '@/components/shared/user-nav';
import { Logo } from '@/components/icons/logo';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground font-headline">CampusCare Connect</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
