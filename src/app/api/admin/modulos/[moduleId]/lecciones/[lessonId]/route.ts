import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { moduleId: string, lessonId: string } }
) {
  try {
    console.log('=== PUT editar lección (SIN AUTH) ===', params.lessonId)
    const body = await req.json()
    console.log('✅ Datos de lección recibidos:', body)
    
   const { title, slug, isFreePreview, videoUrl, content, materialsUrl } = body
    if (!title) {
      return NextResponse.json(
        { error: 'Título es requerido' },
        { status: 400 }
      )
    }

    const leccion = await prisma.lesson.update({
  where: { id: params.lessonId },
  data: {
    title,
    slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
    isFreePreview: isFreePreview || false,
    bunnyPath: videoUrl || '',
    content: content || '',
    materialsUrl: materialsUrl || ''
  }
})

    console.log('✅ Lección actualizada exitosamente:', leccion.title)
    return NextResponse.json(leccion)
  } catch (error) {
    console.error('❌ Error al actualizar lección:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { moduleId: string, lessonId: string } }
) {
  try {
    console.log('=== DELETE lección (SIN AUTH) ===', params.lessonId)
    
    const leccion = await prisma.lesson.findUnique({
      where: { id: params.lessonId }
    })
    
    if (!leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 })
    }
    
    await prisma.lesson.delete({
      where: { id: params.lessonId }
    })
    
    console.log('✅ Lección eliminada exitosamente:', leccion.title)
    return NextResponse.json({ success: true, message: 'Lección eliminada correctamente' })
  } catch (error) {
    console.error('❌ Error al eliminar lección:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
