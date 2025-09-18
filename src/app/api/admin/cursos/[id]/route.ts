import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== GET curso específico con módulos (SIN AUTH) ===', params.id)

    const curso = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!curso) {
      console.log('❌ Curso no encontrado:', params.id)
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    console.log('✅ Curso encontrado:', curso.title, 'con', curso.modules.length, 'módulos')
    return NextResponse.json(curso)
  } catch (error) {
    console.error('❌ Error al obtener curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
