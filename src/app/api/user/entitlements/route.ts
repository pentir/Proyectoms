import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ entitlements: [] })
    }

    const entitlements = await prisma.entitlement.findMany({
      where: {
        email: user.email,
        active: true,
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            heroUrl: true,
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    })

    return NextResponse.json({ entitlements })
  } catch (error) {
    console.error('Error obteniendo entitlements:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
