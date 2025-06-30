"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel, // Asegúrate de importar DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, Menu, User, LogOut, Settings, UserCircle, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-context" // Asegúrate de que useAuth esté importado

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading } = useAuth() // Obtén el usuario, la función de logout y el estado de carga
  const router = useRouter()

  // Función para manejar el clic en el logo BiblioTech y en "Mi Panel" del menú desplegable
  const handlePanelOrLogoClick = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Previene la navegación por defecto del Link

    if (isLoading) {
      // Si la autenticación aún está cargando, no hacemos nada
      console.log("Autenticación en curso, esperando para redirigir...");
      return;
    }

    let targetPath = "/"; // Ruta por defecto si no hay usuario o rol desconocido
    if (user) {
      // Determina la ruta del panel basada en el rol del usuario logueado
      switch (user.rol) { // Usa user.rol para la lógica de roles
        case "Lector":
          targetPath = "/lector/panel";
          break;
        case "Bibliotecario":
          targetPath = "/bibliotecario/panel";
          break;
        case "Admin":
          targetPath = "/admin/panel";
          break;
        default:
          targetPath = "/"; // Fallback
      }
    } else {
      targetPath = "/login"; // Si no hay usuario logueado, ir a login
    }

    // Compara la ruta actual con la ruta objetivo
    if (router.pathname === targetPath) {
      // Si ya estamos en la ruta de destino, forzamos una recarga completa para refrescar el dashboard
      window.location.reload();
    } else {
      // Si no estamos en la ruta de destino, navegamos normalmente
      router.push(targetPath);
    }
  };

  // Función para manejar el cierre de sesión desde el menú desplegable
  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    router.push('/login'); // Redirige al usuario a la página de login después de cerrar sesión
  };

  const NavLinks = () => (
    <>
      {/* Solo mostrar catálogo si NO es admin (asumiendo que 'rol' del user es el atributo) */}
      {user?.rol !== "Admin" && (
        <Link href="/catalogo" className="text-foreground hover:text-primary transition-colors">
          Catálogo
        </Link>
      )}
      {!user && (
        <>
          <Link href="/login">
            <Button variant="ghost">Iniciar Sesión</Button>
          </Link>
          <Link href="/registro">
            <Button>Registrarse</Button>
          </Link>
        </>
      )}
    </>
  )

  const UserMenu = () => {
    if (!user) return null

    // Usar user.rol para la lógica de roles
    const getPanelLink = () => {
      switch (user.rol) { // Usar user.rol
        case "Lector":
          return "/lector/panel"
        case "Bibliotecario":
          return "/bibliotecario/panel"
        case "Admin":
          return "/admin/panel"
        default:
          return "/"
      }
    }

    const getPanelIcon = () => {
      switch (user.rol) { // Usar user.rol
        case "Admin":
          return <Shield className="h-4 w-4" />
        default:
          return <Settings className="h-4 w-4" />
      }
    }

    const getPanelLabel = () => {
      switch (user.rol) { // Usar user.rol
        case "Admin":
          return "Panel de Admin"
        case "Bibliotecario":
          return "Panel de Bibliotecario"
        default:
          return "Mi Panel"
      }
    }

    return (
      <DropdownMenu>
        {/*
          Aquí es donde el error "MenuButton must be used within Menu" suele ocurrir.
          Asegúrate de que <DropdownMenuTrigger> tenga un componente válido como hijo.
          El 'asChild' le dice que reenvíe sus props al hijo directo.
          Si el error persiste con el Button, el problema está en la implementación de tu Button
          o en cómo interactúa con 'asChild' en tu versión de shadcn/ui.
          La solución más simple si Button da problemas es usar un div o span con 'role="button"'.
        */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">{user.nombreCompleto || user.rol}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.nombreCompleto}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.rol}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Usamos onClick para el manejo de eventos en DropdownMenuItem */}
          <DropdownMenuItem onClick={(e) => handlePanelOrLogoClick(e as any)} className="flex items-center gap-2">
            {getPanelIcon()}
            {getPanelLabel()}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/perfil" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Mi Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo BiblioTech */}
          {/* Aquí el Link del logo llama a handlePanelOrLogoClick para manejar la redirección y recarga */}
          <Link
            href={user ? (user.rol === "Lector" ? "/lector/panel" : user.rol === "Bibliotecario" ? "/bibliotecario/panel" : user.rol === "Admin" ? "/admin/panel" : "/") : "/"}
            onClick={handlePanelOrLogoClick} // Usa el nuevo handler para el logo
            className="flex items-center gap-2 font-bold text-xl"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span>BiblioTech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <UserMenu />
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                  {user && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-4 w-4" />
                        <span>{user.nombreCompleto || user.rol}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Enlace al panel en móvil también usa el handler para la recarga */}
                        <DropdownMenuItem onClick={(e) => handlePanelOrLogoClick(e as any)} className="w-full justify-start">
                          {user.rol === "Admin" ? (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Panel de Admin
                            </>
                          ) : (
                            <>
                              <Settings className="h-4 w-4 mr-2" />
                              Mi Panel
                            </>
                          )}
                        </DropdownMenuItem>
                        <Link href="/perfil">
                          <Button variant="ghost" className="w-full justify-start">
                            <UserCircle className="h-4 w-4 mr-2" />
                            Mi Perfil
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}