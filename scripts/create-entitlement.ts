import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('Por favor proporciona un email: pnpm tsx scripts/create-entitlement.ts tu@email.com')
    process.exit(1)
  }

  // Buscar el curso demo
  const course = await prisma.course.findUnique({
    where: { slug: 'curso-demo' }
  })

  if (!course) {
    console.error('Curso demo no encontrado')
    process.exit(1)
  }

  // Crear entitlement
  const entitlement = await prisma.entitlement.upsert({
    where: {
      email_courseId: {
        email: email,
        courseId: course.id
      }
    },
    update: {
      active: true,
      source: 'manual',
      grantedAt: new Date(),
      revokedAt: null
    },
    create: {
      email: email,
      courseId: course.id,
      source: 'manual',
      active: true
    }
  })

  console.log(`✅ Entitlement creado para ${email}`)
  console.log(`📚 Curso: ${course.title}`)
  console.log(`🔑 ID: ${entitlement.id}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
