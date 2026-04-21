import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export function loader() {
  return redirect("/");
}

export function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("google", request);
}
