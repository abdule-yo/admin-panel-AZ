'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Logout } from '@/lib/db/UserCrud';
import { User } from '@prisma/client';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOutIcon,
  LogOut as LogoutIcon,
  Sparkles,
} from 'lucide-react';
import { useTransition } from 'react';
import delay from 'delay';
import { redirect, useRouter } from 'next/navigation';

type NavUserType = {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
};

type NavUserTypeProps = {
  user: NavUserType;
};

export function NavUser({ user }: NavUserTypeProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = useTransition();

  const handleLogOut = () => {
    startTransition(async () => {
      try {
        const res = await Logout(user.email);

        if (res.status === 401) {
          toast({
            title: 'Error',
            description: res.message,
            variant: 'destructive',
          });
        }

        toast({
          title: 'Sadly You leaving',
          description: res.message,
          variant: 'default',
        });

        await delay(3000);
        router.push('/login');
      } catch (error) {
        toast({
          title: 'OOPs!! Something went wrong',
          description: 'Check your internet please and try again',
          variant: 'destructive',
        });
      }
    });
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
                <AvatarImage
                  src={
                    user?.avatar
                      ? user.avatar
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTizPVODquL9YnaosfI-jL8A8atNiky00_Maw&s'
                  }
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar ? user.avatar : ''}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
