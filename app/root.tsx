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
    { rel: 'alternate icon', href: '/favicon.ico', type: 'image/x-icon' },
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
  const url = new URL(request.url);
  return json({ ...prefs, origin: url.origin });
}

export function meta({ data }: { data: { origin: string } | undefined }) {
  const origin = data?.origin ?? '';
  const image = `${origin}/og-image.gif`;
  const title = 'MindMaster';
  const description = 'Break the code. A daily colour-guessing puzzle.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'MindMaster — break the code' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];
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
