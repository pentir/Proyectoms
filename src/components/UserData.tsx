'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface UserDataProps {
  onUserData: (userData: { email: string; name: string; clerkId: string } | null) => void
}

export function UserData({ onUserData }: UserDataProps) {
  const { user, isLoaded } = useUser()
  const [hasReported, setHasReported] = useState(false)

  useEffect(() => {
    if (isLoaded && !hasReported) {
      if (user) {
        const userData = {
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || user.username || 'Usuario',
          clerkId: user.id
        }
        onUserData(userData)
      } else {
        onUserData(null)
      }
      setHasReported(true)
    }
  }, [isLoaded, user, onUserData, hasReported])

  return null // Este componente no renderiza nada visible
}
