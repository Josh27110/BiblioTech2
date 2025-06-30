"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BookOpen, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirigir usuarios autenticados a su panel correspondiente
      switch (user.role) {
        case "lector":
          router.push("/lector/panel")
          break
        case "bibliotecario":
          router.push("/bibliotecario/panel")
          break
        case "admin":
          router.push("/admin/panel")
          break
        default:
          break
      }
    }
  }, [user, isLoading, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Solo mostrar la página de inicio si no hay usuario autenticado
  if (user) {
    return null // La redirección se maneja en useEffect
  }

  const featuredBooks = [
    {
      id: 1,
      title: "El Quijote",
      author: "Miguel de Cervantes",
      image: "/placeholder.svg?height=200&width=150",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      image: "/placeholder.svg?height=200&width=150",
      rating: 4.9,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      image: "/placeholder.svg?height=200&width=150",
      rating: 4.7,
    },
    {
      id: 4,
      title: "El Principito",
      author: "Antoine de Saint-Exupéry",
      image: "/placeholder.svg?height=200&width=150",
      rating: 4.6,
    },
  ]

  const stats = [
    { icon: BookOpen, label: "Libros Disponibles", value: "15,000+" },
    { icon: Users, label: "Usuarios Activos", value: "2,500+" },
    { icon: Clock, label: "Préstamos Mensuales", value: "8,000+" },
    { icon: Star, label: "Calificación Promedio", value: "4.8/5" },
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a <span className="text-primary">BiblioTech</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre, reserva y gestiona tu biblioteca personal con nuestro sistema moderno e intuitivo.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Buscar libros, autores, géneros..." className="pl-10 h-12" />
              </div>
              <Button size="lg" asChild>
                <Link href="/catalogo">Buscar</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/catalogo">Explorar Catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/registro">Crear Cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Libros Destacados</h2>
            <p className="text-muted-foreground">Descubre nuestras recomendaciones más populares</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/catalogo">Ver Todos los Libros</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 opacity-90">Únete a nuestra comunidad de lectores y accede a miles de libros</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/registro">Registrarse Gratis</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  )
}
