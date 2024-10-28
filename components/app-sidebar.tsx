'use client';

import {
  GalleryVerticalEnd,
  Grid,
  Settings2,
  ShoppingCart,
  User,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';

import { TeamSwitcher } from '@/components/team-switcher';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'Husna',
    email: 'husna@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Amdin-panel-AZ',
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Grid,
      isActive: true,
    },
    {
      title: 'Products',
      url: '#',
      icon: ShoppingCart,
      items: [
        {
          title: 'Product List',
          url: '/products/list',
        },
        {
          title: 'Categories',
          url: '/products/categories',
        },
      ],
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: User,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/settings/general',
        },
        {
          title: 'Team',
          url: '/settings/team',
        },
        {
          title: 'Billing',
          url: '/settings/billing',
        },
        {
          title: 'Limits',
          url: '/settings/limits',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
