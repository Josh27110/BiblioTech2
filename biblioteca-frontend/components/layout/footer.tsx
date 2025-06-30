"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

export function Footer() {
  const { user } = useAuth()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">BiblioTech</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema moderno de gestión bibliotecaria para una experiencia de lectura excepcional.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              {user?.role !== "admin" && (
                <li>
                  <Link href="/catalogo" className="text-muted-foreground hover:text-primary transition-colors">
                    Catálogo
                  </Link>
                </li>
              )}
              <li>
                <Link href="/ayuda" className="text-muted-foreground hover:text-primary transition-colors">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 info@bibliotech.com</p>
              <p>📞 +52 55 1234 5678</p>
              <p>📍 Ciudad de México, México</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BiblioTech. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
