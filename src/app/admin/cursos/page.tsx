'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Eye, Edit, Trash2, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Curso {
  id: string
  title: string
  slug: string
  description: string
  heroUrl?: string
  isPublished: boolean
  createdAt: string
  _count: {
    lessons: number
    entitlements: number
  }
}

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCursos()
  }, [])

  const fetchCursos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/cursos')
      
      if (!response.ok) {
        throw new Error('Error al cargar cursos')
      }
      
      const data = await response.json()
      setCursos(data)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar los cursos')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
            <p className="text-gray-600 mt-2">Administra todos los cursos de la plataforma</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando cursos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
            <p className="text-gray-600 mt-2">Administra todos los cursos de la plataforma</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchCursos} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-2">
            Administra todos los cursos de la plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Curso
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
          <CardDescription>
            {cursos.length} curso{cursos.length !== 1 ? 's' : ''} en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cursos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay cursos creados aún</p>
              <Button asChild>
                <Link href="/admin/cursos/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear tu primer curso
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cursos.map((curso) => (
                <div 
                  key={curso.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{curso.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        curso.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {curso.isPublished ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{curso.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{curso._count.lessons} lecciones</span>
                      <span>{curso._count.entitlements} estudiantes</span>
                      <span>Creado: {new Date(curso.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild title="Ver curso">
                      <Link href={`/dashboard/curso/${curso.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild title="Gestionar lecciones">
                      <Link href={`/admin/cursos/${curso.id}/lecciones`}>
                        <Upload className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild title="Editar curso">
                      <Link href={`/admin/cursos/${curso.id}/editar`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" title="Eliminar curso">
                      <Trash2 className="h-4 w-4" />
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
