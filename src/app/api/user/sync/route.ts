import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, name, clerkId } = await request.json()

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email, name },
      create: { email, name, clerkId }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error sincronizando usuario:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
