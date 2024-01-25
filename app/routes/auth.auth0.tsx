// app/routes/app/auth/auth0.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

// If user directly goes to this page, we redirect to login
export function loader() {
  return redirect("/login");
}

// Post request sent to this route would be handled by the authenticator and redirect you to the Auth0's login page.
export function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("auth0", request);
}
