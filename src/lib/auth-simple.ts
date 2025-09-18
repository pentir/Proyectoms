import { currentUser } from '@clerk/nextjs/server'

export async function getSimpleUser() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return { email: null, name: null, error: 'No user from Clerk' }
    }

    const email = user.emailAddresses?.[0]?.emailAddress
    const name = user.firstName || user.username || 'Usuario'
    
    return { 
      email: email || null, 
      name, 
      clerkId: user.id,
      error: null 
    }
  } catch (error) {
    return { 
      email: null, 
      name: null, 
      error: error.message 
    }
  }
}
