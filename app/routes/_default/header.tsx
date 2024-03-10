import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/utils';

export type HeaderProps = {
  user?: Pick<User, 'name'> | null;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 border-b border-neutral-400">
      <div className="container flex items-center justify-between px-4 py-2 md:py-4">
        <Link to="/">
          <h1 className="font-display text-lg uppercase md:text-2xl">
            Mastermind
          </h1>
        </Link>

        {user ? (
          <UserAvatarMenu userInitial={user.name[0]} />
        ) : (
          <Link to="/login" className={cn(buttonVariants())}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

function UserAvatarMenu({ userInitial }: { userInitial: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback className="uppercase">{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link to="/logout">
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
