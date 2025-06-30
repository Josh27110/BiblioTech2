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
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Search,
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  Eye,
  X,
  Trash2,
  AlertCircle,
  BookOpen,
  Timer,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data para reservas
const mockReservas = [
  {
    id: 1,
    libro: {
      id: 1,
      titulo: "El Código Da Vinci",
      autor: "Dan Brown",
      isbn: "978-84-376-0505-5",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaReserva: "2024-12-20",
    fechaExpiracion: "2025-01-20",
    posicionEnCola: 1,
    totalEnCola: 3,
    estado: "disponible",
    fechaDisponible: "2024-12-29",
    tiempoRestanteRecogida: 5, // días
    notificacionEnviada: true,
  },
  {
    id: 2,
    libro: {
      id: 2,
      titulo: "Dune",
      autor: "Frank Herbert",
      isbn: "978-84-376-0506-2",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaReserva: "2024-12-15",
    fechaExpiracion: "2025-01-15",
    posicionEnCola: 2,
    totalEnCola: 5,
    estado: "en_espera",
    fechaEstimada: "2025-01-10",
    personasDelante: 1,
  },
  {
    id: 3,
    libro: {
      id: 3,
      titulo: "1984",
      autor: "George Orwell",
      isbn: "978-84-376-0507-9",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaReserva: "2024-12-10",
    fechaExpiracion: "2025-01-10",
    posicionEnCola: 4,
    totalEnCola: 7,
    estado: "en_espera",
    fechaEstimada: "2025-01-25",
    personasDelante: 3,
  },
  {
    id: 4,
    libro: {
      id: 4,
      titulo: "Sapiens",
      autor: "Yuval Noah Harari",
      isbn: "978-84-376-0508-6",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaReserva: "2024-11-20",
    fechaExpiracion: "2024-12-20",
    posicionEnCola: 1,
    totalEnCola: 1,
    estado: "expirada",
    fechaExpiracionReal: "2024-12-20",
    motivoExpiracion: "No recogido a tiempo",
  },
  {
    id: 5,
    libro: {
      id: 5,
      titulo: "Atomic Habits",
      autor: "James Clear",
      isbn: "978-84-376-0509-3",
      imagen: "/placeholder.svg?height=80&width=60",
    },
    fechaReserva: "2024-12-01",
    fechaExpiracion: "2025-01-01",
    posicionEnCola: 1,
    totalEnCola: 1,
    estado: "completada",
    fechaRecogida: "2024-12-15",
    fechaPrestamo: "2024-12-15",
  },
]

export default function ReservasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReserva, setSelectedReserva] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("activas")
  const [isCanceling, setIsCanceling] = useState<number | null>(null)

  // Filtrar reservas
  const filteredReservas = mockReservas.filter((reserva) => {
    const matchesSearch =
      reserva.libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.libro.isbn.includes(searchTerm)

    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "activas" && ["disponible", "en_espera"].includes(reserva.estado)) ||
      (activeTab === "disponibles" && reserva.estado === "disponible") ||
      (activeTab === "historial" && ["completada", "expirada"].includes(reserva.estado))

    return matchesSearch && matchesTab
  })

  // Estadísticas
  const stats = {
    totalReservas: mockReservas.length,
    reservasActivas: mockReservas.filter((r) => ["disponible", "en_espera"].includes(r.estado)).length,
    disponiblesParaRecogida: mockReservas.filter((r) => r.estado === "disponible").length,
    enEspera: mockReservas.filter((r) => r.estado === "en_espera").length,
    completadas: mockReservas.filter((r) => r.estado === "completada").length,
    expiradas: mockReservas.filter((r) => r.estado === "expirada").length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getEstadoBadge = (estado: string, tiempoRestante?: number) => {
    switch (estado) {
      case "disponible":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Disponible para Recogida
          </Badge>
        )
      case "en_espera":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            En Lista de Espera
          </Badge>
        )
      case "completada":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completada
          </Badge>
        )
      case "expirada":
        return <Badge variant="destructive">Expirada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPrioridadColor = (posicion: number, total: number) => {
    const porcentaje = (posicion / total) * 100
    if (porcentaje <= 33) return "text-green-600"
    if (porcentaje <= 66) return "text-yellow-600"
    return "text-red-600"
  }

  const handleCancelarReserva = async (reservaId: number) => {
    setIsCanceling(reservaId)
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Reserva cancelada exitosamente")
    setIsCanceling(null)
  }

  const openModal = (reserva: any) => {
    setSelectedReserva(reserva)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedReserva(null)
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
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestionar Reservas</h1>
              <p className="text-muted-foreground">Administra tus reservas y consulta tu posición en las listas</p>
            </div>
          </div>
        </div>

        {/* Alertas importantes */}
        {stats.disponiblesParaRecogida > 0 && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>¡Libros disponibles!</strong> Tienes {stats.disponiblesParaRecogida} libro
              {stats.disponiblesParaRecogida > 1 ? "s" : ""} listo{stats.disponiblesParaRecogida > 1 ? "s" : ""} para
              recoger. Recógelo{stats.disponiblesParaRecogida > 1 ? "s" : ""} antes de que expire
              {stats.disponiblesParaRecogida > 1 ? "n" : ""} tu{stats.disponiblesParaRecogida > 1 ? "s" : ""} reserva
              {stats.disponiblesParaRecogida > 1 ? "s" : ""}.
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas Activas</p>
                  <p className="text-2xl font-bold">{stats.reservasActivas}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{stats.disponiblesParaRecogida}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En Espera</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.enEspera}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.completadas}</p>
                </div>
                <BookOpen className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Reservas
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

        {/* Tabs y Tabla de Reservas */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
            <CardDescription>Gestiona tus reservas activas y consulta tu historial</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activas">Activas ({stats.reservasActivas})</TabsTrigger>
                <TabsTrigger value="disponibles">Disponibles ({stats.disponiblesParaRecogida})</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="todas">Todas ({stats.totalReservas})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredReservas.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Libro</TableHead>
                          <TableHead>Fecha Reserva</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Posición en Cola</TableHead>
                          <TableHead>Fecha Estimada</TableHead>
                          <TableHead>Expira</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservas.map((reserva) => (
                          <TableRow key={reserva.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-16 relative flex-shrink-0">
                                  <Image
                                    src={reserva.libro.imagen || "/placeholder.svg"}
                                    alt={reserva.libro.titulo}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-2">{reserva.libro.titulo}</p>
                                  <p className="text-sm text-muted-foreground">{reserva.libro.autor}</p>
                                  <p className="text-xs text-muted-foreground">{reserva.libro.isbn}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(reserva.fechaReserva)}</TableCell>
                            <TableCell>{getEstadoBadge(reserva.estado, reserva.tiempoRestanteRecogida)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={getPrioridadColor(reserva.posicionEnCola, reserva.totalEnCola)}
                                  >
                                    {reserva.posicionEnCola} de {reserva.totalEnCola}
                                  </Badge>
                                </div>
                                {reserva.estado === "en_espera" && (
                                  <div className="w-full">
                                    <Progress
                                      value={
                                        ((reserva.totalEnCola - reserva.posicionEnCola) / reserva.totalEnCola) * 100
                                      }
                                      className="h-2"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {reserva.personasDelante} persona{reserva.personasDelante !== 1 ? "s" : ""}{" "}
                                      delante
                                    </p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {reserva.estado === "disponible" ? (
                                <div className="flex flex-col">
                                  <span className="text-green-600 font-medium">¡Disponible ahora!</span>
                                  <span className="text-xs text-muted-foreground">
                                    Desde: {formatDate(reserva.fechaDisponible!)}
                                  </span>
                                </div>
                              ) : reserva.estado === "en_espera" ? (
                                <div className="flex flex-col">
                                  <span>{formatDate(reserva.fechaEstimada!)}</span>
                                  <span className="text-xs text-muted-foreground">Estimado</span>
                                </div>
                              ) : reserva.estado === "completada" ? (
                                <div className="flex flex-col">
                                  <span className="text-green-600">Recogido</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reserva.fechaRecogida!)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {reserva.estado === "disponible" ? (
                                <div className="flex flex-col">
                                  <span className="text-orange-600 font-medium">
                                    {reserva.tiempoRestanteRecogida} días
                                  </span>
                                  <span className="text-xs text-muted-foreground">para recoger</span>
                                </div>
                              ) : reserva.estado === "expirada" ? (
                                <div className="flex flex-col">
                                  <span className="text-red-600">Expirada</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reserva.fechaExpiracionReal!)}
                                  </span>
                                </div>
                              ) : (
                                <span>{formatDate(reserva.fechaExpiracion)}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openModal(reserva)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {["disponible", "en_espera"].includes(reserva.estado) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancelarReserva(reserva.id)}
                                    disabled={isCanceling === reserva.id}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    {isCanceling === reserva.id ? (
                                      <Timer className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
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
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {activeTab === "activas"
                        ? "No tienes reservas activas"
                        : activeTab === "disponibles"
                          ? "No tienes libros disponibles para recoger"
                          : activeTab === "historial"
                            ? "No tienes historial de reservas"
                            : "No tienes reservas registradas"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No se encontraron reservas con ese término de búsqueda."
                        : activeTab === "activas"
                          ? "Explora nuestro catálogo para reservar libros que no estén disponibles."
                          : "Las reservas aparecerán aquí cuando las realices."}
                    </p>
                    {(activeTab === "activas" || activeTab === "disponibles") && (
                      <Button asChild>
                        <Link href="/catalogo">Explorar Catálogo</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalles de la Reserva */}
      {isModalOpen && selectedReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalles de la Reserva</h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Información del Libro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedReserva.libro.imagen || "/placeholder.svg"}
                      alt={selectedReserva.libro.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedReserva.libro.titulo}</h3>
                    <p className="text-muted-foreground mb-1">Por: {selectedReserva.libro.autor}</p>
                    <p className="text-sm text-muted-foreground">ISBN: {selectedReserva.libro.isbn}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getEstadoBadge(selectedReserva.estado, selectedReserva.tiempoRestanteRecogida)}
                  </div>

                  {/* Estado específico */}
                  {selectedReserva.estado === "disponible" && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <strong>¡Tu libro está listo!</strong> Tienes {selectedReserva.tiempoRestanteRecogida} días para
                        recogerlo antes de que expire la reserva.
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedReserva.estado === "en_espera" && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">Lista de Espera</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tu posición:</span>
                          <span className="font-medium">
                            {selectedReserva.posicionEnCola} de {selectedReserva.totalEnCola}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((selectedReserva.totalEnCola - selectedReserva.posicionEnCola) /
                              selectedReserva.totalEnCola) *
                            100
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {selectedReserva.personasDelante} persona{selectedReserva.personasDelante !== 1 ? "s" : ""}{" "}
                          delante de ti
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles de la Reserva */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de la Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID de la Reserva:</span>
                      <span className="font-medium">#{selectedReserva.id.toString().padStart(6, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Reserva:</span>
                      <span className="font-medium">{formatDate(selectedReserva.fechaReserva)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Expiración:</span>
                      <span className="font-medium">{formatDate(selectedReserva.fechaExpiracion)}</span>
                    </div>
                    {selectedReserva.fechaDisponible && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disponible desde:</span>
                        <span className="font-medium text-green-600">
                          {formatDate(selectedReserva.fechaDisponible)}
                        </span>
                      </div>
                    )}
                    {selectedReserva.fechaEstimada && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Estimada:</span>
                        <span className="font-medium">{formatDate(selectedReserva.fechaEstimada)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estado y Progreso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estado Actual:</span>
                      {getEstadoBadge(selectedReserva.estado, selectedReserva.tiempoRestanteRecogida)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posición en Cola:</span>
                      <Badge
                        variant="outline"
                        className={getPrioridadColor(selectedReserva.posicionEnCola, selectedReserva.totalEnCola)}
                      >
                        {selectedReserva.posicionEnCola} de {selectedReserva.totalEnCola}
                      </Badge>
                    </div>
                    {selectedReserva.notificacionEnviada && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Notificación:</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Enviada</span>
                        </div>
                      </div>
                    )}
                    {selectedReserva.tiempoRestanteRecogida && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo para Recoger:</span>
                        <span className="font-medium text-orange-600">
                          {selectedReserva.tiempoRestanteRecogida} días
                        </span>
                      </div>
                    )}

                    {/* Botón de cancelar para reservas activas */}
                    {["disponible", "en_espera"].includes(selectedReserva.estado) && (
                      <div className="pt-3">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            closeModal()
                            handleCancelarReserva(selectedReserva.id)
                          }}
                          disabled={isCanceling === selectedReserva.id}
                        >
                          {isCanceling === selectedReserva.id ? (
                            <>
                              <Timer className="h-4 w-4 mr-2 animate-spin" />
                              Cancelando...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancelar Reserva
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Información adicional según el estado */}
              {selectedReserva.estado === "expirada" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">Reserva Expirada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de Expiración:</span>
                        <span className="font-medium">{formatDate(selectedReserva.fechaExpiracionReal!)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Motivo:</span>
                        <span className="font-medium">{selectedReserva.motivoExpiracion}</span>
                      </div>
                    </div>
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Esta reserva expiró porque no fue recogida a tiempo. Puedes hacer una nueva reserva si el libro
                        sigue disponible.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {selectedReserva.estado === "completada" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">Reserva Completada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de Recogida:</span>
                        <span className="font-medium">{formatDate(selectedReserva.fechaRecogida!)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Préstamo Iniciado:</span>
                        <span className="font-medium">{formatDate(selectedReserva.fechaPrestamo!)}</span>
                      </div>
                    </div>
                    <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Reserva completada exitosamente. El libro fue recogido y el préstamo está activo.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Timeline de la reserva */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Cronología de la Reserva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Reserva Creada</p>
                        <p className="text-sm text-muted-foreground">{formatDate(selectedReserva.fechaReserva)}</p>
                      </div>
                    </div>

                    {selectedReserva.estado === "disponible" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Libro Disponible</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedReserva.fechaDisponible!)} - Notificación enviada
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedReserva.estado === "completada" && (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Libro Disponible</p>
                            <p className="text-sm text-muted-foreground">Notificación enviada</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Libro Recogido</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedReserva.fechaRecogida!)} - Préstamo iniciado
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedReserva.estado === "expirada" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Reserva Expirada</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedReserva.fechaExpiracionReal!)} - {selectedReserva.motivoExpiracion}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModal}>
                  Cerrar
                </Button>
                <Button asChild>
                  <Link href={`/libro/${selectedReserva.libro.id}`}>Ver Libro en Catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
