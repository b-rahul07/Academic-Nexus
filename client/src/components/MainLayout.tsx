import React from 'react';
import { CardNav } from '@/components/CardNav';

interface NavCard {
  title: string;
  items: { label: string; href: string }[];
}

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

const getNavItems = (role?: string): NavCard[] => {
  if (!role) return [];

  switch (role) {
    case 'admin':
      return [
        {
          title: 'Users',
          items: [
            { label: 'Add Student', href: '/admin/dashboard?tab=students' },
            { label: 'Manage Faculty', href: '/admin/dashboard?tab=seating' },
            { label: 'Club Coordinators', href: '/admin/dashboard?tab=club' },
          ],
        },
        {
          title: 'Exams',
          items: [
            { label: 'Seating Allocation', href: '/admin/dashboard?tab=seating-alloc' },
            { label: 'Hall Tickets', href: '/admin/dashboard?tab=tickets' },
          ],
        },
      ];
    case 'student':
      return [
        {
          title: 'Academics',
          items: [
            { label: 'Dashboard', href: '/student/dashboard' },
            { label: 'Study Support', href: '/student/dashboard?tab=study' },
          ],
        },
        {
          title: 'Exams',
          items: [
            { label: 'Hall Ticket', href: '/student/dashboard?tab=ticket' },
            { label: 'Seating Info', href: '/student/dashboard?tab=seating' },
          ],
        },
      ];
    case 'seating_manager':
      return [
        {
          title: 'Allocation',
          items: [
            { label: 'Generate Seating', href: '/seating/dashboard' },
            { label: 'View Rooms', href: '/seating/dashboard?tab=rooms' },
          ],
        },
      ];
    case 'club_coordinator':
      return [
        {
          title: 'Events',
          items: [
            { label: 'Dashboard', href: '/club/dashboard' },
            { label: 'Manage Events', href: '/club/dashboard?tab=events' },
          ],
        },
      ];
    default:
      return [];
  }
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userRole }) => {
  const role = userRole;
  const navItems = getNavItems(role);

  return (
    <div className="w-full min-h-screen">
      {/* Floating Navigation Cards */}
      {navItems.length > 0 && <CardNav items={navItems} />}
      
      {/* Content Container - Padded so Nav doesn't overlap */}
      <div className="pt-96 px-6 pb-12 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
