import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== GET lecciones (SIN AUTH) ===', params.id)

    const lecciones = await prisma.lesson.findMany({
      where: { courseId: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== POST lección (SIN AUTH) ===', params.id)

    const body = await req.json()
    console.log('✅ Datos de lección recibidos:', body)
    
    const { title, slug, description, videoUrl, isPublished } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Título y slug son requeridos' },
        { status: 400 }
      )
    }

    const curso = await prisma.course.findUnique({
      where: { id: params.id }
    })

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      )
    }

    const ultimaLeccion = await prisma.lesson.findFirst({
      where: { courseId: params.id },
      orderBy: { order: 'desc' }
    })

    const nuevoOrder = ultimaLeccion ? ultimaLeccion.order + 1 : 1

    const leccion = await prisma.lesson.create({
      data: {
        title,
        slug,
        courseId: params.id,
        order: nuevoOrder,
        bunnyPath: videoUrl || '', // Usar videoUrl como bunnyPath
        durationSec: 0, // Valor por defecto si es requerido
        isFreePreview: false // Valor por defecto si es requerido
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
