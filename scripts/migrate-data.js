const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Iniciando migración de lecciones a módulos...')
    
    // Obtener todos los cursos con sus lecciones
    const cursos = await prisma.course.findMany({
      include: {
        lessons: {
          where: {
            moduleId: null // Solo lecciones que no tienen módulo asignado
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    console.log(`Encontrados ${cursos.length} cursos`)

    for (const curso of cursos) {
      console.log(`\nProcesando curso: ${curso.title}`)
      
      if (curso.lessons.length > 0) {
        // Crear un módulo por defecto para cada curso que tenga lecciones
        const modulo = await prisma.module.create({
          data: {
            courseId: curso.id,
            title: 'Módulo 1',
            description: 'Contenido principal del curso',
            order: 1,
            isPublished: true
          }
        })

        console.log(`  ✓ Creado módulo: "${modulo.title}" para curso "${curso.title}"`)
        
        // Mover todas las lecciones del curso a este módulo
        for (const leccion of curso.lessons) {
          await prisma.lesson.update({
            where: { id: leccion.id },
            data: { 
              moduleId: modulo.id,
              courseId: null // Quitar la relación directa con el curso
            }
          })
          console.log(`    - Movida lección: "${leccion.title}" al módulo`)
        }
        
        console.log(`  ✓ ${curso.lessons.length} lecciones migradas`)
      } else {
        console.log(`  - Sin lecciones para migrar`)
      }
    }

    console.log('\n✅ Migración completada exitosamente')
  } catch (error) {
    console.error('❌ Error en migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()
