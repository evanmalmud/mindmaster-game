import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { MenuIcon } from 'lucide-react';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer';
import { authenticator } from '~/services/auth.server';

type GoogleBook = {
  id: string;
  volumeInfo: {
    authors: string[];
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    title: string;
  };
};

type GoogleBookApiResponse = {
  items: GoogleBook[];
  kind: string;
  totalItems: number;
};

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const secrets = z
    .object({
      GOOGLE_API_KEY: z.string(),
    })
    .parse(process.env);

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=harry-potter&key=${secrets.GOOGLE_API_KEY}`,
  );

  if (!res.ok) {
    throw new Error('OOF');
  }

  const data = (await res.json()) as GoogleBookApiResponse;

  return { books: data.items, user };
}

export default function Index() {
  const { books, user } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="z-header border-theme-divider-tertiary bg-theme-bg-primary tablet:px-8 relative flex h-14 flex-row items-center justify-between gap-3 border-b px-4 py-3 sm:sticky sm:left-0 sm:top-0 sm:w-full sm:flex-row sm:px-4">
        <div className="lg:hidden">
          <Drawer direction="left">
            <DrawerTrigger>
              <MenuIcon />
            </DrawerTrigger>
            <DrawerContent className="fixed bottom-0 right-0 mt-24 flex h-full w-80 flex-col rounded-none">
              TODO
            </DrawerContent>
          </Drawer>
        </div>

        <Link className="font-bold" to="/">
          Plot Points
        </Link>

        <div className="flex items-center gap-x-4">
          <Link to="/logout">Logout</Link>
          <Avatar className="border border-neutral-50 bg-purple-400">
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-row lg:pl-60">
        <aside className="bg-theme-bg-primary border-theme-divider-tertiary group fixed left-0 top-0 hidden h-full flex-col border-r transition-[width,transform] duration-300 ease-in-out lg:top-14 lg:flex lg:h-[calc(100vh-theme(space.14))] lg:w-60  lg:-translate-x-0 "></aside>
        <div className="relative mx-auto grid max-w-xs flex-1 grid-cols-1 items-start gap-8 px-6 pb-16 pt-10 md:max-w-xl md:grid-cols-2 lg:max-w-full lg:grid-cols-3 lg:px-16 xl:grid-cols-4 ">
          {books.map((book) => {
            return (
              <Card key={book.id} className="h-full max-h-96">
                <CardContent className="pt-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      alt={book.volumeInfo.title}
                      src={book.volumeInfo.imageLinks.thumbnail}
                      className="z-1 h-40 w-full rounded-lg object-cover"
                    />
                  </div>
                  <CardTitle className="mt-4">
                    {book.volumeInfo.title}
                  </CardTitle>
                  <h5 className="mt-2 text-sm text-neutral-500">
                    {book.volumeInfo.authors[0]}
                  </h5>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
