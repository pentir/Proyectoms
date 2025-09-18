import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos')

  // Verificar si el curso ya existe
  let course = await prisma.course.findUnique({
    where: { slug: 'curso-demo' }
  })

  if (course) {
    console.log('📚 Curso demo ya existe, saltando creación')
  } else {
    // Crear curso de ejemplo
    course = await prisma.course.create({
      data: {
        slug: 'curso-demo',
        title: 'Curso Demo - Introducción al LMS',
        description: 'Un curso de ejemplo para probar el sistema de LMS',
        productId: '123',
        sku: 'CURSO-DEMO-001',
        heroUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        isPublished: true,
      }
    })
    console.log(`📚 Curso creado: ${course.title}`)
  }

  // Verificar lecciones existentes
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId: course.id }
  })

  if (existingLessons.length > 0) {
    console.log(`📖 ${existingLessons.length} lecciones ya existen, saltando creación`)
  } else {
    // Crear lecciones
    const lessons = await Promise.all([
      prisma.lesson.create({
        data: {
          courseId: course.id,
          slug: 'introduccion',
          title: 'Lección 1: Introducción',
          bunnyPath: 'videos/curso-demo/introduccion.mp4',
          durationSec: 300,
          order: 1,
          isFreePreview: true,
        }
      }),
      prisma.lesson.create({
        data: {
          courseId: course.id,
          slug: 'conceptos-basicos',
          title: 'Lección 2: Conceptos Básicos',
          bunnyPath: 'videos/curso-demo/conceptos-basicos.mp4',
          durationSec: 600,
          order: 2,
          isFreePreview: false,
        }
      }),
      prisma.lesson.create({
        data: {
          courseId: course.id,
          slug: 'practica',
          title: 'Lección 3: Práctica',
          bunnyPath: 'videos/curso-demo/practica.mp4',
          durationSec: 900,
          order: 3,
          isFreePreview: false,
        }
      })
    ])
    console.log(`📖 ${lessons.length} lecciones creadas`)
  }

  // Verificar mapeo de producto
  const existingMap = await prisma.productMap.findFirst({
    where: { courseId: course.id }
  })

  if (!existingMap) {
    await prisma.productMap.create({
      data: {
        productId: '123',
        sku: 'CURSO-DEMO-001',
        courseId: course.id,
      }
    })
    console.log('🔗 Mapeo de producto creado')
  } else {
    console.log('🔗 Mapeo de producto ya existe')
  }

  console.log('\n✅ Seed completado')
  console.log('🎯 Ve a /dashboard para ver tu area de usuario')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
