import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { authenticator } from "~/services/auth.server";

// If the user lands on this page, we redirect back to / if they are already logged in.
export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

// This form would take us to the auth0 route, which would redirect to the Auth0 login page.

export default function Login() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-4 pt-6">
          <Form action="/auth/auth0" method="post">
            <Button variant="outline" className="w-full">
              Login with Auth0
            </Button>
          </Form>

          <Form action="/auth/google" method="post">
            <Button className="w-full">Login with Google</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
