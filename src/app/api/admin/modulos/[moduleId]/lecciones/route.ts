import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    console.log('=== GET lecciones del módulo (SIN AUTH) ===', params.moduleId)

    const lecciones = await prisma.lesson.findMany({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'asc' }
    })

    console.log('✅ Lecciones encontradas:', lecciones.length)
    return NextResponse.json(lecciones)
  } catch (error) {
    console.error('❌ Error al obtener lecciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    console.log('=== POST lección al módulo (SIN AUTH) ===', params.moduleId)

    const body = await req.json()
    console.log('✅ Datos de lección recibidos:', body)
    
    const { title, slug, videoUrl, isFreePreview } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Título y slug son requeridos' },
        { status: 400 }
      )
    }

    const modulo = await prisma.module.findUnique({
      where: { id: params.moduleId }
    })

    if (!modulo) {
      return NextResponse.json(
        { error: 'Módulo no encontrado' },
        { status: 404 }
      )
    }

    const ultimaLeccion = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'desc' }
    })

    const nuevoOrder = ultimaLeccion ? ultimaLeccion.order + 1 : 1

    const leccion = await prisma.lesson.create({
      data: {
        title,
        slug,
        moduleId: params.moduleId,
        order: nuevoOrder,
        bunnyPath: videoUrl || '',
        durationSec: 0,
        isFreePreview: isFreePreview || false
      }
    })

    console.log('✅ Lección creada exitosamente:', leccion.title)
    return NextResponse.json(leccion, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear lección:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
