import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { ThemeProvider, parseThemePrefsFromCookie } from '~/lib/theme';
import styles from '~/tailwind.css';

export function links(): ReturnType<LinksFunction> {
  return [
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap',
    },
    { rel: 'stylesheet', href: styles },
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  ];
}

export function loader({ request }: LoaderFunctionArgs) {
  const prefs = parseThemePrefsFromCookie(request.headers.get('Cookie'));
  return json(prefs);
}

export default function App() {
  const { theme, colorblind } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground transition-colors duration-200">
        <ThemeProvider initialTheme={theme} initialColorblind={colorblind}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
