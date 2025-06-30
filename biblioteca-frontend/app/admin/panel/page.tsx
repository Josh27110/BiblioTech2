"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  UserPlus,
  Shield,
  Mail,
  Phone,
  MapPin,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  Settings,
  UserCheck,
  Clock,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock data para usuarios
const mockUsuarios = [
  {
    id: 1,
    numeroUsuario: "USR-001234",
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    email: "juan.perez@email.com",
    telefono: "+52 55 1234 5678",
    direccion: "Av. Universidad 123, Col. Centro, CDMX",
    fechaNacimiento: "1990-05-15",
    genero: "masculino",
    rol: "lector",
    estado: "activo",
    fechaRegistro: "2023-03-15",
    ultimoAcceso: "2024-12-29 14:30",
    prestamosActivos: 2,
    prestamosHistoricos: 15,
    multasPendientes: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    numeroUsuario: "USR-001235",
    nombre: "María",
    apellidoPaterno: "González",
    apellidoMaterno: "López",
    email: "maria.gonzalez@email.com",
    telefono: "+52 55 2345 6789",
    direccion: "Calle Reforma 456, Col. Roma, CDMX",
    fechaNacimiento: "1985-08-22",
    genero: "femenino",
    rol: "bibliotecario",
    estado: "activo",
    fechaRegistro: "2022-11-08",
    ultimoAcceso: "2024-12-29 16:45",
    prestamosActivos: 0,
    prestamosHistoricos: 0,
    multasPendientes: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    numeroUsuario: "USR-001236",
    nombre: "Carlos",
    apellidoPaterno: "Rodríguez",
    apellidoMaterno: "Martín",
    email: "carlos.rodriguez@email.com",
    telefono: "+52 55 3456 7890",
    direccion: "Av. Insurgentes 789, Col. Condesa, CDMX",
    fechaNacimiento: "1978-12-03",
    genero: "masculino",
    rol: "admin",
    estado: "activo",
    fechaRegistro: "2022-01-10",
    ultimoAcceso: "2024-12-29 18:20",
    prestamosActivos: 0,
    prestamosHistoricos: 0,
    multasPendientes: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    numeroUsuario: "USR-001237",
    nombre: "Ana",
    apellidoPaterno: "Martínez",
    apellidoMaterno: "Sánchez",
    email: "ana.martinez@email.com",
    telefono: "+52 55 4567 8901",
    direccion: "Calle Madero 321, Col. Centro, CDMX",
    fechaNacimiento: "1992-07-18",
    genero: "femenino",
    rol: "lector",
    estado: "suspendido",
    fechaRegistro: "2023-06-20",
    ultimoAcceso: "2024-12-25 10:15",
    prestamosActivos: 1,
    prestamosHistoricos: 8,
    multasPendientes: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    numeroUsuario: "USR-001238",
    nombre: "Luis",
    apellidoPaterno: "Hernández",
    apellidoMaterno: "Ruiz",
    email: "luis.hernandez@email.com",
    telefono: "+52 55 5678 9012",
    direccion: "Av. Revolución 654, Col. San Ángel, CDMX",
    fechaNacimiento: "1988-04-10",
    genero: "masculino",
    rol: "lector",
    estado: "inactivo",
    fechaRegistro: "2023-09-12",
    ultimoAcceso: "2024-11-15 09:30",
    prestamosActivos: 0,
    prestamosHistoricos: 3,
    multasPendientes: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminPanelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const usersPerPage = 10

  // Estado para nuevo usuario
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    genero: "",
    rol: "lector",
    password: "",
    confirmPassword: "",
    enviarCredenciales: true,
  })

  // Estado para editar usuario
  const [editUser, setEditUser] = useState<any>({})

  // Filtrar usuarios
  const filteredUsers = mockUsuarios.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.numeroUsuario.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "todos" || user.rol === roleFilter
    const matchesStatus = statusFilter === "todos" || user.estado === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  // Estadísticas
  const stats = {
    totalUsuarios: mockUsuarios.length,
    usuariosActivos: mockUsuarios.filter((u) => u.estado === "activo").length,
    usuariosSuspendidos: mockUsuarios.filter((u) => u.estado === "suspendido").length,
    usuariosInactivos: mockUsuarios.filter((u) => u.estado === "inactivo").length,
    lectores: mockUsuarios.filter((u) => u.rol === "lector").length,
    bibliotecarios: mockUsuarios.filter((u) => u.rol === "bibliotecario").length,
    administradores: mockUsuarios.filter((u) => u.rol === "admin").length,
    prestamosActivos: mockUsuarios.reduce((sum, u) => sum + u.prestamosActivos, 0),
    multasPendientes: mockUsuarios.reduce((sum, u) => sum + u.multasPendientes, 0),
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) {
      return `+${numbers}`
    } else if (numbers.length <= 4) {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`
    } else if (numbers.length <= 8) {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`
    } else {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`
    }
  }

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case "admin":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Administrador
          </Badge>
        )
      case "bibliotecario":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Bibliotecario
          </Badge>
        )
      case "lector":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Lector
          </Badge>
        )
      default:
        return <Badge variant="outline">{rol}</Badge>
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Activo
          </Badge>
        )
      case "suspendido":
        return <Badge variant="destructive">Suspendido</Badge>
      case "inactivo":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactivo
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const openViewModal = (user: any) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const openEditModal = (user: any) => {
    setEditUser({ ...user })
    setIsEditModalOpen(true)
  }

  const openAddModal = () => {
    setNewUser({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      direccion: "",
      fechaNacimiento: "",
      genero: "",
      rol: "lector",
      password: "",
      confirmPassword: "",
      enviarCredenciales: true,
    })
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (user: any) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const closeModals = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setIsAddModalOpen(false)
    setIsDeleteModalOpen(false)
    setSelectedUser(null)
    setEditUser({})
  }

  const handleAddUser = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validaciones
      if (!newUser.nombre || !newUser.apellidoPaterno || !newUser.email) {
        throw new Error("Los campos nombre, apellido paterno y email son obligatorios")
      }

      if (newUser.password !== newUser.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (newUser.telefono) {
        const phoneRegex = /^\+52 \d{2} \d{4} \d{4}$/
        if (!phoneRegex.test(newUser.telefono)) {
          throw new Error("El formato del teléfono debe ser: +52 55 1234 5678")
        }
      }

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage(`Usuario ${newUser.nombre} ${newUser.apellidoPaterno} creado exitosamente`)
      closeModals()
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al crear el usuario")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validaciones
      if (!editUser.nombre || !editUser.apellidoPaterno || !editUser.email) {
        throw new Error("Los campos nombre, apellido paterno y email son obligatorios")
      }

      if (editUser.telefono) {
        const phoneRegex = /^\+52 \d{2} \d{4} \d{4}$/
        if (!phoneRegex.test(editUser.telefono)) {
          throw new Error("El formato del teléfono debe ser: +52 55 1234 5678")
        }
      }

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage(`Usuario ${editUser.nombre} ${editUser.apellidoPaterno} actualizado exitosamente`)
      closeModals()
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al actualizar el usuario")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage(`Usuario ${selectedUser.nombre} ${selectedUser.apellidoPaterno} eliminado exitosamente`)
      closeModals()
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage("Error al eliminar el usuario")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Rol</Label>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Roles</SelectItem>
            <SelectItem value="lector">Lectores</SelectItem>
            <SelectItem value="bibliotecario">Bibliotecarios</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Estado</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los Estados</SelectItem>
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="suspendido">Suspendidos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSearchTerm("")
          setRoleFilter("todos")
          setStatusFilter("todos")
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona usuarios y supervisa el sistema</p>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{stats.totalUsuarios}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {stats.lectores} lectores, {stats.bibliotecarios} bibliotecarios, {stats.administradores} admins
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.usuariosActivos}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {stats.usuariosSuspendidos} suspendidos, {stats.usuariosInactivos} inactivos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Préstamos Activos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.prestamosActivos}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">En el sistema actualmente</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Multas Pendientes</p>
                  <p className="text-2xl font-bold text-red-600">{stats.multasPendientes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Requieren atención</div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda y Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar y Filtrar Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, email o número de usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden bg-transparent">
                    <Filter className="h-4 w-4" />
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
              <Button onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Filtros Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              <FilterContent />
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Préstamos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.nombre} ${user.apellidoPaterno}`}
                            />
                            <AvatarFallback>
                              {user.nombre.charAt(0)}
                              {user.apellidoPaterno.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.numeroUsuario}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.rol)}</TableCell>
                      <TableCell>{getStatusBadge(user.estado)}</TableCell>
                      <TableCell>{formatDate(user.fechaRegistro)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(user.ultimoAcceso.split(" ")[0])}</p>
                          <p className="text-xs text-muted-foreground">{user.ultimoAcceso.split(" ")[1]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            <span className="font-medium">{user.prestamosActivos}</span> activos
                          </p>
                          <p className="text-xs text-muted-foreground">{user.prestamosHistoricos} históricos</p>
                          {user.multasPendientes > 0 && (
                            <p className="text-xs text-red-600">{user.multasPendientes} multas</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openViewModal(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Modal Ver Usuario */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalles del Usuario</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Información básica */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Información Básica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt="Avatar" />
                          <AvatarFallback className="text-lg">
                            {selectedUser.nombre.charAt(0)}
                            {selectedUser.apellidoPaterno.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedUser.nombre} {selectedUser.apellidoPaterno} {selectedUser.apellidoMaterno}
                          </h3>
                          <p className="text-sm text-muted-foreground">{selectedUser.numeroUsuario}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rol:</span>
                          {getRoleBadge(selectedUser.rol)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estado:</span>
                          {getStatusBadge(selectedUser.estado)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Género:</span>
                          <span className="capitalize">{selectedUser.genero}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha Nacimiento:</span>
                          <span>{formatDate(selectedUser.fechaNacimiento)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Información de contacto y cuenta */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Información de Contacto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.telefono}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span>{selectedUser.direccion}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Información de la Cuenta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de Registro:</span>
                        <span>{formatDate(selectedUser.fechaRegistro)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Último Acceso:</span>
                        <span>{selectedUser.ultimoAcceso}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Préstamos Activos:</span>
                        <span className="font-medium">{selectedUser.prestamosActivos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Préstamos Históricos:</span>
                        <span>{selectedUser.prestamosHistoricos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Multas Pendientes:</span>
                        <span className={selectedUser.multasPendientes > 0 ? "text-red-600 font-medium" : ""}>
                          {selectedUser.multasPendientes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cerrar
                </Button>
                <Button onClick={() => openEditModal(selectedUser)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Usuario
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Editar Usuario</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nombre">Nombre *</Label>
                    <Input
                      id="edit-nombre"
                      value={editUser.nombre || ""}
                      onChange={(e) => setEditUser({ ...editUser, nombre: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-apellidoPaterno">Apellido Paterno *</Label>
                    <Input
                      id="edit-apellidoPaterno"
                      value={editUser.apellidoPaterno || ""}
                      onChange={(e) => setEditUser({ ...editUser, apellidoPaterno: e.target.value })}
                      placeholder="Apellido paterno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="edit-apellidoMaterno"
                    value={editUser.apellidoMaterno || ""}
                    onChange={(e) => setEditUser({ ...editUser, apellidoMaterno: e.target.value })}
                    placeholder="Apellido materno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser.email || ""}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-telefono">Teléfono</Label>
                    <Input
                      id="edit-telefono"
                      value={editUser.telefono || ""}
                      onChange={(e) => setEditUser({ ...editUser, telefono: formatPhoneNumber(e.target.value) })}
                      placeholder="+52 55 1234 5678"
                      maxLength={17}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="edit-fechaNacimiento"
                      type="date"
                      value={editUser.fechaNacimiento || ""}
                      onChange={(e) => setEditUser({ ...editUser, fechaNacimiento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-direccion">Dirección</Label>
                  <Textarea
                    id="edit-direccion"
                    value={editUser.direccion || ""}
                    onChange={(e) => setEditUser({ ...editUser, direccion: e.target.value })}
                    placeholder="Dirección completa"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-genero">Género</Label>
                    <Select
                      value={editUser.genero || ""}
                      onValueChange={(value) => setEditUser({ ...editUser, genero: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-rol">Rol</Label>
                    <Select
                      value={editUser.rol || ""}
                      onValueChange={(value) => setEditUser({ ...editUser, rol: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lector">Lector</SelectItem>
                        <SelectItem value="bibliotecario">Bibliotecario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-estado">Estado</Label>
                    <Select
                      value={editUser.estado || ""}
                      onValueChange={(value) => setEditUser({ ...editUser, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button onClick={handleEditUser} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Usuario */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Agregar Nuevo Usuario</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-nombre">Nombre *</Label>
                    <Input
                      id="new-nombre"
                      value={newUser.nombre}
                      onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-apellidoPaterno">Apellido Paterno *</Label>
                    <Input
                      id="new-apellidoPaterno"
                      value={newUser.apellidoPaterno}
                      onChange={(e) => setNewUser({ ...newUser, apellidoPaterno: e.target.value })}
                      placeholder="Apellido paterno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="new-apellidoMaterno"
                    value={newUser.apellidoMaterno}
                    onChange={(e) => setNewUser({ ...newUser, apellidoMaterno: e.target.value })}
                    placeholder="Apellido materno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-email">Email *</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-telefono">Teléfono</Label>
                    <Input
                      id="new-telefono"
                      value={newUser.telefono}
                      onChange={(e) => setNewUser({ ...newUser, telefono: formatPhoneNumber(e.target.value) })}
                      placeholder="+52 55 1234 5678"
                      maxLength={17}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="new-fechaNacimiento"
                      type="date"
                      value={newUser.fechaNacimiento}
                      onChange={(e) => setNewUser({ ...newUser, fechaNacimiento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-direccion">Dirección</Label>
                  <Textarea
                    id="new-direccion"
                    value={newUser.direccion}
                    onChange={(e) => setNewUser({ ...newUser, direccion: e.target.value })}
                    placeholder="Dirección completa"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-genero">Género</Label>
                    <Select value={newUser.genero} onValueChange={(value) => setNewUser({ ...newUser, genero: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-rol">Rol</Label>
                    <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lector">Lector</SelectItem>
                        <SelectItem value="bibliotecario">Bibliotecario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Contraseña *</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Contraseña"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-confirmPassword">Confirmar Contraseña *</Label>
                    <Input
                      id="new-confirmPassword"
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      placeholder="Confirmar contraseña"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enviar-credenciales"
                    checked={newUser.enviarCredenciales}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, enviarCredenciales: checked })}
                  />
                  <Label htmlFor="enviar-credenciales">Enviar credenciales por email al usuario</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button onClick={handleAddUser} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <UserPlus className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Usuario */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Eliminar Usuario</h2>
                  <p className="text-muted-foreground">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm">
                  ¿Estás seguro de que quieres eliminar al usuario{" "}
                  <strong>
                    {selectedUser.nombre} {selectedUser.apellidoPaterno} {selectedUser.apellidoMaterno}
                  </strong>
                  ?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Se eliminarán todos sus datos, historial de préstamos y configuraciones asociadas.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Trash2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Usuario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
