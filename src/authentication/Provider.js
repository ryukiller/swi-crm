'use server'

import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

async function Provider({ children }) {
  const session = await auth()
  console.log('SESSION: ', session)
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Provider;