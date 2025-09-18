import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== GET módulos (SIN AUTH) ===', params.id)

    const modulos = await prisma.module.findMany({
      where: { courseId: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    console.log('✅ Módulos encontrados:', modulos.length)
    return NextResponse.json(modulos)
  } catch (error) {
    console.error('❌ Error al obtener módulos:', error)
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
    console.log('=== POST módulo (SIN AUTH) ===', params.id)

    const body = await req.json()
    console.log('✅ Datos de módulo recibidos:', body)
    
    const { title, description, isPublished } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Título es requerido' },
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

    const ultimoModulo = await prisma.module.findFirst({
      where: { courseId: params.id },
      orderBy: { order: 'desc' }
    })

    const nuevoOrder = ultimoModulo ? ultimoModulo.order + 1 : 1

    const modulo = await prisma.module.create({
      data: {
        title,
        description: description || null,
        courseId: params.id,
        order: nuevoOrder,
        isPublished: isPublished || false
      }
    })

    console.log('✅ Módulo creado exitosamente:', modulo.title)
    return NextResponse.json(modulo, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear módulo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
