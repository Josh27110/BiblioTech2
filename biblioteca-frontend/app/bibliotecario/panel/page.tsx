"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  BookMarked,
  Library,
  Settings,
} from "lucide-react"

// Mock data para préstamos pendientes
const mockPendingLoans = [
  {
    id: 1,
    user: "Ana García López",
    userEmail: "ana.garcia@email.com",
    book: "El Quijote de la Mancha",
    bookId: 1,
    requestDate: "2024-01-15",
    requestedDays: 14,
    status: "pendiente",
  },
  {
    id: 2,
    user: "Carlos Mendoza",
    userEmail: "carlos.mendoza@email.com",
    book: "Cien Años de Soledad",
    bookId: 2,
    requestDate: "2024-01-14",
    requestedDays: 21,
    status: "pendiente",
  },
  {
    id: 3,
    user: "María Rodríguez",
    userEmail: "maria.rodriguez@email.com",
    book: "1984",
    bookId: 3,
    requestDate: "2024-01-13",
    requestedDays: 7,
    status: "pendiente",
  },
]

// Mock data para multas
const mockFines = [
  {
    id: 1,
    user: "Pedro Sánchez",
    userEmail: "pedro.sanchez@email.com",
    book: "El Principito",
    amount: 50,
    daysOverdue: 5,
    issueDate: "2024-01-10",
    status: "pendiente",
  },
  {
    id: 2,
    user: "Laura Martín",
    userEmail: "laura.martin@email.com",
    book: "Orgullo y Prejuicio",
    amount: 30,
    daysOverdue: 3,
    issueDate: "2024-01-12",
    status: "pendiente",
  },
]

// Mock data para libros del catálogo
const mockCatalogBooks = [
  {
    id: 1,
    title: "El Quijote de la Mancha",
    author: "Miguel de Cervantes",
    isbn: "978-84-376-0494-7",
    genre: "Clásico",
    totalCopies: 5,
    availableCopies: 3,
    publishYear: 1605,
    publisher: "Editorial Planeta",
    status: "disponible",
  },
  {
    id: 2,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    isbn: "978-84-376-0495-4",
    genre: "Realismo Mágico",
    totalCopies: 4,
    availableCopies: 2,
    publishYear: 1967,
    publisher: "Editorial Sudamericana",
    status: "disponible",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    isbn: "978-84-376-0496-1",
    genre: "Distopía",
    totalCopies: 3,
    availableCopies: 0,
    publishYear: 1949,
    publisher: "Secker & Warburg",
    status: "agotado",
  },
  {
    id: 4,
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    isbn: "978-84-376-0497-8",
    genre: "Infantil",
    totalCopies: 6,
    availableCopies: 5,
    publishYear: 1943,
    publisher: "Reynal & Hitchcock",
    status: "disponible",
  },
]

export default function BibliotecarioPanelPage() {
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [selectedFine, setSelectedFine] = useState<any>(null)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [isEditBookOpen, setIsEditBookOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    totalCopies: 1,
    publishYear: new Date().getFullYear(),
    publisher: "",
    description: "",
  })

  // Filtrar libros
  const filteredBooks = mockCatalogBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    const matchesStatus = filterStatus === "todos" || book.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApproveLoan = (loanId: number) => {
    console.log("Préstamo aprobado:", loanId)
    // Aquí iría la lógica para aprobar el préstamo
  }

  const handleRejectLoan = (loanId: number) => {
    console.log("Préstamo rechazado:", loanId)
    // Aquí iría la lógica para rechazar el préstamo
  }

  const handleProcessFine = (fineId: number, action: string) => {
    console.log("Multa procesada:", fineId, action)
    // Aquí iría la lógica para procesar la multa
  }

  const handleAddBook = () => {
    console.log("Nuevo libro:", newBook)
    setIsAddBookOpen(false)
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      totalCopies: 1,
      publishYear: new Date().getFullYear(),
      publisher: "",
      description: "",
    })
  }

  const handleEditBook = () => {
    console.log("Libro editado:", selectedBook)
    setIsEditBookOpen(false)
    setSelectedBook(null)
  }

  const handleDeleteBook = (bookId: number) => {
    console.log("Libro eliminado:", bookId)
    // Aquí iría la lógica para eliminar el libro
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Bibliotecario</h1>
          <p className="text-muted-foreground">Gestiona préstamos, multas y el catálogo de libros</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Préstamos Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{mockPendingLoans.length}</div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Requieren autorización</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Multas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{mockFines.length}</div>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70">Pendientes de gestión</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Libros en Catálogo
              </CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{mockCatalogBooks.length}</div>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Títulos disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Copias Disponibles
              </CardTitle>
              <Library className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {mockCatalogBooks.reduce((sum, book) => sum + book.availableCopies, 0)}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70">Listas para préstamo</p>
            </CardContent>
          </Card>
        </div>

        {/* Procesos Administrativos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Procesos Administrativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prestamos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prestamos">Gestión de Préstamos</TabsTrigger>
                <TabsTrigger value="multas">Gestión de Multas</TabsTrigger>
              </TabsList>

              <TabsContent value="prestamos" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Préstamos Pendientes de Autorización</h3>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Libro</TableHead>
                        <TableHead>Fecha Solicitud</TableHead>
                        <TableHead>Días Solicitados</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPendingLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.user}</div>
                              <div className="text-sm text-muted-foreground">{loan.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{loan.book}</TableCell>
                          <TableCell>{loan.requestDate}</TableCell>
                          <TableCell>{loan.requestedDays} días</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Pendiente</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveLoan(loan.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectLoan(loan.id)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="multas" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Multas Pendientes de Gestión</h3>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Libro</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Días de Retraso</TableHead>
                        <TableHead>Fecha Emisión</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFines.map((fine) => (
                        <TableRow key={fine.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{fine.user}</div>
                              <div className="text-sm text-muted-foreground">{fine.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{fine.book}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {fine.amount}
                            </div>
                          </TableCell>
                          <TableCell>{fine.daysOverdue} días</TableCell>
                          <TableCell>{fine.issueDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Ver
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Detalles de la Multa</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Usuario</Label>
                                      <p className="text-sm">
                                        {fine.user} ({fine.userEmail})
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Libro</Label>
                                      <p className="text-sm">{fine.book}</p>
                                    </div>
                                    <div>
                                      <Label>Monto de la Multa</Label>
                                      <p className="text-sm">${fine.amount}</p>
                                    </div>
                                    <div>
                                      <Label>Días de Retraso</Label>
                                      <p className="text-sm">{fine.daysOverdue} días</p>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      <Button
                                        onClick={() => handleProcessFine(fine.id, "condonar")}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Condonar Multa
                                      </Button>
                                      <Button onClick={() => handleProcessFine(fine.id, "modificar")} variant="outline">
                                        Modificar Monto
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Gestión del Catálogo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Gestión del Catálogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Controles de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por título, autor o ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="agotado">Agotado</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Libro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Libro</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        placeholder="Título del libro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor *</Label>
                      <Input
                        id="author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        placeholder="Nombre del autor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN *</Label>
                      <Input
                        id="isbn"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        placeholder="978-84-376-0494-7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genre">Género</Label>
                      <Select value={newBook.genre} onValueChange={(value) => setNewBook({ ...newBook, genre: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clásico">Clásico</SelectItem>
                          <SelectItem value="Realismo Mágico">Realismo Mágico</SelectItem>
                          <SelectItem value="Distopía">Distopía</SelectItem>
                          <SelectItem value="Infantil">Infantil</SelectItem>
                          <SelectItem value="Romance">Romance</SelectItem>
                          <SelectItem value="Fantasía">Fantasía</SelectItem>
                          <SelectItem value="Ciencia Ficción">Ciencia Ficción</SelectItem>
                          <SelectItem value="Misterio">Misterio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="copies">Número de Copias</Label>
                      <Input
                        id="copies"
                        type="number"
                        min="1"
                        value={newBook.totalCopies}
                        onChange={(e) => setNewBook({ ...newBook, totalCopies: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Año de Publicación</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newBook.publishYear}
                        onChange={(e) => setNewBook({ ...newBook, publishYear: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="publisher">Editorial</Label>
                      <Input
                        id="publisher"
                        value={newBook.publisher}
                        onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                        placeholder="Nombre de la editorial"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newBook.description}
                        onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                        placeholder="Descripción del libro..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddBookOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddBook}>Agregar Libro</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Tabla de libros */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Libro</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Género</TableHead>
                    <TableHead>Copias</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-muted-foreground">{book.author}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.genre}</Badge>
                      </TableCell>
                      <TableCell>{book.totalCopies}</TableCell>
                      <TableCell>{book.availableCopies}</TableCell>
                      <TableCell>
                        <Badge variant={book.status === "disponible" ? "default" : "destructive"}>
                          {book.status === "disponible" ? "Disponible" : "Agotado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalles del Libro</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Título</Label>
                                  <p className="text-sm">{book.title}</p>
                                </div>
                                <div>
                                  <Label>Autor</Label>
                                  <p className="text-sm">{book.author}</p>
                                </div>
                                <div>
                                  <Label>ISBN</Label>
                                  <p className="text-sm font-mono">{book.isbn}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Género</Label>
                                    <p className="text-sm">{book.genre}</p>
                                  </div>
                                  <div>
                                    <Label>Año</Label>
                                    <p className="text-sm">{book.publishYear}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Editorial</Label>
                                  <p className="text-sm">{book.publisher}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Total de Copias</Label>
                                    <p className="text-sm">{book.totalCopies}</p>
                                  </div>
                                  <div>
                                    <Label>Disponibles</Label>
                                    <p className="text-sm">{book.availableCopies}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={isEditBookOpen} onOpenChange={setIsEditBookOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedBook(book)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Libro</DialogTitle>
                              </DialogHeader>
                              {selectedBook && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input defaultValue={selectedBook.title} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Autor</Label>
                                    <Input defaultValue={selectedBook.author} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Total de Copias</Label>
                                    <Input type="number" defaultValue={selectedBook.totalCopies} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Copias Disponibles</Label>
                                    <Input type="number" defaultValue={selectedBook.availableCopies} />
                                  </div>
                                  <div className="col-span-2 flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsEditBookOpen(false)}>
                                      Cancelar
                                    </Button>
                                    <Button onClick={handleEditBook}>Guardar Cambios</Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar libro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el libro "{book.title}"
                                  del catálogo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBook(book.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
