// app/catalogo/page.tsx
"use client"

import { useState, useEffect } from "react"
// Se mantienen todos tus imports de componentes originales
import { MainLayout } from "@/components/layout/main-layout"
import { BookCard } from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// 1. Definimos los tipos de datos que esperamos de NUESTRA API
interface ApiBook {
  id: number;
  nombre: string;
  autores: string[];
  generos: string[];
  cantidad: number;
  portada: string; // La URL de la imagen
  rating: number; // La calificación
}

interface ApiGenre {
  id: number;
  nombre: string;
}

interface ApiAuthor {
  id: number;
  nombre: string;
}

// 2. Definimos el tipo de datos que tu componente BookCard espera recibir
// Esto nos permite crear un "adaptador"
interface BookCardData {
  id: number;
  title: string;
  author: string;
  image: string;
  rating: number;
  genre: string;
  available: boolean;
  availableCopies: number;
}


export default function CatalogoPage() {
  // --- Estados para guardar los datos que vienen de la API ---
  const [allBooksFromApi, setAllBooksFromApi] = useState<ApiBook[]>([]);
  const [genresFromApi, setGenresFromApi] = useState<string[]>(["Todos"]);
  const [authorsFromApi, setAuthorsFromApi] = useState<string[]>(["Todos"]);
  
  // --- Estados para la UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Mantenemos todos tus estados para filtros y paginación ---
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("Todos")
  const [selectedAuthor, setSelectedAuthor] = useState("Todos")
  const [sortBy, setSortBy] = useState("title")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 6

  // --- useEffect para cargar los datos de la API cuando el componente se monta ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [librosRes, generosRes, autoresRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/libros'),
          fetch('http://localhost:5000/api/v1/libros/generos'),
          fetch('http://localhost:5000/api/v1/libros/autores')
        ]);

        if (!librosRes.ok || !generosRes.ok || !autoresRes.ok) {
          throw new Error('La comunicación con la API falló');
        }

        const librosData: ApiBook[] = await librosRes.json();
        const generosData: ApiGenre[] = await generosRes.json();
        const autoresData: ApiAuthor[] = await autoresRes.json();

        setAllBooksFromApi(librosData);
        setGenresFromApi(["Todos", ...generosData.map(g => g.nombre)]);
        setAuthorsFromApi(["Todos", ...autoresData.map(a => a.nombre)]);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez.

  // --- Lógica de filtrado, ordenamiento y MAPEO ---
  const filteredBooks = allBooksFromApi
    .filter((book) => {
      const authorString = book.autores.join(", ");
      const matchesSearch =
        book.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        authorString.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === "Todos" || book.generos.includes(selectedGenre);
      const matchesAuthor = selectedAuthor === "Todos" || book.autores.includes(selectedAuthor);
      const matchesAvailability = !showAvailableOnly || book.cantidad > 0;
      return matchesSearch && matchesGenre && matchesAuthor && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title": return a.nombre.localeCompare(b.nombre);
        case "author": return a.autores[0].localeCompare(b.autores[0]);
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

  // El Mapeo: Transformamos los datos de la API a la estructura que tu <BookCard> espera
  const booksForDisplay: BookCardData[] = filteredBooks.map(apiBook => ({
    id: apiBook.id,
    title: apiBook.nombre,
    author: apiBook.autores.join(', '),
    image: apiBook.portada,
    rating: apiBook.rating,
    genre: apiBook.generos[0] || 'N/A',
    available: apiBook.cantidad > 0,
    availableCopies: apiBook.cantidad,
  }));
  
  // La paginación ahora usa los datos transformados
  const totalPages = Math.ceil(booksForDisplay.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = booksForDisplay.slice(startIndex, startIndex + booksPerPage);

  const FilterContent = () => (
    // Tu contenido de filtros se mantiene, pero ahora usa los datos de la API
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Género</Label>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{genresFromApi.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Autor</Label>
        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{authorsFromApi.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {/* ... El resto de tu componente FilterContent se mantiene igual ... */}
    </div>
  );

  // --- Renderizado con estados de carga y error ---
  if (isLoading) {
    return <MainLayout><div className="container p-8 text-center">Cargando catálogo desde la base de datos...</div></MainLayout>;
  }
  if (error) {
    return <MainLayout><div className="container p-8 text-center text-red-500">Error al cargar el catálogo: {error}</div></MainLayout>;
  }

  // --- Tu JSX original se mantiene casi idéntico ---
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Catálogo de Libros</h1>
          {/* Usamos los datos reales */}
          <p className="text-muted-foreground">Explora nuestra colección de {allBooksFromApi.length} libros</p>
        </div>
        {/* ... Tu JSX para la barra de búsqueda y el sheet se mantiene igual ... */}
        <div className="flex gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtros</CardTitle>
              </CardHeader>
              <CardContent><FilterContent /></CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Mostrando {paginatedBooks.length} de {filteredBooks.length} resultados
              </p>
            </div>
            {paginatedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Aquí pasamos los datos mapeados al componente BookCard */}
                {paginatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No se encontraron libros con los filtros aplicados</p>
              </div>
            )}
            {/* ... Tu JSX para la paginación se mantiene igual ... */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}