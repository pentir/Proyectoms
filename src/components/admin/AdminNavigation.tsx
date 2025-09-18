'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, Settings, Users, BarChart3, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Panel', href: '/admin', icon: BarChart3 },
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpen },
  { name: 'Lecciones', href: '/admin/lecciones', icon: Upload },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-primary">
              MiCuba LMS - Admin
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ver como Usuario
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
