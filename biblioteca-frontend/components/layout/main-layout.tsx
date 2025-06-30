"use client"; // Necesario para usar hooks como useEffect, useRouter, usePathname

import { useAuth } from "@/components/auth/auth-context"; // Importa useAuth para acceder al estado de autenticación
import { useRouter, usePathname } from "next/navigation"; // Importa useRouter para redirección y usePathname para obtener la ruta actual
import { useEffect } from "react"; // Importa useEffect para efectos secundarios
import { Navbar } from "./navbar"; // Tu componente Navbar
import { Footer } from "./footer"; // Tu componente Footer
import { Loader2 } from "lucide-react"; // Importa Loader2 para mostrar un spinner de carga

interface MainLayoutProps {
  children: React.ReactNode;
}

// Define las rutas que requieren autenticación y el rol mínimo necesario.
// Las claves son las rutas y los valores son el rol requerido (string) o null si solo requiere estar logueado.
// Asegúrate de que los nombres de los roles ('Lector', 'Bibliotecario', 'Admin')
// coincidan exactamente con lo que devuelve tu backend en user.rol.
const protectedRoutes: { [key: string]: string | null } = {
  "/lector/panel": "Lector",
  "/lector/historial": "Lector",
  "/lector/multas": "Lector",
  "/lector/prestamos": "Lector",
  "/lector/reservas": "Lector",
  "/admin/panel": "Admin",
  "/admin/usuarios": "Admin",
  "/bibliotecario/panel": "Bibliotecario",
  // Añade aquí todas tus rutas protegidas con su rol mínimo requerido.
  // Si una ruta solo requiere que el usuario esté logueado (sin rol específico), pon null. Ej: "/perfil": null
};

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading: isAuthLoading } = useAuth(); // Obtiene el usuario y el estado de carga de autenticación
  const router = useRouter(); // Instancia del router de Next.js
  const pathname = usePathname(); // Obtiene la ruta actual (ej: /lector/panel)

  useEffect(() => {
    console.log(`AuthGuard useEffect: Pathname: ${pathname}, User:`, user, `IsAuthLoading: ${isAuthLoading}`); // Log al inicio del useEffect

    // 1. Si el estado de autenticación aún está cargando, esperamos.
    // Esto evita redirecciones prematuras o parpadeos.
    if (isAuthLoading) {
      console.log("AuthGuard: Autenticación en curso, esperando...");
      return;
    }

    // 2. Verificar si la ruta actual es una de las rutas que hemos definido como protegidas.
    const requiredRole = protectedRoutes[pathname];

    // 3. Lógica de redirección para rutas protegidas.
    if (requiredRole !== undefined) { // Esta ruta está en la lista de rutas protegidas
      if (!user) {
        // Si la ruta es protegida y no hay usuario, redirigir al login.
        console.log(`AuthGuard: Acceso denegado. Ruta "${pathname}" requiere autenticación. Redirigiendo a /login.`);
        router.replace('/login');
        return;
      }

      // Si hay usuario pero la ruta requiere un rol específico, y el usuario no lo tiene.
      // Asegúrate que user.rol y requiredRole usen el mismo case (ej. 'Admin').
      if (requiredRole !== null && user.rol !== requiredRole) {
        console.warn(`AuthGuard: Acceso denegado. Usuario "${user.nombreCompleto}" con rol "${user.rol}" intentó acceder a "${pathname}" (requiere "${requiredRole}"). Redirigiendo a /.`);
        router.replace('/'); // Redirigir a una página de acceso denegado o al home
        return;
      }
    }
    // Si la ruta no es protegida, o si el usuario cumple los requisitos, no se hace nada
    // y el `children` del layout se renderizará normalmente.
    console.log(`AuthGuard: Finalizado para ${pathname}. User:`, user, `Rol requerido: ${requiredRole || 'N/A'}.`);


  }, [user, isAuthLoading, pathname, router]); // Dependencias del useEffect: se ejecuta cuando cambian estos valores

  // Muestra un spinner de carga mientras la autenticación está en curso (isAuthLoading es true).
  // Esto evita que el contenido de la página parpadee o que se vea contenido no autorizado brevemente.
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Cargando autenticación...</p>
      </div>
    );
  }

  // Si la autenticación ha terminado y no hubo redirección, renderiza el contenido normal de la aplicación.
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children} {/* Aquí se renderiza la página actual (ej. /lector/panel, /login) */}
      </main>
      <Footer />
    </div>
  );
}