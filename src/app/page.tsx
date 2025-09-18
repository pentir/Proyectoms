import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Play, Users, Award } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">MiCuba LMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Aprende sin límites con 
            <span className="text-primary block">MiCuba LMS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Accede a cursos exclusivos con contenido de video premium. 
            Tu progreso se sincroniza automáticamente y puedes continuar donde dejaste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Comenzar Gratis
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                <Play className="h-4 w-4 mr-2" />
                Ver Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Play className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Videos Premium</CardTitle>
              <CardDescription>
                Contenido de video de alta calidad servido desde CDN global para una experiencia fluida.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Progreso Sincronizado</CardTitle>
              <CardDescription>
                Tu progreso se guarda automáticamente. Continúa donde dejaste desde cualquier dispositivo.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Certificaciones</CardTitle>
              <CardDescription>
                Obtén certificados al completar los cursos y demuestra tus nuevas habilidades.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
