export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  console.log("Token from cookies:", token)

  if (!token) {
    console.error("No token found, redirecting to login")
    return redirect('/login')
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    console.log("Decoded token:", decodedToken)
    console.log('Expiration Time:', new Date(decodedToken.exp * 1000))

    const currentTime = Math.floor(Date.now() / 1000)
    if (decodedToken.exp < currentTime) {
      console.log('Token has expired.')
      return redirect('/login')
    }

  } catch (err) {
    console.error("Token verification failed:", err.message)
    return redirect('/login')
  }

  return <>{children}</>
}