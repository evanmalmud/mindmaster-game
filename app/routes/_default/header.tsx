import type { User } from '@prisma/client';
import { Form, Link } from '@remix-run/react';
import { Eye, Moon, Sun } from 'lucide-react';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button, buttonVariants } from '~/components/ui/button';
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
        <Link to="/" className="cursor-pointer">
          <h1 className="font-display cursor-pointer select-none text-lg uppercase md:text-2xl">
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
            <LoginMenu />
          )}
        </div>
      </div>
    </header>
  );
}

// Monochrome Google "G" — picks up currentColor so it matches button text.
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
    </svg>
  );
}

function LoginMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants())}>
        Login
      </DropdownMenuTrigger>
      {/* sideOffset clears the header's padding + bottom border so the panel
          reads as a separate surface beneath the chrome rather than crashing
          through the divider. Translucent background + backdrop-blur match
          the header's aesthetic. */}
      <DropdownMenuContent
        align="end"
        sideOffset={14}
        className="w-52 rounded-xl border-neutral-700 bg-background/95 p-3 shadow-lg backdrop-blur-sm"
      >
        <Form action="/api/auth/google" method="post">
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2"
          >
            <GoogleGlyph className="size-4" />
            Google
          </Button>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
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
