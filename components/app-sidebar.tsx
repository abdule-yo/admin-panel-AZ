'use client';

import {
  CookingPot,
  GalleryVerticalEnd,
  Grid,
  Settings2,
  ShoppingCart,
  User as UserIcon,
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

import { GetUser } from '@/lib/db/UserCrud';
import { User } from '@prisma/client';
import { NavUser } from './nav-user';

const data = {
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
          url: '/dashboard/products/list',
        },
        {
          title: 'Categories',
          url: '/dashboard/products/categories',
        },
      ],
    },
    {
      title: 'Customers',
      url: '/dashboard/customers',
      icon: UserIcon,
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
  const [userData, setUserData] = React.useState<User | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const data = await GetUser();

        setUserData(data);
      } catch (error) {
        console.log(error);
        throw new Error('Something went wrong');
      }
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {userData && (
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
