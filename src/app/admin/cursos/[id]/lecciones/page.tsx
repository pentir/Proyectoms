'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Edit, Trash2, Play, ChevronDown, ChevronRight, Loader2, GripVertical, Save, Check } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Leccion {
  id: string
  title: string
  slug: string
  bunnyPath: string
  durationSec?: number
  order: number
  isFreePreview: boolean
  createdAt: string
}

interface Modulo {
  id: string
  title: string
  description?: string
  order: number
  isPublished: boolean
  lessons: Leccion[]
}

interface Curso {
  id: string
  title: string
  slug: string
  modules: Modulo[]
}

function SortableModuleItem({ 
  modulo, 
  children, 
  toggleModule, 
  setShowLessonForm 
}: { 
  modulo: Modulo
  children?: React.ReactNode
  toggleModule: (id: string) => void
  setShowLessonForm: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: modulo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleModule(modulo.id)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-lg">
                  Módulo {modulo.order}: {modulo.title}
                </CardTitle>
                <CardDescription>
                  {modulo.lessons.length} lecciones
                  {modulo.description && ` • ${modulo.description}`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLessonForm(modulo.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Lección
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {children}
      </Card>
    </div>
  )
}

function SortableLessonItem({ leccion, children }: { leccion: Leccion, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: leccion.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <div
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
        >
          <GripVertical className="h-3 w-3 text-gray-400" />
        </div>
        {children}
      </div>
    </div>
  )
}

export default function GestionCursoPage() {
  const params = useParams()
  const cursoId = params.id as string
  
  const [curso, setCurso] = useState<Curso | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isReordering, setIsReordering] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [pendingModuleChanges, setPendingModuleChanges] = useState<Modulo[] | null>(null)
  const [pendingLessonChanges, setPendingLessonChanges] = useState<{moduleId: string, lessons: Leccion[]} | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (cursoId) {
      fetchCurso()
    }
  }, [cursoId])

  // Auto-ocultar el estado "saved" después de 3 segundos
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  const fetchCurso = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/admin/cursos/${cursoId}`)
      if (!response.ok) {
        throw new Error('Error al cargar curso')
      }
      
      const data = await response.json()
      setCurso(data)
      
      // Expandir todos los módulos por defecto
      const moduleIds = new Set(data.modules.map((m: Modulo) => m.id))
      setExpandedModules(moduleIds)
      
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCurso((curso) => {
        if (!curso) return curso

        const oldIndex = curso.modules.findIndex((m) => m.id === active.id)
        const newIndex = curso.modules.findIndex((m) => m.id === over?.id)

        const newModules = arrayMove(curso.modules, oldIndex, newIndex)
        
        setPendingModuleChanges(newModules)
        setHasUnsavedChanges(true)
        setSaveStatus('idle')
        
        return { ...curso, modules: newModules }
      })
    }
  }

  const handleLessonDragEnd = (event: DragEndEvent, moduleId: string) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCurso((curso) => {
        if (!curso) return curso

        const moduleIndex = curso.modules.findIndex(m => m.id === moduleId)
        const module = curso.modules[moduleIndex]
        
        const oldIndex = module.lessons.findIndex((l) => l.id === active.id)
        const newIndex = module.lessons.findIndex((l) => l.id === over?.id)

        const newLessons = arrayMove(module.lessons, oldIndex, newIndex)
        
        setPendingLessonChanges({ moduleId, lessons: newLessons })
        setHasUnsavedChanges(true)
        setSaveStatus('idle')
        
        const newModules = [...curso.modules]
        newModules[moduleIndex] = { ...module, lessons: newLessons }
        
        return { ...curso, modules: newModules }
      })
    }
  }

  const saveChanges = async () => {
    setIsReordering(true)
    setSaveStatus('saving')
    
    try {
      if (pendingModuleChanges) {
        await fetch(`/api/admin/cursos/${cursoId}/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'modules',
            items: pendingModuleChanges.map((m, index) => ({ id: m.id, order: index + 1 }))
          })
        })
      }

      if (pendingLessonChanges) {
        await fetch(`/api/admin/cursos/${cursoId}/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lessons',
            moduleId: pendingLessonChanges.moduleId,
            items: pendingLessonChanges.lessons.map((l, index) => ({ id: l.id, order: index + 1 }))
          })
        })
      }

      // Simular un pequeño delay para mostrar el feedback
      await new Promise(resolve => setTimeout(resolve, 500))

      setHasUnsavedChanges(false)
      setPendingModuleChanges(null)
      setPendingLessonChanges(null)
      setSaveStatus('saved')
      
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      setSaveStatus('error')
    } finally {
      setIsReordering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando curso...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchCurso} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalLecciones = curso?.modules.reduce((total, modulo) => total + modulo.lessons.length, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cursos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Cursos
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión: {curso?.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {curso?.modules.length} módulos • {totalLecciones} lecciones
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Arrastra los elementos para reordenar
          {hasUnsavedChanges && (
            <span className="ml-2 text-orange-600 font-medium">
              • Cambios sin guardar
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="ml-2 text-green-600 font-medium flex items-center">
              <Check className="h-3 w-3 mr-1" />
              • Cambios guardados
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {hasUnsavedChanges && (
            <Button 
              onClick={saveChanges} 
              disabled={isReordering}
              className={saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          )}
          <Button onClick={() => setShowModuleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Módulo
          </Button>
        </div>
      </div>

      {/* Notificación flotante de éxito */}
      {saveStatus === 'saved' && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-in slide-in-from-right-4 fade-in-0 duration-300">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Orden guardado correctamente
              </p>
              <p className="text-xs text-green-700">
                Los cambios se han aplicado a la base de datos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de error */}
      {saveStatus === 'error' && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-red-800">
              Error al guardar cambios
            </div>
          </div>
        </div>
      )}

      {showModuleForm && (
        <FormularioModulo 
          cursoId={cursoId}
          onSuccess={() => {
            setShowModuleForm(false)
            fetchCurso()
          }}
          onCancel={() => setShowModuleForm(false)}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleModuleDragEnd}
      >
        <SortableContext items={curso?.modules.map(m => m.id) || []} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {curso?.modules.map((modulo) => (
              <SortableModuleItem 
                key={modulo.id} 
                modulo={modulo}
                toggleModule={toggleModule}
                setShowLessonForm={setShowLessonForm}
              >
                {expandedModules.has(modulo.id) && (
                  <CardContent className="pt-0">
                    {showLessonForm === modulo.id && (
                      <div className="mb-4">
                        <FormularioLeccion 
                          moduleId={modulo.id}
                          onSuccess={() => {
                            setShowLessonForm(null)
                            fetchCurso()
                          }}
                          onCancel={() => setShowLessonForm(null)}
                        />
                      </div>
                    )}

                    {modulo.lessons.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No hay lecciones en este módulo</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowLessonForm(modulo.id)}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar primera lección
                        </Button>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleLessonDragEnd(event, modulo.id)}
                      >
                        <SortableContext items={modulo.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {modulo.lessons.map((leccion) => (
                              <SortableLessonItem key={leccion.id} leccion={leccion}>
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                  {leccion.order}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{leccion.title}</h4>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {leccion.bunnyPath && (
                                      <span className="flex items-center">
                                        <Play className="h-3 w-3 mr-1" />
                                        Video
                                      </span>
                                    )}
                                    {leccion.isFreePreview && (
                                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                        Vista previa
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </SortableLessonItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </CardContent>
                )}
              </SortableModuleItem>
            )) || (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">No hay módulos creados aún</p>
                  <Button onClick={() => setShowModuleForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primer módulo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function FormularioModulo({ 
  cursoId, 
  onSuccess, 
  onCancel 
}: { 
  cursoId: string
  onSuccess: () => void
  onCancel: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/admin/cursos/${cursoId}/modulos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear módulo')
      }

      onSuccess()
      
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al crear módulo')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Módulo</CardTitle>
        <CardDescription>
          Crea un nuevo módulo para organizar las lecciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Módulo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Fundamentos de React"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del módulo..."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublishedModule"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="isPublishedModule" className="text-sm font-medium text-gray-700">
              Publicar módulo inmediatamente
            </label>
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Módulo'
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FormularioLeccion({ 
  moduleId, 
  onSuccess, 
  onCancel 
}: { 
  moduleId: string
  onSuccess: () => void
  onCancel: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    videoUrl: '',
    isFreePreview: false
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/admin/modulos/${moduleId}/lecciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear lección')
      }

      onSuccess()
      
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al crear lección')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Lección</CardTitle>
        <CardDescription>
          Agrega una nueva lección a este módulo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Lección *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: ¿Qué es React?"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="que-es-react"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Video
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/video.mp4"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFreePreviewLesson"
              checked={formData.isFreePreview}
              onChange={(e) => setFormData(prev => ({ ...prev, isFreePreview: e.target.checked }))}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="isFreePreviewLesson" className="text-sm font-medium text-gray-700">
              Vista previa gratuita
            </label>
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Lección'
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
