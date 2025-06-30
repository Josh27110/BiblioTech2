"use client"; // Necesario para usar hooks como useState y useEffect

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, History, Clock, AlertTriangle, Calendar, Search, ArrowRight, User } from "lucide-react";
import Link from "next/link";

// Definimos una interfaz para los datos que esperamos del backend
interface SummaryData {
  nombreCompleto: string;
  prestamosActivos: number;
  multasActivas: number;
  reservasPendientes: number;
  totalPrestados: number;
}

export default function LectorPanelPage() {
  const { user } = useAuth(); // Obtenemos el usuario del contexto
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener los datos del panel desde la API
    const fetchPanelSummary = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }

        const response = await fetch('http://localhost:5000/api/v1/lector/panel/summary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "No se pudo obtener la información del panel.");
        }

        const data: SummaryData = await response.json();
        setSummaryData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanelSummary();
  }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez

  // El arreglo de opciones ahora es una variable dentro del componente
  // para que pueda acceder a `summaryData`
  const dashboardOptions = [
    {
      id: "catalogo",
      title: "Consultar Catálogo",
      description: "Busca y explora todos los libros disponibles en la biblioteca",
      icon: Search,
      href: "/catalogo",
      color: "bg-blue-500",
      case: "CU6",
    },
    {
      id: "historial",
      title: "Historial de Préstamos",
      description: "Revisa todos los libros que has tomado prestados anteriormente",
      icon: History,
      href: "/lector/historial",
      color: "bg-green-500",
      case: "CU7",
    },
    {
      id: "prestamos",
      title: "Préstamos Activos",
      description: "Gestiona tus préstamos actuales y renueva si es necesario",
      icon: Clock,
      href: "/lector/prestamos",
      color: "bg-orange-500",
      case: "CU8",
      badge: summaryData && summaryData.prestamosActivos > 0 ? summaryData.prestamosActivos : undefined,
    },
    {
      id: "multas",
      title: "Gestionar Multas",
      description: "Revisa y paga las multas pendientes por retrasos",
      icon: AlertTriangle,
      href: "/lector/multas",
      color: "bg-red-500",
      case: "CU9",
      badge: summaryData && summaryData.multasActivas > 0 ? summaryData.multasActivas : undefined,
    },
    {
      id: "reservas",
      title: "Gestionar Reservas",
      description: "Administra tus reservas de libros y consulta tu posición en la lista",
      icon: Calendar,
      href: "/lector/reservas",
      color: "bg-purple-500",
      case: "CU10",
      badge: summaryData && summaryData.reservasPendientes > 0 ? summaryData.reservasPendientes : undefined,
    },
  ];
  
  // Renderiza un estado de carga mientras se obtienen los datos
  if (isLoading) {
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
        </div>
      </MainLayout>
    );
  }

  // Renderiza un estado de error si la llamada a la API falla
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-red-500">Error al Cargar el Panel</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Intentar de Nuevo
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Renderiza el panel con los datos reales
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel del Lector</h1>
              <p className="text-muted-foreground">Bienvenido, {summaryData?.nombreCompleto || 'Lector'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Préstamos Activos</p>
                  <p className="text-2xl font-bold">{summaryData?.prestamosActivos ?? 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas Pendientes</p>
                  <p className="text-2xl font-bold">{summaryData?.reservasPendientes ?? 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Multas Pendientes</p>
                  <p className="text-2xl font-bold">{summaryData?.multasActivas ?? 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Prestados</p>
                  <p className="text-2xl font-bold">{summaryData?.totalPrestados ?? 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Opciones Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardOptions.map((option) => (
              <Card key={option.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${option.color} text-white`}>
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {option.case}
                      </Badge>
                      {option.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{option.title}</CardTitle>
                  <CardDescription className="text-sm">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                    <Link href={option.href} className="flex items-center justify-center gap-2">
                      Acceder
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/catalogo">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Libros
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/lector/prestamos">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Préstamos
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/perfil">
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}