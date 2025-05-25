'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return <button onClick={() => signIn('google')}>Sign in with Google</button>
}