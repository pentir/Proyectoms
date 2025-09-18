import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== GET /api/admin/cursos (SIN AUTH) ===')
    
    const cursos = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        },
        _count: {
          select: {
            modules: true,
            entitlements: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular contadores de lecciones
    const cursosConContadores = cursos.map(curso => ({
      ...curso,
      _count: {
        ...curso._count,
        lessons: curso.modules.reduce((total, modulo) => total + modulo.lessons.length, 0)
      }
    }))

    console.log('✅ Cursos encontrados:', cursosConContadores.length)
    return NextResponse.json(cursosConContadores)
  } catch (error) {
    console.error('❌ Error al obtener cursos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== POST /api/admin/cursos (SIN AUTH) ===')
    
    const body = await req.json()
    console.log('✅ Datos recibidos:', body)
    
    const { title, slug, description, heroUrl, productId, sku, isPublished } = body

    if (!title || !slug || !description) {
      console.log('❌ Faltan campos requeridos')
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    console.log('✅ Verificando slug único...')
    const existingCourse = await prisma.course.findUnique({
      where: { slug }
    })

    if (existingCourse) {
      console.log('❌ Slug ya en uso')
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      )
    }

    console.log('✅ Creando curso en base de datos...')
    const curso = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        heroUrl: heroUrl || null,
        productId: productId ? parseInt(productId) : null,
        sku: sku || null,
        isPublished: isPublished || false
      }
    })

    console.log('✅ Curso creado exitosamente:', curso)
    return NextResponse.json(curso, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
