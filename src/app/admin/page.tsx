import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Video, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  // En producción estos datos vendrían de la base de datos
  const stats = {
    totalCursos: 5,
    totalUsuarios: 847,
    totalLecciones: 23,
    ingresosMes: '$12,450'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu plataforma de aprendizaje
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCursos}</div>
            <p className="text-xs text-muted-foreground">
              +2 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecciones</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLecciones}</div>
            <p className="text-xs text-muted-foreground">
              8 pendientes de revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ingresosMes}</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/admin/cursos/nuevo">
                <BookOpen className="h-4 w-4 mr-2" />
                Crear Nuevo Curso
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/lecciones/nueva">
                <Video className="h-4 w-4 mr-2" />
                Subir Nueva Lección
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/bunny">
                <TrendingUp className="h-4 w-4 mr-2" />
                Configurar Bunny CDN
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>
              Información técnica y configuración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Base de Datos</span>
                <span className="text-green-600 font-medium">Conectada</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bunny CDN</span>
                <span className="text-yellow-600 font-medium">Pendiente</span>
              </div>
              <div className="flex justify-between items-center">
                <span>WooCommerce</span>
                <span className="text-yellow-600 font-medium">Pendiente</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Clerk Auth</span>
                <span className="text-green-600 font-medium">Activo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Nuevo usuario registrado: alejandro@email.com</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Curso "JavaScript Avanzado" completado por usuario</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Nueva lección subida: "Conceptos de React"</p>
                <p className="text-xs text-gray-500">Ayer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
