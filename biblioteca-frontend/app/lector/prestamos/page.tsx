"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  Search,
  ArrowLeft,
  RefreshCw,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Eye,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data para préstamos activos
const mockPrestamosActivos = [
  {
    id: 1,
    libro: {
      id: 1,
      titulo: "El Arte de la Guerra",
      autor: "Sun Tzu",
      isbn: "978-84-376-0500-0",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-12-01",
    fechaVencimiento: "2025-01-01",
    diasRestantes: 3,
    renovacionesUsadas: 0,
    renovacionesMaximas: 2,
    puedeRenovar: true,
    estado: "activo",
    ubicacion: "Sección A - Estante 20",
  },
  {
    id: 2,
    libro: {
      id: 2,
      titulo: "Sapiens: De animales a dioses",
      autor: "Yuval Noah Harari",
      isbn: "978-84-376-0501-7",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-11-15",
    fechaVencimiento: "2024-12-30",
    diasRestantes: 1,
    renovacionesUsadas: 1,
    renovacionesMaximas: 2,
    puedeRenovar: true,
    estado: "por_vencer",
    ubicacion: "Sección B - Estante 5",
  },
  {
    id: 3,
    libro: {
      id: 3,
      titulo: "Atomic Habits",
      autor: "James Clear",
      isbn: "978-84-376-0502-4",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaPrestamo: "2024-11-10",
    fechaVencimiento: "2024-12-28",
    diasRestantes: -1,
    renovacionesUsadas: 2,
    renovacionesMaximas: 2,
    puedeRenovar: false,
    estado: "vencido",
    ubicacion: "Sección C - Estante 12",
    multaAcumulada: 5.0,
  },
]

export default function PrestamosActivosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRenewing, setIsRenewing] = useState<number | null>(null)

  // Filtrar préstamos
  const filteredPrestamos = mockPrestamosActivos.filter(
    (prestamo) =>
      prestamo.libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.libro.isbn.includes(searchTerm),
  )

  // Estadísticas
  const stats = {
    totalActivos: mockPrestamosActivos.length,
    porVencer: mockPrestamosActivos.filter((p) => p.estado === "por_vencer").length,
    vencidos: mockPrestamosActivos.filter((p) => p.estado === "vencido").length,
    multasAcumuladas: mockPrestamosActivos.reduce((sum, p) => sum + (p.multaAcumulada || 0), 0),
  }

  const getEstadoBadge = (estado: string, diasRestantes: number) => {
    switch (estado) {
      case "activo":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Activo ({diasRestantes} días)
          </Badge>
        )
      case "por_vencer":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Por Vencer ({diasRestantes} día{diasRestantes !== 1 ? "s" : ""})
          </Badge>
        )
      case "vencido":
        return (
          <Badge variant="destructive">
            Vencido ({Math.abs(diasRestantes)} día{Math.abs(diasRestantes) !== 1 ? "s" : ""})
          </Badge>
        )
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

  const handleRenovar = async (prestamoId: number) => {
    setIsRenewing(prestamoId)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("Préstamo renovado exitosamente. Nueva fecha de vencimiento: 29 de Enero, 2025")
    setIsRenewing(null)
  }

  const openModal = (prestamo: any) => {
    setSelectedPrestamo(prestamo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedPrestamo(null)
    setIsModalOpen(false)
  }

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
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Préstamos Activos</h1>
              <p className="text-muted-foreground">Gestiona tus préstamos actuales y renovaciones</p>
            </div>
          </div>
        </div>

        {/* Alertas importantes */}
        {stats.vencidos > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Atención!</strong> Tienes {stats.vencidos} préstamo{stats.vencidos > 1 ? "s" : ""} vencido
              {stats.vencidos > 1 ? "s" : ""}. Devuélvelo{stats.vencidos > 1 ? "s" : ""} lo antes posible para evitar
              multas adicionales.
            </AlertDescription>
          </Alert>
        )}

        {stats.porVencer > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <strong>Recordatorio:</strong> Tienes {stats.porVencer} préstamo{stats.porVencer > 1 ? "s" : ""} que vence
              {stats.porVencer > 1 ? "n" : ""} pronto. Considera renovar{stats.porVencer > 1 ? "los" : "lo"} o devolver
              {stats.porVencer > 1 ? "los" : "lo"} a tiempo.
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Préstamos Activos</p>
                  <p className="text-2xl font-bold">{stats.totalActivos}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Por Vencer</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.porVencer}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Multas Acumuladas</p>
                  <p className="text-2xl font-bold text-orange-600">${stats.multasAcumuladas.toFixed(2)}</p>
                </div>
                <div className="text-orange-500 text-2xl font-bold">$</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Préstamos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título, autor o ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Préstamos Activos */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Préstamos Activos</CardTitle>
            <CardDescription>
              Mostrando {filteredPrestamos.length} préstamo{filteredPrestamos.length !== 1 ? "s" : ""} activo
              {filteredPrestamos.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPrestamos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Libro</TableHead>
                      <TableHead>Fecha Préstamo</TableHead>
                      <TableHead>Fecha Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Renovaciones</TableHead>
                      <TableHead>Multa</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrestamos.map((prestamo) => (
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
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDate(prestamo.fechaVencimiento)}</span>
                            {prestamo.estado === "vencido" && (
                              <span className="text-xs text-red-600">
                                Vencido hace {Math.abs(prestamo.diasRestantes)} día
                                {Math.abs(prestamo.diasRestantes) !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(prestamo.estado, prestamo.diasRestantes)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="outline">
                              {prestamo.renovacionesUsadas}/{prestamo.renovacionesMaximas}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">
                              {prestamo.renovacionesMaximas - prestamo.renovacionesUsadas} disponible
                              {prestamo.renovacionesMaximas - prestamo.renovacionesUsadas !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {prestamo.multaAcumulada && prestamo.multaAcumulada > 0 ? (
                            <span className="text-red-600 font-medium">${prestamo.multaAcumulada.toFixed(2)}</span>
                          ) : (
                            <span className="text-green-600">$0.00</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openModal(prestamo)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {prestamo.puedeRenovar ? (
                              <Button
                                size="sm"
                                onClick={() => handleRenovar(prestamo.id)}
                                disabled={isRenewing === prestamo.id}
                              >
                                {isRenewing === prestamo.id ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Renovando...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Renovar
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                Sin renovaciones
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">¡No tienes préstamos activos!</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No se encontraron préstamos con ese término de búsqueda."
                    : "Explora nuestro catálogo para encontrar tu próximo libro."}
                </p>
                <Button asChild>
                  <Link href="/catalogo">Explorar Catálogo</Link>
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
                <h2 className="text-2xl font-bold">Detalles del Préstamo Activo</h2>
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
                    {getEstadoBadge(selectedPrestamo.estado, selectedPrestamo.diasRestantes)}
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Ubicación en Biblioteca:</p>
                    <p className="text-sm text-muted-foreground">{selectedPrestamo.ubicacion}</p>
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
                      <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                      <span className={`font-medium ${selectedPrestamo.estado === "vencido" ? "text-red-600" : ""}`}>
                        {formatDate(selectedPrestamo.fechaVencimiento)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Días Restantes:</span>
                      <span
                        className={`font-medium ${
                          selectedPrestamo.diasRestantes < 0
                            ? "text-red-600"
                            : selectedPrestamo.diasRestantes <= 3
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {selectedPrestamo.diasRestantes < 0
                          ? `Vencido (${Math.abs(selectedPrestamo.diasRestantes)} días)`
                          : `${selectedPrestamo.diasRestantes} días`}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Renovaciones y Multas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renovaciones Usadas:</span>
                      <Badge variant="outline">
                        {selectedPrestamo.renovacionesUsadas}/{selectedPrestamo.renovacionesMaximas}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renovaciones Disponibles:</span>
                      <span className="font-medium">
                        {selectedPrestamo.renovacionesMaximas - selectedPrestamo.renovacionesUsadas}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Multa Acumulada:</span>
                      <span
                        className={`font-medium ${
                          selectedPrestamo.multaAcumulada && selectedPrestamo.multaAcumulada > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ${(selectedPrestamo.multaAcumulada || 0).toFixed(2)}
                      </span>
                    </div>

                    {selectedPrestamo.puedeRenovar ? (
                      <div className="pt-3">
                        <Button
                          className="w-full"
                          onClick={() => handleRenovar(selectedPrestamo.id)}
                          disabled={isRenewing === selectedPrestamo.id}
                        >
                          {isRenewing === selectedPrestamo.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Renovando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Renovar Préstamo
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          No puedes renovar este préstamo. Has alcanzado el límite de renovaciones.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Información adicional */}
              {selectedPrestamo.estado === "vencido" && (
                <Alert variant="destructive" className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Préstamo Vencido:</strong> Este libro debe ser devuelto inmediatamente. Se están aplicando
                    multas de $5.00 por día de retraso.
                  </AlertDescription>
                </Alert>
              )}

              {selectedPrestamo.estado === "por_vencer" && (
                <Alert className="mt-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>Próximo a Vencer:</strong> Este préstamo vence en {selectedPrestamo.diasRestantes} día
                    {selectedPrestamo.diasRestantes !== 1 ? "s" : ""}. Considera renovarlo o devolverlo a tiempo.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModal}>
                  Cerrar
                </Button>
                <Button asChild>
                  <Link href={`/libro/${selectedPrestamo.libro.id}`}>Ver Libro en Catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
