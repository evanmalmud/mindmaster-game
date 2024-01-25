import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export function meta() {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return user;
}

export default function Index() {
  const user = useLoaderData();
  return (
    <div>
      <nav className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-500 w-full fixed top-0 left-0 px-5">
        <div
          className="w-full max-w-screen-lg mx-auto flex justify-between content-center py-3 ">
          <Link className="text-white text-3xl font-bold" to={"/"}>Plot Points</Link>
          <div className="flex flex-col md:flex-row items-center justify-between gap-x-4 text-blue-50">

            <h1>Welcome to Remix</h1>
            <h1>Logged in as ...</h1>

            <Link to={"login"}>Login</Link>
            <Link to={"login"}>Register</Link>
          </div>
        </div>

      </nav>
      <div className="grid lg:grid-flow-row grid-cols-1 lg:grid-cols-3">
        <figure className="m-4 py-10 px-4 shadow-md shadow-sky-100">
          <blockquote cite="https://wisdomman.com" className="py-3">
            <p className="text-gray-800  text-xl">
              A stitch in Time saves Nine.
            </p>
          </blockquote>
          <figcaption>
            <cite className="text-gray-600 text-md mb-4 text-right">
              - Unknown
            </cite>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}