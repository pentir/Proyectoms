import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './db'

export async function getCurrentUser() {
  try {
    const user = await currentUser()
    console.log('Clerk user:', user) // Debug temporal
    
    if (!user) {
      console.log('No hay usuario de Clerk')
      return null
    }

    const email = user.emailAddresses[0]?.emailAddress
    console.log('Email extraído:', email) // Debug temporal
    
    if (!email) {
      console.log('No se pudo extraer email del usuario Clerk')
      return null
    }

    // Buscar o crear usuario en nuestra DB
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('Creando nuevo usuario en DB para:', email)
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.username || 'Usuario',
        }
      })
    }

    console.log('Usuario final:', dbUser) // Debug temporal
    return dbUser
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

export async function requireAuth() {
  const { userId } = auth()
  if (!userId) {
    throw new Error('No autorizado')
  }

  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  return user
}
