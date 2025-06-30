// app/registro/page.tsx
"use client"

import type React from "react"
import { useState, FormEvent } from "react"
import { useRouter } from 'next/navigation'
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"

export default function RegistroPage() {
  // Tu estado y lógica original para el formulario y las contraseñas se mantiene
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    genero: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // --- NUEVO: Estados para manejar la comunicación con la API ---
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Tu función para formatear el teléfono se mantiene igual
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 8) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`;
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, telefono: formatted })
  }

  // --- MODIFICADO: La función handleSubmit ahora es asíncrona y llama a la API ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones locales
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          fecha_nacimiento: formData.fechaNacimiento,
          direccion: formData.direccion,
          genero: formData.genero,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "No se pudo completar el registro.")
      }

      alert("¡Registro exitoso! Serás redirigido para iniciar sesión.")
      router.push("/login")

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tu JSX original se mantiene intacto. Solo se añade el div para el error
  // y la lógica para deshabilitar el botón
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte como nuevo lector</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Tu estructura de grid con todos los Inputs y Selects va aquí, sin cambios --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" placeholder="Tu nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
                  <Input id="apellidoPaterno" placeholder="Apellido paterno" value={formData.apellidoPaterno} onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                <Input id="apellidoMaterno" placeholder="Apellido materno" value={formData.apellidoMaterno} onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="+52 55 4891 6619" value={formData.telefono} onChange={handlePhoneChange} maxLength={17} />
                  <p className="text-xs text-muted-foreground">Formato: +52 55 4891 6619</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Tu dirección completa" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona tu género" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ... Tu JSX de CAPTCHA Placeholder va aquí ... */}

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })} required />
                <Label htmlFor="terms" className="text-sm"> Acepto los{" "}<Link href="/terminos" className="text-primary hover:underline">términos y condiciones</Link>{" "} y la{" "}<Link href="/privacidad" className="text-primary hover:underline">política de privacidad</Link></Label>
              </div>

              {/* --- NUEVO: Espacio para mostrar errores de la API --- */}
              {error && (
                <div className="p-3 my-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground"> ¿Ya tienes una cuenta?{" "}<Link href="/login" className="text-primary hover:underline">Inicia sesión aquí</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}