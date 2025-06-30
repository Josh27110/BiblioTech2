// app/login/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"

// Importamos las funciones de nuestro sistema de autenticación real
import { login } from "@/lib/auth"
import { useAuth } from "@/components/auth/auth-context"

export default function LoginPage() {
  // Estados para manejar el formulario y la UI (tu código original)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const router = useRouter()
  const { login: authLogin } = useAuth() // Obtenemos la función para actualizar el contexto

  // --- ESTA ES LA FUNCIÓN CORREGIDA Y COMPLETA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 1. Llamamos a nuestra función `login` de lib/auth.ts, que habla con el backend
      const user = await login(formData.email, formData.password)

      if (user) {
        // 2. Si el login es exitoso, actualizamos nuestro contexto global
        authLogin(user)
        
        // 3. ¡AQUÍ ESTÁ LA LÓGICA CLAVE! Redirigimos según el rol del usuario
        switch (user.rol) { // Usamos 'rol' como lo devuelve nuestro backend
          case "Lector":
            router.push("/lector/panel")
            break
          case "Bibliotecario":
            router.push("/bibliotecario/panel")
            break
          case "Admin":
            router.push("/admin/panel")
            break
          default:
            router.push("/") // Si el rol no se reconoce, va a la página principal
        }
      } else {
        // Esto no debería pasar si la función login lanza un error, pero es una salvaguarda
        setError("Credenciales incorrectas. Verifica tu email y contraseña.")
      }
    } catch (err) {
      // Si la función login de lib/auth.ts lanza un error, lo atrapamos aquí
      setError(err instanceof Error ? err.message : "Error al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tu JSX original se mantiene intacto. No se necesita ningún cambio visual.
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa a tu cuenta para acceder a todos los servicios</CardDescription>
          </CardHeader>
          <CardContent>
            {/* El bloque de credenciales de prueba se puede eliminar si ya no lo necesitas */}
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Usuario de prueba:</p>
              <div className="text-xs space-y-1">
                <p>Usa cualquier usuario que hayas registrado.</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Todos tus inputs, labels y botones se mantienen exactamente igual */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email" type="email" placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required disabled={isLoading}
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm">Recordarme</Label>
                </div>
                <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/registro" className="text-primary hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}