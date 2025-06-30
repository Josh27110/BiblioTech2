"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Asegúrate de importar Avatar si lo usas
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Shield, // Icono para Bibliotecario, si usas uno diferente
  Loader2, // Para spinners de carga
  Check, // Para aprobar
  Ban, // Para rechazar
  ClipboardList, // Para Préstamos Pendientes
  Copy, // Para Copias Disponibles
} from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"

// --- Interfaces para los datos del Backend ---
interface BibliotecarioSummary {
  prestamosPendientes: number;
  multasActivas: number;
  librosEnCatalogo: number;
  copiasDisponibles: number;
}

interface UserDataForLoan {
    id: number;
    nombre: string;
    email: string;
}

interface BookDataForLoan {
    id: number;
    nombre: string;
    isbn: string;
}

interface PendingLoanRequest {
  id: number;
  usuario: UserDataForLoan;
  fechaSolicitud: string;
  estado: string; // 'Pendiente'
  libros: BookDataForLoan[];
}

interface BookCatalogData {
    id: number;
    isbn: string;
    nombre: string; // Cambiado de 'title' a 'nombre' para coincidir con el backend
    cantidad: number; // Cambiado de 'totalCopies' a 'cantidad'
    autores: string[];
    generos: string[];
    editorial?: string; // Añadido
    edicion?: number; // Añadido
}


export default function BibliotecarioPanelPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [summaryData, setSummaryData] = useState<BibliotecarioSummary | null>(null);
  const [pendingLoans, setPendingLoans] = useState<PendingLoanRequest[]>([]);
  const [bookCatalog, setBookCatalog] = useState<BookCatalogData[]>([]); // Para la gestión del catálogo
  const [isLoadingPanel, setIsLoadingPanel] = useState(true);
  const [errorPanel, setErrorPanel] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos"); // Para catálogo de libros

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookCatalogData | null>(null); // Libro seleccionado para ver/editar/eliminar
  
  const [newBook, setNewBook] = useState({ // Estado para el formulario de añadir libro
    isbn: "",
    nombre: "",
    cantidad: 1,
    autores: "", // string separado por comas
    generos: "", // string separado por comas
    editorial: "", // Añadido
    edicion: 1, // Añadido
  });

  const [editBook, setEditBook] = useState<Partial<BookCatalogData> & { autores?: string, generos?: string }>({}); // Estado para el formulario de editar libro

  const [isLoadingAction, setIsLoadingAction] = useState(false); // Para spinners de acciones (aprobar, añadir libro, etc.)
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Funciones para fetching de datos ---
  const fetchBibliotecarioSummary = useCallback(async () => {
    console.log("BibliotecarioPanelPage: fetchBibliotecarioSummary iniciado.");
    try {
      setErrorPanel(null);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await fetch('http://localhost:5000/api/v1/bibliotecario/panel/summary', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Error ${response.status} al cargar el resumen del panel.`);
      }
      const data: BibliotecarioSummary = await response.json();
      setSummaryData(data);
      console.log("BibliotecarioPanelPage: Resumen cargado con éxito.", data);
    } catch (err: any) {
      setErrorPanel(err.message);
      console.error("BibliotecarioPanelPage: Error fetching summary:", err);
    }
  }, []);

  const fetchPendingLoans = useCallback(async () => {
    console.log("BibliotecarioPanelPage: fetchPendingLoans iniciado.");
    try {
      setErrorPanel(null);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await fetch('http://localhost:5000/api/v1/bibliotecario/prestamos-pendientes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Error ${response.status}: No se pudieron cargar los préstamos pendientes.`);
      }
      const data: PendingLoanRequest[] = await response.json();
      setPendingLoans(data);
      console.log("BibliotecarioPanelPage: Préstamos pendientes cargados con éxito.", data);
    } catch (err: any) {
      setErrorPanel(err.message);
      console.error("BibliotecarioPanelPage: Error fetching pending loans:", err);
    }
  }, []);

  const fetchBookCatalog = useCallback(async () => {
    console.log("BibliotecarioPanelPage: fetchBookCatalog iniciado.");
    try {
      setErrorPanel(null);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const url = 'http://localhost:5000/api/v1/libros'; // <<< URL para GET de Libros >>>
      console.log("fetchBookCatalog: Fetching from URL:", url); // <<< LOG DE URL >>>

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Error ${response.status}: No se pudo cargar el catálogo de libros.`);
      }
      const data: BookCatalogData[] = await response.json();
      setBookCatalog(data);
      console.log("BibliotecarioPanelPage: Catálogo de libros cargado con éxito.", data);
    } catch (err: any) {
      setErrorPanel(err.message);
      console.error("BibliotecarioPanelPage: Error fetching book catalog:", err);
    }
  }, []);


  // --- useEffect para carga inicial de datos ---
  useEffect(() => {
    console.log("BibliotecarioPanelPage useEffect: user:", user, "isAuthLoading:", isAuthLoading);

    if (isAuthLoading) {
      console.log("BibliotecarioPanelPage useEffect: AuthContext cargando, esperando.");
      return;
    }

    // Redirigir si no es bibliotecario o no está logueado
    if (!user || user.rol !== 'Bibliotecario') { // Asegúrate que 'Bibliotecario' coincida con tu backend
      console.log("BibliotecarioPanelPage useEffect: Usuario no es Bibliotecario o no existe. Redirigiendo a /login.");
      router.push('/login'); // O a una página de acceso denegado
      return;
    }

    console.log("BibliotecarioPanelPage useEffect: Usuario es Bibliotecario y autenticación lista, iniciando carga de datos del panel.");
    const loadPanelData = async () => {
      setIsLoadingPanel(true);
      await Promise.all([
        fetchBibliotecarioSummary(),
        fetchPendingLoans(),
        fetchBookCatalog(), // Cargar el catálogo también
      ]);
      setIsLoadingPanel(false);
      console.log("BibliotecarioPanelPage useEffect: Carga de datos del panel completada.");
    };
    loadPanelData();

  }, [user, isAuthLoading, router, fetchBibliotecarioSummary, fetchPendingLoans, fetchBookCatalog]);


  // --- Manejo de Acciones (Aprobar/Rechazar Préstamo) ---
  const handleLoanAction = async (solicitudId: number, action: 'aprobar' | 'rechazar') => {
    setIsLoadingAction(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

      const response = await fetch(`http://localhost:5000/api/v1/bibliotecario/solicitudes/${solicitudId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleLoanAction: Error de respuesta del backend:", errorData);
        throw new Error(errorData.message || `Error ${response.status} al ${action} la solicitud.`);
      }

      setSuccessMessage(`Solicitud ${solicitudId} ${action === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente.`);
      await Promise.all([fetchBibliotecarioSummary(), fetchPendingLoans()]); // Recargar datos
    } catch (error: any) {
      setErrorMessage(error.message || `Error al ${action} la solicitud.`);
      console.error(`Error al ${action} solicitud:`, error);
    } finally {
      setIsLoadingAction(false);
      setTimeout(() => { setSuccessMessage(""); setErrorMessage(""); }, 5000);
    }
  };


  // --- Manejo de Acciones para Gestión de Catálogo (Añadir/Editar/Eliminar Libro) ---
  const handleAddBook = async () => {
    setIsLoadingAction(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!newBook.isbn || !newBook.nombre || !newBook.cantidad || newBook.cantidad <= 0 || !newBook.autores || !newBook.generos) {
        throw new Error("ISBN, nombre, cantidad, autores y géneros son obligatorios.");
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

      const bookDataToSend = {
        isbn: newBook.isbn,
        nombre: newBook.nombre,
        cantidad: newBook.cantidad,
        autores: newBook.autores.split(',').map(s => s.trim()).filter(s => s.length > 0), // Convertir a array de strings
        generos: newBook.generos.split(',').map(s => s.trim()).filter(s => s.length > 0), // Convertir a array de strings
        editorial: newBook.editorial || null,
        edicion: newBook.edicion || null,
      };

      const url = 'http://localhost:5000/api/v1/libros'; // <<< URL para POST de Libros >>>
      console.log("handleAddBook: Enviando POST a URL:", url, "con datos:", bookDataToSend); // <<< LOG DE URL >>>

      const response = await fetch(url, { // Endpoint POST para crear libros
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bookDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleAddBook: Error de respuesta del backend:", errorData);
        throw new Error(errorData.message || `Error ${response.status}: No se pudo añadir el libro.`);
      }

      setSuccessMessage(`Libro "${newBook.nombre}" añadido exitosamente.`);
      closeModals(); // Recargará el catálogo
    } catch (error: any) {
      setErrorMessage(error.message || "Error al añadir el libro.");
      console.error("Error al añadir libro:", error);
    } finally {
      setIsLoadingAction(false);
      setTimeout(() => { setSuccessMessage(""); setErrorMessage(""); }, 5000);
    }
  };

  const handleEditBook = async () => {
    setIsLoadingAction(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!editBook.id || !editBook.isbn || !editBook.nombre || (editBook.cantidad !== undefined && editBook.cantidad < 0)) {
        throw new Error("ID, ISBN, nombre y cantidad válidos son obligatorios.");
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

      const bookDataToSend: Partial<BookCatalogData> = {
        isbn: editBook.isbn,
        nombre: editBook.nombre,
        cantidad: editBook.cantidad,
        autores: editBook.autores ? editBook.autores.split(',').map(s => s.trim()).filter(s => s.length > 0) : undefined,
        generos: editBook.generos ? editBook.generos.split(',').map(s => s.trim()).filter(s => s.length > 0) : undefined,
        editorial: editBook.editorial,
        edicion: editBook.edicion,
      };

      const url = `http://localhost:5000/api/v1/libros/${editBook.id}`; // <<< URL para PUT/PATCH de Libros >>>
      console.log("handleEditBook: Enviando PUT a URL:", url, "con datos:", bookDataToSend); // <<< LOG DE URL >>>

      const response = await fetch(url, { // Endpoint PUT/PATCH para editar libros
        method: 'PUT', // O 'PATCH'
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bookDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleEditBook: Error de respuesta del backend:", errorData);
        throw new Error(errorData.message || `Error ${response.status}: No se pudo editar el libro.`);
      }

      setSuccessMessage(`Libro "${editBook.nombre}" editado exitosamente.`);
      closeModals();
    } catch (error: any) {
      setErrorMessage(error.message || "Error al editar el libro.");
      console.error("Error al editar libro:", error);
    } finally {
      setIsLoadingAction(false);
      setTimeout(() => { setSuccessMessage(""); setErrorMessage(""); }, 5000);
    }
  };

  const handleDeleteBook = async () => {
    setIsLoadingAction(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!selectedBook?.id) {
        throw new Error("ID del libro no encontrado para eliminar.");
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

      const url = `http://localhost:5000/api/v1/libros/${selectedBook.id}`; // <<< URL para DELETE de Libros >>>
      console.log("handleDeleteBook: Enviando DELETE a URL:", url); // <<< LOG DE URL >>>

      const response = await fetch(url, { // Endpoint DELETE para eliminar libros
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleDeleteBook: Error de respuesta del backend:", errorData);
        throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar el libro.`);
      }

      setSuccessMessage(`Libro "${selectedBook.nombre}" eliminado exitosamente.`);
      closeModals();
    } catch (error: any) {
      setErrorMessage(error.message || "Error al eliminar el libro.");
      console.error("Error al eliminar libro:", error);
    } finally {
      setIsLoadingAction(false);
      setTimeout(() => { setSuccessMessage(""); setErrorMessage(""); }, 5000);
    }
  };


  const openAddBookModal = () => {
    setNewBook({ isbn: "", nombre: "", cantidad: 1, autores: "", generos: "", editorial: "", edicion: 1 });
    setIsAddBookModalOpen(true);
  };

  const openEditBookModal = (book: BookCatalogData) => {
    setSelectedBook(book);
    setEditBook({ 
      ...book, 
      autores: book.autores.join(', '), 
      generos: book.generos.join(', '),
      editorial: book.editorial || '',
      edicion: book.edicion || 1
    }); 
    setIsEditBookModalOpen(true);
  };

  const openDeleteBookModal = (book: BookCatalogData) => {
    setSelectedBook(book);
    setIsDeleteBookModalOpen(true);
  };

  const closeModals = () => {
    setIsAddBookModalOpen(false);
    setIsEditBookModalOpen(false);
    setIsDeleteBookModalOpen(false);
    setSelectedBook(null);
    setNewBook({ isbn: "", nombre: "", cantidad: 1, autores: "", generos: "", editorial: "", edicion: 1 });
    setEditBook({});
    // Recargar datos del panel y catálogo al cerrar un modal de acción
    if (!isLoadingPanel && !isAuthLoading) {
      fetchBibliotecarioSummary();
      fetchPendingLoans();
      fetchBookCatalog();
    }
  };


  // Filtrar libros en el frontend para la tabla de catálogo
  const filteredBooks = bookCatalog.filter((book) => {
    const matchesSearch =
      book.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autores.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const bookStatus = book.cantidad > 0 ? "disponible" : "agotado";
    const matchesStatus = filterStatus === "todos" || bookStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });


  // --- Renderizado ---
  console.log("BibliotecarioPanelPage: Render. isAuthLoading:", isAuthLoading, "isLoadingPanel:", isLoadingPanel, "errorPanel:", errorPanel, "user:", user);


  if (isAuthLoading || isLoadingPanel) {
    console.log("BibliotecarioPanelPage: Mostrando loader del panel.");
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-[400px] w-full" />
          <p>Cargando panel de bibliotecario...</p>
        </div>
      </MainLayout>
    );
  }

  if (errorPanel) {
    console.log("BibliotecarioPanelPage: Mostrando error del panel.");
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-red-500">Error al Cargar el Panel</h1>
          <p className="text-muted-foreground">{errorPanel}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Intentar de Nuevo
          </Button>
        </div>
      </MainLayout>
    );
  }


  // --- Renderizado principal del panel ---
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" /> {/* Icono para bibliotecario */}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel del Bibliotecario</h1>
              <p className="text-muted-foreground">Gestiona préstamos, multas y el catálogo de libros</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Préstamos Pendientes</p>
                  <p className="text-2xl font-bold">{summaryData?.prestamosPendientes ?? 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Requieren autorización</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Multas Activas</p>
                  <p className="text-2xl font-bold text-red-600">{summaryData?.multasActivas ?? 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Pendientes de gestión</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Libros en Catálogo</p>
                  <p className="text-2xl font-bold">{summaryData?.librosEnCatálogo ?? 0}</p>
                </div>
                <BookMarked className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Títulos disponibles</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Copias Disponibles</p>
                  <p className="text-2xl font-bold">{summaryData?.copiasDisponibles ?? 0}</p>
                </div>
                <Copy className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Listas para préstamo</div>
            </CardContent>
          </Card>
        </div>

        {/* Procesos Administrativos (Préstamos Pendientes) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Procesos Administrativos
            </CardTitle>
            <CardDescription>
              Gestiona préstamos, devoluciones y el catálogo.
            </CardDescription>
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
                        <TableHead>Libro(s)</TableHead>
                        <TableHead>Fecha Solicitud</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">No hay préstamos pendientes de autorización.</TableCell>
                            </TableRow>
                        ) : (
                            pendingLoans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>
                                        <p className="font-medium">{loan.usuario.nombre}</p>
                                        <p className="text-sm text-muted-foreground">{loan.usuario.email}</p>
                                    </TableCell>
                                    <TableCell>
                                        {loan.libros.map(book => (
                                            <div key={book.id}>
                                                <p className="text-sm font-medium">{book.nombre}</p>
                                                <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{new Date(loan.fechaSolicitud).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge>{loan.estado}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleLoanAction(loan.id, 'aprobar')} disabled={isLoadingAction}>
                                                <Check className="h-4 w-4 mr-1" /> Aprobar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleLoanAction(loan.id, 'rechazar')} disabled={isLoadingAction}>
                                                <Ban className="h-4 w-4 mr-1" /> Rechazar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="multas" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Multas Pendientes de Gestión</h3>
                </div>

                <div className="border rounded-lg">
                  {/* Aquí deberías cargar las multas desde un endpoint de backend y mapearlas */}
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
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">No hay multas pendientes (aún no implementado el fetch).</TableCell>
                        </TableRow>
                      {/*
                      // Ejemplo de cómo mapearías las multas si las tuvieras en un estado 'fines'
                      {fines.length === 0 ? (
                          <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No hay multas pendientes.</TableCell></TableRow>
                      ) : (
                          fines.map((fine) => (
                              <TableRow key={fine.id}>
                                  <TableCell>
                                      <div>
                                          <div className="font-medium">{fine.user.nombre}</div>
                                          <div className="text-sm text-muted-foreground">{fine.user.email}</div>
                                      </div>
                                  </TableCell>
                                  <TableCell className="font-medium">{fine.book.nombre}</TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1">
                                          <DollarSign className="h-4 w-4" />
                                          {fine.amount}
                                      </div>
                                  </TableCell>
                                  <TableCell>{fine.daysOverdue} días</TableCell>
                                  <TableCell>{new Date(fine.issueDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                      <div className="flex gap-2">
                                          <Dialog>
                                              <DialogTrigger asChild>
                                                  <Button size="sm" variant="outline">
                                                      <Eye className="h-4 w-4 mr-1" /> Ver
                                                  </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                  <DialogHeader><DialogTitle>Detalles de la Multa</DialogTitle></DialogHeader>
                                                  // ... Contenido del modal de detalles de multa ...
                                              </DialogContent>
                                          </Dialog>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                      */}
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
            <CardDescription>
              Administra los libros disponibles en la biblioteca. Mostrando {filteredBooks.length} libros.
            </CardDescription>
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
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="agotado">Agotado</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openAddBookModal}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Libro
              </Button>
            </div>

            {/* Tabla de libros */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Libro</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Género(s)</TableHead>
                    <TableHead>Autor(es)</TableHead>
                    <TableHead>Editorial</TableHead>
                    <TableHead>Edición</TableHead>
                    <TableHead>Copias</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredBooks.length === 0 ? (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">No hay libros en el catálogo que coincidan con la búsqueda.</TableCell></TableRow>
                    ) : (
                        filteredBooks.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>
                                    <p className="font-medium">{book.nombre}</p>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                                <TableCell>{book.generos.join(', ')}</TableCell>
                                <TableCell>{book.autores.join(', ')}</TableCell>
                                <TableCell>{book.editorial}</TableCell>
                                <TableCell>{book.edicion}</TableCell>
                                <TableCell>{book.cantidad}</TableCell>
                                <TableCell>
                                    <Badge variant={book.cantidad > 0 ? "default" : "destructive"}>
                                        {book.cantidad > 0 ? "Disponible" : "Agotado"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {/* Botón Ver Libro - Puedes crear un modal similar al de ver usuario */}
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => openEditBookModal(book)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
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
                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el libro "{book.nombre}"
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
                        ))
                    )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Añadir Libro */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Agregar Nuevo Libro</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="new-isbn">ISBN *</Label>
                  <Input id="new-isbn" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} placeholder="Ej: 978-1234567890" />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="new-nombre-libro">Nombre (Título) *</Label>
                  <Input id="new-nombre-libro" value={newBook.nombre} onChange={(e) => setNewBook({ ...newBook, nombre: e.target.value })} placeholder="Ej: Cien Años de Soledad" />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="new-cantidad">Cantidad *</Label>
                  <Input id="new-cantidad" type="number" value={newBook.cantidad} onChange={(e) => setNewBook({ ...newBook, cantidad: parseInt(e.target.value) || 0 })} min={1} />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="new-editorial">Editorial</Label>
                  <Input id="new-editorial" value={newBook.editorial} onChange={(e) => setNewBook({ ...newBook, editorial: e.target.value })} placeholder="Ej: Planeta" />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="new-edicion">Edición</Label>
                  <Input id="new-edicion" type="number" value={newBook.edicion} onChange={(e) => setNewBook({ ...newBook, edicion: parseInt(e.target.value) || 0 })} placeholder="Ej: 1" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-autores">Autor(es) (Separados por coma) *</Label>
                  <Input id="new-autores" value={newBook.autores} onChange={(e) => setNewBook({ ...newBook, autores: e.target.value })} placeholder="Ej: Gabriel Garcia Marquez, Julio Cortazar" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-generos">Género(s) (Separados por coma) *</Label>
                  <Input id="new-generos" value={newBook.generos} onChange={(e) => setNewBook({ ...newBook, generos: e.target.value })} placeholder="Ej: Realismo Mágico, Novela" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>Cancelar</Button>
                <Button onClick={handleAddBook} disabled={isLoadingAction}>
                  {isLoadingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Agregar Libro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Libro */}
      {isEditBookModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Editar Libro</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="edit-isbn">ISBN *</Label>
                  <Input id="edit-isbn" value={editBook.isbn || ''} onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="edit-nombre-libro">Nombre (Título) *</Label>
                  <Input id="edit-nombre-libro" value={editBook.nombre || ''} onChange={(e) => setEditBook({ ...editBook, nombre: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="edit-cantidad">Cantidad *</Label>
                  <Input id="edit-cantidad" type="number" value={editBook.cantidad ?? ''} onChange={(e) => setEditBook({ ...editBook, cantidad: parseInt(e.target.value) || 0 })} min={0} />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="edit-editorial">Editorial</Label>
                  <Input id="edit-editorial" value={editBook.editorial || ''} onChange={(e) => setEditBook({ ...editBook, editorial: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="edit-edicion">Edición</Label>
                  <Input id="edit-edicion" type="number" value={editBook.edicion ?? ''} onChange={(e) => setEditBook({ ...editBook, edicion: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-autores">Autor(es) (Separados por coma) *</Label>
                  <Input id="edit-autores" value={editBook.autores || ''} onChange={(e) => setEditBook({ ...editBook, autores: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-generos">Género(s) (Separados por coma) *</Label>
                  <Input id="edit-generos" value={editBook.generos || ''} onChange={(e) => setEditBook({ ...editBook, generos: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>Cancelar</Button>
                <Button onClick={handleEditBook} disabled={isLoadingAction}>
                  {isLoadingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Libro */}
      {isDeleteBookModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Eliminar Libro</h2>
                <Button variant="ghost" size="icon" onClick={closeModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-sm">
                  ¿Estás seguro de que quieres eliminar el libro{" "}
                  <strong>"{selectedBook.nombre}"</strong> (ISBN: {selectedBook.isbn})?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Se eliminará del catálogo y ya no estará disponible para préstamo.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeModals}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDeleteBook} disabled={isLoadingAction}>
                  {isLoadingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Eliminar Libro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}