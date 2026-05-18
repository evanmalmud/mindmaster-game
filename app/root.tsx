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
  return json({ ...prefs, origin: getPublicOrigin(request) });
}

function getPublicOrigin(request: Request): string {
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL.replace(/\/+$/, '');
  }
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const url = new URL(request.url);
  const proto = forwardedProto ?? url.protocol.replace(':', '');
  const host = forwardedHost ?? request.headers.get('host') ?? url.host;
  return `${proto}://${host}`;
}

export function meta({ data }: { data: { origin: string } | undefined }) {
  const origin = data?.origin ?? '';
  const gif = `${origin}/og-image.gif`;
  const png = `${origin}/og-image.png`;
  const title = 'MindMaster';
  const description = 'Break the code. A daily colour-guessing puzzle.';
  const imageAlt = 'MindMaster — break the code';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: gif },
    { property: 'og:image:type', content: 'image/gif' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '1200' },
    { property: 'og:image:alt', content: imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: png },
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
