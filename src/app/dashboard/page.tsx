'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react'
import Link from 'next/link'

// Datos mock para demostrar funcionalidad
const mockEntitlements = [
  {
    id: '1',
    course: {
      id: 'curso-1',
      slug: 'curso-demo',
      title: 'Curso Demo - Introducción al LMS',
      description: 'Un curso completo para aprender los fundamentos del sistema LMS con videos premium y seguimiento de progreso.',
      heroUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    },
    active: true,
    grantedAt: new Date('2024-09-15'),
    progress: 45 // porcentaje completado
  },
  {
    id: '2', 
    course: {
      id: 'curso-2',
      slug: 'javascript-avanzado',
      title: 'JavaScript Avanzado para Desarrolladores',
      description: 'Domina conceptos avanzados de JavaScript incluyendo closures, promises, async/await y más.',
      heroUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'
    },
    active: true,
    grantedAt: new Date('2024-09-10'),
    progress: 78
  }
]

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [showMockData, setShowMockData] = useState(true)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const entitlements = showMockData ? mockEntitlements : []
  const totalWatchTime = showMockData ? '12h 30m' : '0h 0m'
  const completedCourses = showMockData ? 1 : 0
  const currentStreak = showMockData ? 7 : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Demo Toggle */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900">Modo Demo Activo</p>
            <p className="text-blue-800 text-sm">Sistema funcionando con datos de ejemplo. En producción se conectaría con WooCommerce.</p>
          </div>
          <Button 
            variant={showMockData ? "default" : "outline"}
            onClick={() => setShowMockData(!showMockData)}
          >
            {showMockData ? "Ver Sin Datos" : "Ver Demo"}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
        <p><strong>Usuario Conectado:</strong></p>
        <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
        <p>Nombre: {user?.firstName || 'Usuario'}</p>
        <p>ID: {user?.id}</p>
      </div>

      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continúa tu viaje de aprendizaje donde lo dejaste.
          </p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entitlements.length}</div>
            <p className="text-xs text-gray-600">Cursos disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWatchTime}</div>
            <p className="text-xs text-gray-600">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-gray-600">Certificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} días</div>
            <p className="text-xs text-gray-600">
              {currentStreak > 0 ? 'Sigue así!' : 'Comienza hoy'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Cursos</CardTitle>
          <CardDescription>
            Cursos a los que tienes acceso actualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entitlements.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes cursos activos
              </h3>
              <p className="text-gray-600 mb-4">
                Una vez que compres un curso en WooCommerce, aparecerá aquí automáticamente.
              </p>
              <Button onClick={() => setShowMockData(true)}>
                Ver Demo con Datos
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {entitlements.map((entitlement) => (
                <div key={entitlement.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{entitlement.course.title}</h4>
                      <p className="text-gray-600 mb-4">{entitlement.course.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>Acceso desde: {entitlement.grantedAt.toLocaleDateString('es-ES')}</span>
                        <span>Progreso: {entitlement.progress}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${entitlement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {entitlement.course.heroUrl && (
                        <img 
                          src={entitlement.course.heroUrl} 
                          alt={entitlement.course.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Continuar Curso
                    </Button>
                    <Button variant="outline">
                      Ver Progreso
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
