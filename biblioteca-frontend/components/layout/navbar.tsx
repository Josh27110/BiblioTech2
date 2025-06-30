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
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, Menu, User, LogOut, Settings, UserCircle, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const NavLinks = () => (
    <>
      {/* Solo mostrar catálogo si NO es admin */}
      {user?.role !== "admin" && (
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

    const getPanelLink = () => {
      switch (user.role) {
        case "lector":
          return "/lector/panel"
        case "bibliotecario":
          return "/bibliotecario/panel"
        case "admin":
          return "/admin/panel"
        default:
          return "/"
      }
    }

    const getPanelIcon = () => {
      switch (user.role) {
        case "admin":
          return <Shield className="h-4 w-4" />
        default:
          return <Settings className="h-4 w-4" />
      }
    }

    const getPanelLabel = () => {
      switch (user.role) {
        case "admin":
          return "Panel de Admin"
        case "bibliotecario":
          return "Panel de Bibliotecario"
        default:
          return "Mi Panel"
      }
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href={getPanelLink()} className="flex items-center gap-2">
              {getPanelIcon()}
              {getPanelLabel()}
            </Link>
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
          {/* Logo */}
          {user ? (
            <Link
              href={
                user.role === "lector"
                  ? "/lector/panel"
                  : user.role === "bibliotecario"
                    ? "/bibliotecario/panel"
                    : user.role === "admin"
                      ? "/admin/panel"
                      : "/"
              }
              className="flex items-center gap-2 font-bold text-xl"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span>BiblioTech</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>BiblioTech</span>
            </Link>
          )}

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
                        <span>{user.name}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={
                            user.role === "lector"
                              ? "/lector/panel"
                              : user.role === "bibliotecario"
                                ? "/bibliotecario/panel"
                                : user.role === "admin"
                                  ? "/admin/panel"
                                  : "/"
                          }
                        >
                          <Button variant="ghost" className="w-full justify-start">
                            {user.role === "admin" ? (
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
                          </Button>
                        </Link>
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
