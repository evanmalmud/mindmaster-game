// app/routes/app/auth0/logout.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

// Here we use the logout function of the authenticator to logout the user and clear the Auth0 session.
export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.logout(request, {
    redirectTo: "/login",
  });
}
