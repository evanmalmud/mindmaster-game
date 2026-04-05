import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';
import { Eye, Moon, Sun } from 'lucide-react';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useTheme } from '~/lib/theme';
import { cn } from '~/utils';

export type HeaderProps = {
  user?: Pick<User, 'name'> | null;
};

export function Header({ user }: HeaderProps) {
  const { theme, colorblind, toggleTheme, toggleColorblind } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-400 bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between px-4 py-2 md:py-4">
        <Link to="/">
          <h1 className="font-display text-lg uppercase md:text-2xl">
            MindMaster
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Colorblind toggle */}
          <button
            type="button"
            onClick={toggleColorblind}
            className={cn(
              'rounded-full p-2 transition-colors hover:bg-accent hover:text-accent-foreground',
              colorblind ? 'text-code-green' : 'text-muted-foreground',
            )}
            aria-label={`${colorblind ? 'Disable' : 'Enable'} colorblind mode`}
          >
            <Eye size={18} />
          </button>

          {user ? (
            <UserAvatarMenu userInitial={user.name[0]} />
          ) : (
            <Link to="/login" className={cn(buttonVariants())}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function UserAvatarMenu({ userInitial }: { userInitial: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-sm uppercase">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to="/stats">
          <DropdownMenuItem>Stats</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/logout">
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
