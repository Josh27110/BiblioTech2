"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, Search, Download, Eye, Calendar, BookOpen, ArrowLeft, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

// Mock data para el historial de préstamos
const mockHistorial = [
  {
    id: 1,
    libro: {
      titulo: "El Quijote de la Mancha",
      autor: "Miguel de Cervantes",
      isbn: "978-84-376-0494-7",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-01-15",
    fechaDevolucion: "2024-02-15",
    fechaDevolucionReal: "2024-02-14",
    estado: "devuelto",
    diasRetraso: 0,
    multa: 0,
    renovaciones: 1,
  },
  {
    id: 2,
    libro: {
      titulo: "Cien Años de Soledad",
      autor: "Gabriel García Márquez",
      isbn: "978-84-376-0495-4",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-02-01",
    fechaDevolucion: "2024-03-01",
    fechaDevolucionReal: "2024-03-05",
    estado: "devuelto_con_retraso",
    diasRetraso: 4,
    multa: 20.0,
    renovaciones: 0,
  },
  {
    id: 3,
    libro: {
      titulo: "1984",
      autor: "George Orwell",
      isbn: "978-84-376-0496-1",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-03-10",
    fechaDevolucion: "2024-04-10",
    fechaDevolucionReal: "2024-04-08",
    estado: "devuelto",
    diasRetraso: 0,
    multa: 0,
    renovaciones: 2,
  },
  {
    id: 4,
    libro: {
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      isbn: "978-84-376-0497-8",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-04-15",
    fechaDevolucion: "2024-05-15",
    fechaDevolucionReal: "2024-05-15",
    estado: "devuelto",
    diasRetraso: 0,
    multa: 0,
    renovaciones: 0,
  },
  {
    id: 5,
    libro: {
      titulo: "Orgullo y Prejuicio",
      autor: "Jane Austen",
      isbn: "978-84-376-0498-5",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-05-20",
    fechaDevolucion: "2024-06-20",
    fechaDevolucionReal: "2024-06-25",
    estado: "devuelto_con_retraso",
    diasRetraso: 5,
    multa: 25.0,
    renovaciones: 1,
  },
  {
    id: 6,
    libro: {
      titulo: "El Señor de los Anillos",
      autor: "J.R.R. Tolkien",
      isbn: "978-84-376-0499-2",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-07-01",
    fechaDevolucion: "2024-08-01",
    fechaDevolucionReal: "2024-07-30",
    estado: "devuelto",
    diasRetraso: 0,
    multa: 0,
    renovaciones: 0,
  },
]

export default function HistorialPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("todos")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar historial
  const filteredHistorial = mockHistorial.filter((prestamo) => {
    const matchesSearch =
      prestamo.libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.libro.isbn.includes(searchTerm)

    const matchesEstado = estadoFilter === "todos" || prestamo.estado === estadoFilter

    const matchesFecha =
      (!fechaDesde || prestamo.fechaPrestamo >= fechaDesde) && (!fechaHasta || prestamo.fechaPrestamo <= fechaHasta)

    return matchesSearch && matchesEstado && matchesFecha
  })

  // Paginación
  const totalPages = Math.ceil(filteredHistorial.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistorial = filteredHistorial.slice(startIndex, startIndex + itemsPerPage)

  // Estadísticas
  const stats = {
    totalPrestamos: mockHistorial.length,
    devueltosPuntuales: mockHistorial.filter((p) => p.estado === "devuelto").length,
    devueltosConRetraso: mockHistorial.filter((p) => p.estado === "devuelto_con_retraso").length,
    totalMultas: mockHistorial.reduce((sum, p) => sum + p.multa, 0),
  }

  const getEstadoBadge = (estado: string, diasRetraso: number) => {
    switch (estado) {
      case "devuelto":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Devuelto a Tiempo
          </Badge>
        )
      case "devuelto_con_retraso":
        return <Badge variant="destructive">Devuelto con Retraso ({diasRetraso} días)</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const openModal = (prestamo: any) => {
    setSelectedPrestamo(prestamo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedPrestamo(null)
    setIsModalOpen(false)
  }

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Estado del Préstamo</Label>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Estados</SelectItem>
            <SelectItem value="devuelto">Devuelto a Tiempo</SelectItem>
            <SelectItem value="devuelto_con_retraso">Devuelto con Retraso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fecha Desde</Label>
        <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Fecha Hasta</Label>
        <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSearchTerm("")
          setEstadoFilter("todos")
          setFechaDesde("")
          setFechaHasta("")
          setCurrentPage(1)
        }}
      >
        Limpiar Filtros
      </Button>
    </div>
  )

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lector/panel">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <History className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Historial de Préstamos</h1>
              <p className="text-muted-foreground">Revisa todos tus préstamos anteriores</p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Préstamos</p>
                  <p className="text-2xl font-bold">{stats.totalPrestamos}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Devueltos a Tiempo</p>
                  <p className="text-2xl font-bold text-green-600">{stats.devueltosPuntuales}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Con Retraso</p>
                  <p className="text-2xl font-bold text-red-600">{stats.devueltosConRetraso}</p>
                </div>
                <History className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Multas</p>
                  <p className="text-2xl font-bold text-orange-600">${stats.totalMultas.toFixed(2)}</p>
                </div>
                <div className="text-orange-500 text-2xl font-bold">$</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar y Filtrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título, autor o ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden bg-transparent">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" asChild>
                <Link href="#" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Link>
              </Button>
            </div>

            {/* Filtros Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              <FilterContent />
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Historial */}
        <Card>
          <CardHeader>
            <CardTitle>Historial Completo</CardTitle>
            <CardDescription>
              Mostrando {paginatedHistorial.length} de {filteredHistorial.length} préstamos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Libro</TableHead>
                    <TableHead>Fecha Préstamo</TableHead>
                    <TableHead>Fecha Devolución</TableHead>
                    <TableHead>Devuelto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Renovaciones</TableHead>
                    <TableHead>Multa</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistorial.map((prestamo) => (
                    <TableRow key={prestamo.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 relative flex-shrink-0">
                            <Image
                              src={prestamo.libro.imagen || "/placeholder.svg"}
                              alt={prestamo.libro.titulo}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-2">{prestamo.libro.titulo}</p>
                            <p className="text-sm text-muted-foreground">{prestamo.libro.autor}</p>
                            <p className="text-xs text-muted-foreground">{prestamo.libro.isbn}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(prestamo.fechaPrestamo)}</TableCell>
                      <TableCell>{formatDate(prestamo.fechaDevolucion)}</TableCell>
                      <TableCell>{formatDate(prestamo.fechaDevolucionReal)}</TableCell>
                      <TableCell>{getEstadoBadge(prestamo.estado, prestamo.diasRetraso)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{prestamo.renovaciones}</Badge>
                      </TableCell>
                      <TableCell>
                        {prestamo.multa > 0 ? (
                          <span className="text-red-600 font-medium">${prestamo.multa.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openModal(prestamo)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal de Detalles del Préstamo */}
      {isModalOpen && selectedPrestamo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalles del Préstamo</h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Información del Libro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedPrestamo.libro.imagen || "/placeholder.svg"}
                      alt={selectedPrestamo.libro.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedPrestamo.libro.titulo}</h3>
                    <p className="text-muted-foreground mb-1">Por: {selectedPrestamo.libro.autor}</p>
                    <p className="text-sm text-muted-foreground">ISBN: {selectedPrestamo.libro.isbn}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getEstadoBadge(selectedPrestamo.estado, selectedPrestamo.diasRetraso)}
                  </div>
                </div>
              </div>

              {/* Detalles del Préstamo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Préstamo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID del Préstamo:</span>
                      <span className="font-medium">#{selectedPrestamo.id.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Préstamo:</span>
                      <span className="font-medium">{formatDate(selectedPrestamo.fechaPrestamo)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha Límite:</span>
                      <span className="font-medium">{formatDate(selectedPrestamo.fechaDevolucion)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Devolución:</span>
                      <span className="font-medium">{formatDate(selectedPrestamo.fechaDevolucionReal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renovaciones:</span>
                      <Badge variant="outline">{selectedPrestamo.renovaciones}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estado y Multas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estado:</span>
                      {getEstadoBadge(selectedPrestamo.estado, selectedPrestamo.diasRetraso)}
                    </div>
                    {selectedPrestamo.diasRetraso > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Días de Retraso:</span>
                        <span className="font-medium text-red-600">{selectedPrestamo.diasRetraso} días</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Multa Aplicada:</span>
                      <span className={`font-medium ${selectedPrestamo.multa > 0 ? "text-red-600" : "text-green-600"}`}>
                        ${selectedPrestamo.multa.toFixed(2)}
                      </span>
                    </div>
                    {selectedPrestamo.multa > 0 && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>Nota:</strong> Esta multa fue aplicada por devolución tardía. Tarifa: $5.00 por día de
                          retraso.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timeline del Préstamo */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Cronología del Préstamo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Préstamo Iniciado</p>
                        <p className="text-sm text-muted-foreground">{formatDate(selectedPrestamo.fechaPrestamo)}</p>
                      </div>
                    </div>

                    {selectedPrestamo.renovaciones > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Renovaciones Realizadas</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPrestamo.renovaciones} renovación{selectedPrestamo.renovaciones > 1 ? "es" : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedPrestamo.estado === "devuelto" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">Libro Devuelto</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedPrestamo.fechaDevolucionReal)}
                          {selectedPrestamo.diasRetraso > 0 && (
                            <span className="text-red-600 ml-2">({selectedPrestamo.diasRetraso} días tarde)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModal}>
                  Cerrar
                </Button>
                <Button asChild>
                  <Link href={`/libro/${selectedPrestamo.id}`}>Ver Libro en Catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
