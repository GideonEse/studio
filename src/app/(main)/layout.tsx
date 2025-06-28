'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { UserNav } from '@/components/shared/user-nav';
import { Logo } from '@/components/icons/logo';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // If there's no user after a brief moment, redirect to login.
    const timer = setTimeout(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, 100); // Small delay to allow context to populate
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
  }

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
            <h1 className="text-xl font-bold text-foreground font-headline">Crawford University HMS</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
