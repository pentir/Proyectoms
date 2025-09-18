import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    console.log('=== PUT editar módulo (SIN AUTH) ===', params.moduleId)

    const body = await req.json()
    console.log('✅ Datos de módulo recibidos:', body)
    
    const { title, description, isPublished } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Título es requerido' },
        { status: 400 }
      )
    }

    const modulo = await prisma.module.update({
      where: { id: params.moduleId },
      data: {
        title,
        description: description || null,
        isPublished: isPublished || false
      }
    })

    console.log('✅ Módulo actualizado exitosamente:', modulo.title)
    return NextResponse.json(modulo)
  } catch (error) {
    console.error('❌ Error al actualizar módulo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    console.log('=== DELETE módulo (SIN AUTH) ===', params.moduleId)
    
    // Verificar que el módulo existe y obtener datos necesarios
    const modulo = await prisma.module.findUnique({
      where: { id: params.moduleId },
      select: { 
        id: true, 
        title: true, 
        order: true, 
        courseId: true,
        lessons: true 
      }
    })
    
    if (!modulo) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 })
    }
    
    // Eliminar módulo (las lecciones se eliminan en cascada)
    await prisma.module.delete({
      where: { id: params.moduleId }
    })
    
    // Recalcular el orden de los módulos restantes
    await prisma.module.updateMany({
      where: { 
        courseId: modulo.courseId,
        order: { gt: modulo.order }
      },
      data: {
        order: { decrement: 1 }
      }
    })
    
    console.log('✅ Módulo eliminado y orden recalculado:', modulo.title)
    return NextResponse.json({ success: true, message: 'Módulo eliminado correctamente' })
  } catch (error) {
    console.error('❌ Error al eliminar módulo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}