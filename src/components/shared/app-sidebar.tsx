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
    LogOut,
    Stethoscope,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const studentLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/book-appointment', label: 'Book Appointment', icon: CalendarPlus },
  { href: '/inquiries', label: 'My Inquiries', icon: MessageSquareQuote },
];

const doctorLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  
  const getRoleAndLinks = () => {
    if (!currentUser) return { role: 'User', icon: <User className="w-5 h-5"/>, links: [] };

    switch(currentUser.role) {
        case 'student':
            return { role: 'Student', icon: <User className="w-5 h-5"/>, links: studentLinks };
        case 'staff':
            return { role: 'Staff', icon: <User className="w-5 h-5"/>, links: studentLinks };
        case 'doctor':
            return { role: 'Doctor', icon: <Stethoscope className="w-5 h-5"/>, links: doctorLinks };
        default:
            return { role: 'User', icon: <User className="w-5 h-5"/>, links: [] };
    }
  }
  
  const { role, icon, links } = getRoleAndLinks();
  
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
                  isActive={pathname.startsWith(link.href)}
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
                 <SidebarMenuButton onClick={logout} tooltip="Logout" className="w-full">
                    <LogOut/>
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
