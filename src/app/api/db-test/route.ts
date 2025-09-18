import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('Probando conexión a base de datos...')
    
    const count = await prisma.course.count()
    console.log('Número de cursos en DB:', count)
    
    return NextResponse.json({ 
      message: 'Conexión a DB exitosa', 
      courseCount: count 
    })
  } catch (error) {
    console.error('Error conectando a DB:', error)
    return NextResponse.json(
      { error: 'Error de base de datos', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
