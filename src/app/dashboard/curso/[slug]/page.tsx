'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Lock, CheckCircle, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'

const mockCourseData = {
  'curso-demo': {
    id: 'curso-demo',
    title: 'Curso Demo - Introducción al LMS',
    lessons: [
      {
        id: '1',
        slug: 'introduccion', 
        title: 'Lección 1: Introducción',
        duration: 300,
        order: 1,
        completed: true
      },
      {
        id: '2',
        slug: 'conceptos',
        title: 'Lección 2: Conceptos Básicos', 
        duration: 600,
        order: 2,
        completed: false
      }
    ]
  }
}

export default function CoursePage() {
  const params = useParams()
  const courseSlug = params.slug as string
  const course = mockCourseData[courseSlug]

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h1>Curso no encontrado</h1>
        <Link href="/dashboard">
          <Button>Volver</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>
      
      <div className="p-6">
        <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-6">
          <div className="text-center text-white">
            <Play className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-xl">Reproductor Mock</h2>
            <p>En producción mostraría video de Bunny CDN</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Este es el curso demo funcionando correctamente.</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Lecciones</CardTitle>
              </CardHeader>
              <CardContent>
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center space-x-2 mb-2">
                    <CheckCircle className={`h-4 w-4 ${lesson.completed ? 'text-green-600' : 'text-gray-300'}`} />
                    <span className="text-sm">{lesson.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
