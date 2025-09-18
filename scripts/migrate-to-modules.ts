import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateToModules() {
  try {
    console.log('Iniciando migración a módulos...')
    
    // Obtener todos los cursos con sus lecciones
    const cursos = await prisma.course.findMany({
      include: {
        lessons: true
      }
    })

    console.log(`Encontrados ${cursos.length} cursos`)

    for (const curso of cursos) {
      console.log(`Procesando curso: ${curso.title}`)
      
      if (curso.lessons.length > 0) {
        // Crear un módulo por defecto para cada curso que tenga lecciones
        const modulo = await prisma.module.create({
          data: {
            courseId: curso.id,
            title: 'Módulo 1',
            description: 'Módulo principal',
            order: 1,
            isPublished: true
          }
        })

        console.log(`Creado módulo: ${modulo.title} para curso ${curso.title}`)
        
        // Aquí moveríamos las lecciones, pero primero necesitamos modificar el esquema gradualmente
      }
    }

    console.log('Migración completada')
  } catch (error) {
    console.error('Error en migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateToModules()
