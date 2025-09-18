import { prisma } from './db'

interface GrantEntitlementParams {
  email: string
  courseId: string
  source?: string
}

export async function grantEntitlement({
  email,
  courseId,
  source = 'woo'
}: GrantEntitlementParams) {
  try {
    // Verificar si ya existe entitlement activo
    const existing = await prisma.entitlement.findUnique({
      where: {
        email_courseId: {
          email,
          courseId
        }
      }
    })

    if (existing?.active) {
      console.log(`Entitlement ya existe y está activo: ${email} -> ${courseId}`)
      return existing
    }

    // Crear o reactivar entitlement
    const entitlement = await prisma.entitlement.upsert({
      where: {
        email_courseId: {
          email,
          courseId
        }
      },
      update: {
        active: true,
        source,
        grantedAt: new Date(),
        revokedAt: null,
      },
      create: {
        email,
        courseId,
        source,
        active: true,
      },
      include: {
        course: true
      }
    })

    console.log(`Entitlement concedido: ${email} -> ${entitlement.course.title}`)
    return entitlement
  } catch (error) {
    console.error(`Error concediendo entitlement: ${email} -> ${courseId}`, error)
    throw error
  }
}

export async function hasEntitlement(email: string, courseSlug: string): Promise<boolean> {
  try {
    const entitlement = await prisma.entitlement.findFirst({
      where: {
        email,
        active: true,
        course: {
          slug: courseSlug,
          isPublished: true
        }
      }
    })

    return !!entitlement
  } catch (error) {
    console.error(`Error verificando entitlement: ${email} -> ${courseSlug}`, error)
    return false
  }
}

export async function getUserEntitlements(email: string) {
  try {
    return await prisma.entitlement.findMany({
      where: {
        email,
        active: true,
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            heroUrl: true,
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    })
  } catch (error) {
    console.error(`Error obteniendo entitlements del usuario: ${email}`, error)
    return []
  }
}
