'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    CalendarPlus,
    MessageSquareQuote,
    Users,
    LogOut,
    ShieldCheck,
    Building,
    User
} from 'lucide-react';
import Link from 'next/link';

const studentLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/book-appointment', label: 'Book Appointment', icon: CalendarPlus },
  { href: '/inquiries', label: 'My Inquiries', icon: MessageSquareQuote },
];

const staffLinks = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const getRoleAndLinks = (pathname: string) => {
    if (pathname.startsWith('/student')) {
        return { role: 'Student', icon: <User className="w-5 h-5"/>, links: studentLinks };
    }
    if (pathname.startsWith('/staff')) {
        return { role: 'Staff', icon: <Building className="w-5 h-5"/>, links: staffLinks };
    }
    if (pathname.startsWith('/admin')) {
        return { role: 'Admin', icon: <ShieldCheck className="w-5 h-5"/>, links: adminLinks };
    }
    return { role: 'User', icon: <User className="w-5 h-5"/>, links: [] };
}


export function AppSidebar() {
  const pathname = usePathname();
  const { role, icon, links } = getRoleAndLinks(pathname);
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            {icon}
            <span className="text-lg font-semibold font-headline">{role} View</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <Link href="/" className="w-full">
                    <SidebarMenuButton tooltip="Logout">
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                 </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
