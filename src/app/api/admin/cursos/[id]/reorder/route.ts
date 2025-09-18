import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== PUT reordenar elementos (SIN AUTH) ===', params.id)

    const body = await req.json()
    console.log('✅ Datos de reordenamiento recibidos:', body)
    
    const { type, items } = body

    if (type === 'modules') {
      // Reordenar módulos
      const updates = items.map((item: any, index: number) => 
        prisma.module.update({
          where: { id: item.id },
          data: { order: index + 1 }
        })
      )
      
      await prisma.$transaction(updates)
      console.log('✅ Módulos reordenados exitosamente')
      
    } else if (type === 'lessons') {
      // Reordenar lecciones dentro de un módulo
      const { moduleId } = body
      
      const updates = items.map((item: any, index: number) => 
        prisma.lesson.update({
          where: { id: item.id },
          data: { order: index + 1 }
        })
      )
      
      await prisma.$transaction(updates)
      console.log('✅ Lecciones reordenadas exitosamente')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error al reordenar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
