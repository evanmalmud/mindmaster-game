import type { LoaderFunction } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'

/*
We import the authenticator and based on the login state we redirect them to the
either success or failure redirect
*/

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request, {
    successRedirect: '/',
    failureRedirect: '/login'
  })
}
