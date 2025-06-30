"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  Search,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Eye,
  X,
  DollarSign,
  Clock,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data para multas
const mockMultas = [
  {
    id: 1,
    libro: {
      id: 1,
      titulo: "Atomic Habits",
      autor: "James Clear",
      isbn: "978-84-376-0502-4",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    prestamoId: 3,
    fechaVencimiento: "2024-12-28",
    fechaDevolucion: "2024-12-30",
    diasRetraso: 2,
    montoMulta: 10.0,
    estado: "pendiente",
    fechaGeneracion: "2024-12-30",
    descripcion: "Multa por devolución tardía",
  },
  {
    id: 2,
    libro: {
      id: 2,
      titulo: "El Poder del Ahora",
      autor: "Eckhart Tolle",
      isbn: "978-84-376-0503-1",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    prestamoId: 5,
    fechaVencimiento: "2024-11-15",
    fechaDevolucion: "2024-11-20",
    diasRetraso: 5,
    montoMulta: 25.0,
    estado: "pendiente",
    fechaGeneracion: "2024-11-20",
    descripcion: "Multa por devolución tardía",
  },
  {
    id: 3,
    libro: {
      id: 3,
      titulo: "Sapiens",
      autor: "Yuval Noah Harari",
      isbn: "978-84-376-0504-8",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    prestamoId: 7,
    fechaVencimiento: "2024-10-01",
    fechaDevolucion: "2024-10-02",
    diasRetraso: 1,
    montoMulta: 5.0,
    estado: "pagada",
    fechaGeneracion: "2024-10-02",
    fechaPago: "2024-10-05",
    metodoPago: "Tarjeta de Crédito",
    descripcion: "Multa por devolución tardía",
  },
]

export default function MultasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMultas, setSelectedMultas] = useState<number[]>([])
  const [selectedMulta, setSelectedMulta] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [activeTab, setActiveTab] = useState("pendientes")

  // Filtrar multas
  const filteredMultas = mockMultas.filter((multa) => {
    const matchesSearch =
      multa.libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      multa.libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      multa.libro.isbn.includes(searchTerm)

    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "pendientes" && multa.estado === "pendiente") ||
      (activeTab === "pagadas" && multa.estado === "pagada")

    return matchesSearch && matchesTab
  })

  // Estadísticas
  const stats = {
    totalMultas: mockMultas.length,
    multasPendientes: mockMultas.filter((m) => m.estado === "pendiente").length,
    multasPagadas: mockMultas.filter((m) => m.estado === "pagada").length,
    montoPendiente: mockMultas.filter((m) => m.estado === "pendiente").reduce((sum, m) => sum + m.montoMulta, 0),
    montoPagado: mockMultas.filter((m) => m.estado === "pagada").reduce((sum, m) => sum + m.montoMulta, 0),
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="destructive">Pendiente</Badge>
      case "pagada":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Pagada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const handleSelectMulta = (multaId: number) => {
    setSelectedMultas((prev) => (prev.includes(multaId) ? prev.filter((id) => id !== multaId) : [...prev, multaId]))
  }

  const handleSelectAll = () => {
    const pendientesIds = filteredMultas.filter((m) => m.estado === "pendiente").map((m) => m.id)
    setSelectedMultas(selectedMultas.length === pendientesIds.length ? [] : pendientesIds)
  }

  const handlePagarSeleccionadas = async () => {
    if (selectedMultas.length === 0) return

    setIsPaying(true)
    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const montoTotal = mockMultas.filter((m) => selectedMultas.includes(m.id)).reduce((sum, m) => sum + m.montoMulta, 0)

    alert(`Pago procesado exitosamente. Total pagado: $${montoTotal.toFixed(2)}`)
    setSelectedMultas([])
    setIsPaying(false)
  }

  const openModal = (multa: any) => {
    setSelectedMulta(multa)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedMulta(null)
    setIsModalOpen(false)
  }

  const montoSeleccionado = mockMultas
    .filter((m) => selectedMultas.includes(m.id))
    .reduce((sum, m) => sum + m.montoMulta, 0)

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
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestionar Multas</h1>
              <p className="text-muted-foreground">Revisa y paga tus multas pendientes</p>
            </div>
          </div>
        </div>

        {/* Alerta de multas pendientes */}
        {stats.multasPendientes > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Atención!</strong> Tienes {stats.multasPendientes} multa{stats.multasPendientes > 1 ? "s" : ""}{" "}
              pendiente{stats.multasPendientes > 1 ? "s" : ""} por un total de ${stats.montoPendiente.toFixed(2)}. Paga
              tus multas para poder solicitar nuevos préstamos.
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Multas</p>
                  <p className="text-2xl font-bold">{stats.totalMultas}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Multas Pendientes</p>
                  <p className="text-2xl font-bold text-red-600">{stats.multasPendientes}</p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monto Pendiente</p>
                  <p className="text-2xl font-bold text-red-600">${stats.montoPendiente.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pagado</p>
                  <p className="text-2xl font-bold text-green-600">${stats.montoPagado.toFixed(2)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de pago rápido */}
        {stats.multasPendientes > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <CreditCard className="h-5 w-5" />
                Pago Rápido
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Selecciona las multas que deseas pagar y procesa el pago de forma segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <span className="font-medium">{selectedMultas.length}</span> multa
                    {selectedMultas.length !== 1 ? "s" : ""} seleccionada{selectedMultas.length !== 1 ? "s" : ""}
                  </div>
                  {selectedMultas.length > 0 && (
                    <div className="text-lg font-bold text-orange-800 dark:text-orange-200">
                      Total: ${montoSeleccionado.toFixed(2)}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handlePagarSeleccionadas}
                  disabled={selectedMultas.length === 0 || isPaying}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isPaying ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar Seleccionadas
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Multas
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

        {/* Tabs y Tabla de Multas */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Multas</CardTitle>
            <CardDescription>Gestiona tus multas pendientes y revisa tu historial de pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pendientes">Pendientes ({stats.multasPendientes})</TabsTrigger>
                <TabsTrigger value="pagadas">Pagadas ({stats.multasPagadas})</TabsTrigger>
                <TabsTrigger value="todas">Todas ({stats.totalMultas})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredMultas.length > 0 ? (
                  <div className="space-y-4">
                    {/* Controles de selección para multas pendientes */}
                    {activeTab === "pendientes" && stats.multasPendientes > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <Checkbox
                          checked={
                            selectedMultas.length === filteredMultas.filter((m) => m.estado === "pendiente").length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm font-medium">Seleccionar todas las multas pendientes</span>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {activeTab === "pendientes" && <TableHead className="w-12">Seleccionar</TableHead>}
                            <TableHead>Libro</TableHead>
                            <TableHead>Fecha Vencimiento</TableHead>
                            <TableHead>Días Retraso</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha Generación</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMultas.map((multa) => (
                            <TableRow key={multa.id}>
                              {activeTab === "pendientes" && (
                                <TableCell>
                                  {multa.estado === "pendiente" && (
                                    <Checkbox
                                      checked={selectedMultas.includes(multa.id)}
                                      onCheckedChange={() => handleSelectMulta(multa.id)}
                                    />
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-16 relative flex-shrink-0">
                                    <Image
                                      src={multa.libro.imagen || "/placeholder.svg"}
                                      alt={multa.libro.titulo}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium line-clamp-2">{multa.libro.titulo}</p>
                                    <p className="text-sm text-muted-foreground">{multa.libro.autor}</p>
                                    <p className="text-xs text-muted-foreground">{multa.libro.isbn}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(multa.fechaVencimiento)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-red-600">
                                  {multa.diasRetraso} día{multa.diasRetraso !== 1 ? "s" : ""}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-red-600">${multa.montoMulta.toFixed(2)}</span>
                              </TableCell>
                              <TableCell>{getEstadoBadge(multa.estado)}</TableCell>
                              <TableCell>{formatDate(multa.fechaGeneracion)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => openModal(multa)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {activeTab === "pendientes"
                        ? "¡No tienes multas pendientes!"
                        : activeTab === "pagadas"
                          ? "No tienes multas pagadas"
                          : "No tienes multas registradas"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === "pendientes"
                        ? "Mantén un buen historial devolviendo los libros a tiempo."
                        : searchTerm
                          ? "No se encontraron multas con ese término de búsqueda."
                          : "Las multas aparecerán aquí cuando se generen."}
                    </p>
                    {activeTab === "pendientes" && (
                      <Button asChild>
                        <Link href="/lector/prestamos">Ver Préstamos Activos</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalles de la Multa */}
      {isModalOpen && selectedMulta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalles de la Multa</h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Información del Libro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedMulta.libro.imagen || "/placeholder.svg"}
                      alt={selectedMulta.libro.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedMulta.libro.titulo}</h3>
                    <p className="text-muted-foreground mb-1">Por: {selectedMulta.libro.autor}</p>
                    <p className="text-sm text-muted-foreground">ISBN: {selectedMulta.libro.isbn}</p>
                  </div>

                  <div className="flex items-center gap-2">{getEstadoBadge(selectedMulta.estado)}</div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-200">Multa por Retraso</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">{selectedMulta.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de la Multa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de la Multa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID de la Multa:</span>
                      <span className="font-medium">#{selectedMulta.id.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID del Préstamo:</span>
                      <span className="font-medium">#{selectedMulta.prestamoId.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                      <span className="font-medium">{formatDate(selectedMulta.fechaVencimiento)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Devolución:</span>
                      <span className="font-medium">{formatDate(selectedMulta.fechaDevolucion)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Días de Retraso:</span>
                      <Badge variant="outline" className="text-red-600">
                        {selectedMulta.diasRetraso} día{selectedMulta.diasRetraso !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto de la Multa:</span>
                      <span className="font-bold text-red-600 text-lg">${selectedMulta.montoMulta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      {getEstadoBadge(selectedMulta.estado)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Generación:</span>
                      <span className="font-medium">{formatDate(selectedMulta.fechaGeneracion)}</span>
                    </div>
                    {selectedMulta.fechaPago && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha de Pago:</span>
                          <span className="font-medium">{formatDate(selectedMulta.fechaPago)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Método de Pago:</span>
                          <span className="font-medium">{selectedMulta.metodoPago}</span>
                        </div>
                      </>
                    )}

                    {selectedMulta.estado === "pendiente" && (
                      <div className="pt-3">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedMultas([selectedMulta.id])
                            closeModal()
                            handlePagarSeleccionadas()
                          }}
                          disabled={isPaying}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagar Esta Multa
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Información adicional */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Cálculo de la Multa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tarifa por día de retraso:</span>
                      <span className="font-medium">$5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Días de retraso:</span>
                      <span className="font-medium">{selectedMulta.diasRetraso}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-medium">Total de la multa:</span>
                      <span className="font-bold text-lg">${selectedMulta.montoMulta.toFixed(2)}</span>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> Las multas deben pagarse antes de poder solicitar nuevos préstamos.
                      El pago se puede realizar en línea o en la biblioteca.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModal}>
                  Cerrar
                </Button>
                <Button asChild>
                  <Link href={`/libro/${selectedMulta.libro.id}`}>Ver Libro en Catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
