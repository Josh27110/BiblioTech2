"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  User,
  Building,
  Hash,
  Clock,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data para los libros
const mockLibros = {
  1: {
    id: 1,
    titulo: "El Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    isbn: "978-84-376-0494-7",
    editorial: "Editorial Planeta",
    año: 1605,
    genero: "Clásico",
    idioma: "Español",
    paginas: 863,
    imagen: "/placeholder.svg?height=400&width=300",
    sinopsis:
      "La historia del ingenioso hidalgo Don Quijote de la Mancha es una de las obras más importantes de la literatura universal. Narra las aventuras de Alonso Quixano, un hidalgo pobre que de tanto leer novelas de caballerías acaba enloqueciendo y creyendo ser un caballero andante, tomando el nombre de Don Quijote de la Mancha.",
    disponible: true,
    copiasDisponibles: 3,
    copiasTotales: 5,
    calificacion: 4.8,
    numeroReseñas: 245,
    ubicacion: "Sección A - Estante 15",
    fechaAdquisicion: "2020-03-15",
    estado: "Excelente",
  },
  2: {
    id: 2,
    titulo: "Cien Años de Soledad",
    autor: "Gabriel García Márquez",
    isbn: "978-84-376-0495-4",
    editorial: "Editorial Sudamericana",
    año: 1967,
    genero: "Realismo Mágico",
    idioma: "Español",
    paginas: 471,
    imagen: "/placeholder.svg?height=400&width=300",
    sinopsis:
      "Cien años de soledad es una novela del escritor colombiano Gabriel García Márquez, ganador del Premio Nobel de Literatura en 1982. Es considerada una obra maestra de la literatura hispanoamericana y universal, así como una de las obras más traducidas y leídas en español.",
    disponible: true,
    copiasDisponibles: 2,
    copiasTotales: 4,
    calificacion: 4.9,
    numeroReseñas: 189,
    ubicacion: "Sección B - Estante 8",
    fechaAdquisicion: "2019-11-20",
    estado: "Muy Bueno",
  },
  3: {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    isbn: "978-84-376-0496-1",
    editorial: "Debolsillo",
    año: 1949,
    genero: "Distopía",
    idioma: "Español",
    paginas: 326,
    imagen: "/placeholder.svg?height=400&width=300",
    sinopsis:
      "1984 es una novela política de ficción distópica, escrita por George Orwell entre 1947 y 1948 y publicada el 8 de junio de 1949. La novela popularizó los conceptos del omnipresente y vigilante Gran Hermano o Hermano Mayor, de la notoria habitación 101, de la ubicua policía del Pensamiento y de la neolengua.",
    disponible: false,
    copiasDisponibles: 0,
    copiasTotales: 3,
    calificacion: 4.7,
    numeroReseñas: 312,
    ubicacion: "Sección C - Estante 12",
    fechaAdquisicion: "2021-01-10",
    estado: "Bueno",
  },
}

export default function LibroDetailPage() {
  const params = useParams()
  const libroId = Number.parseInt(params.id as string)
  const libro = mockLibros[libroId as keyof typeof mockLibros]
  const [isFavorite, setIsFavorite] = useState(false)

  if (!libro) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Libro no encontrado</h1>
            <p className="text-muted-foreground mb-4">El libro que buscas no existe o ha sido eliminado.</p>
            <Button asChild>
              <Link href="/catalogo">Volver al Catálogo</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleSolicitar = () => {
    if (libro.disponible) {
      alert("Préstamo solicitado correctamente. Recibirás una confirmación por email.")
    } else {
      alert("Libro reservado correctamente. Te notificaremos cuando esté disponible.")
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header con navegación */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/catalogo">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{libro.titulo}</h1>
            <p className="text-muted-foreground">Por {libro.autor}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Imagen y acciones */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] relative mb-6 rounded-lg overflow-hidden bg-muted">
                  <Image src={libro.imagen || "/placeholder.svg"} alt={libro.titulo} fill className="object-cover" />
                </div>

                {/* Estado de disponibilidad */}
                <div className="mb-6">
                  {libro.disponible ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <strong>Disponible</strong> - {libro.copiasDisponibles} de {libro.copiasTotales} copias
                        disponibles
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>No disponible</strong> - Todas las copias están prestadas
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleSolicitar}>
                    {libro.disponible ? "Solicitar Préstamo" : "Reservar Libro"}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      {isFavorite ? "Favorito" : "Agregar"}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>

                {/* Calificación */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(libro.calificacion)}</div>
                    <span className="font-semibold">{libro.calificacion}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{libro.numeroReseñas} reseñas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Información detallada */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="descripcion" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="detalles">Detalles</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              </TabsList>

              <TabsContent value="descripcion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sinopsis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{libro.sinopsis}</p>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{libro.paginas}</div>
                        <div className="text-sm text-muted-foreground">Páginas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{libro.año}</div>
                        <div className="text-sm text-muted-foreground">Año</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{libro.calificacion}</div>
                        <div className="text-sm text-muted-foreground">Calificación</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{libro.copiasDisponibles}</div>
                        <div className="text-sm text-muted-foreground">Disponibles</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detalles" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Técnica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Autor</p>
                            <p className="text-muted-foreground">{libro.autor}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Editorial</p>
                            <p className="text-muted-foreground">{libro.editorial}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Hash className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">ISBN</p>
                            <p className="text-muted-foreground">{libro.isbn}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Año de Publicación</p>
                            <p className="text-muted-foreground">{libro.año}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Género</p>
                            <Badge variant="secondary">{libro.genero}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 text-muted-foreground">🌐</div>
                          <div>
                            <p className="font-medium">Idioma</p>
                            <p className="text-muted-foreground">{libro.idioma}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 text-muted-foreground">📄</div>
                          <div>
                            <p className="font-medium">Páginas</p>
                            <p className="text-muted-foreground">{libro.paginas}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 text-muted-foreground">📚</div>
                          <div>
                            <p className="font-medium">Estado</p>
                            <Badge variant="outline">{libro.estado}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ubicacion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ubicación en la Biblioteca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">{libro.ubicacion}</p>
                          <p className="text-muted-foreground">Ubicación física del libro</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Disponibilidad</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Copias totales:</span>
                              <span className="font-medium">{libro.copiasTotales}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Copias disponibles:</span>
                              <span
                                className={`font-medium ${libro.copiasDisponibles > 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {libro.copiasDisponibles}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Copias prestadas:</span>
                              <span className="font-medium">{libro.copiasTotales - libro.copiasDisponibles}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Información Adicional</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Fecha de adquisición:</span>
                              <span className="font-medium">
                                {new Date(libro.fechaAdquisicion).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estado físico:</span>
                              <Badge variant="outline">{libro.estado}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!libro.disponible && (
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            Este libro no está disponible actualmente. Puedes reservarlo y te notificaremos cuando esté
                            disponible.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
