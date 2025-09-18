const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Crear usuario en la tabla User
  const user = await prisma.user.upsert({
    where: { email: 'alexanderdualpe@gmail.com' },
    update: {},
    create: {
      email: 'alexanderdualpe@gmail.com',
      name: 'Alexander',
      clerkId: 'temp_clerk_id' // Lo actualizaremos después
    }
  })

  console.log('Usuario creado:', user)
}

main().then(() => prisma.$disconnect()).catch(console.error)
