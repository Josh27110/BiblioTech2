"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Settings,
  CreditCard,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"

export default function PerfilPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Estados para los formularios - dinámicos según el usuario
  const [personalInfo, setPersonalInfo] = useState({
    nombre: user?.role === "admin" ? "Carlos" : user?.role === "bibliotecario" ? "María" : "Juan",
    apellidoPaterno: user?.role === "admin" ? "Rodríguez" : user?.role === "bibliotecario" ? "González" : "Pérez",
    apellidoMaterno: user?.role === "admin" ? "Martín" : user?.role === "bibliotecario" ? "López" : "García",
    email:
      user?.role === "admin"
        ? "admin@biblioteca.com"
        : user?.role === "bibliotecario"
          ? "bibliotecario@biblioteca.com"
          : "lector@biblioteca.com",
    telefono:
      user?.role === "admin"
        ? "+52 55 3456 7890"
        : user?.role === "bibliotecario"
          ? "+52 55 2345 6789"
          : "+52 55 1234 5678",
    direccion:
      user?.role === "admin"
        ? "Av. Insurgentes 789, Col. Condesa, Ciudad de México"
        : user?.role === "bibliotecario"
          ? "Calle Reforma 456, Col. Roma, Ciudad de México"
          : "Av. Universidad 123, Col. Centro, Ciudad de México",
    fechaNacimiento:
      user?.role === "admin" ? "1978-12-03" : user?.role === "bibliotecario" ? "1985-08-22" : "1990-05-15",
    genero: "masculino",
    ocupacion:
      user?.role === "admin"
        ? "Administrador de Sistemas"
        : user?.role === "bibliotecario"
          ? "Bibliotecaria Profesional"
          : "Ingeniero de Software",
    biografia:
      user?.role === "admin"
        ? "Administrador del sistema bibliotecario con más de 15 años de experiencia en gestión de bibliotecas digitales y sistemas de información."
        : user?.role === "bibliotecario"
          ? "Bibliotecaria profesional especializada en catalogación y atención al usuario. Apasionada por promover la lectura en la comunidad."
          : "Apasionado por la lectura y la tecnología. Me encantan los libros de ciencia ficción y desarrollo de software.",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    notificacionesEmail: true,
    notificacionesSMS: false,
    recordatoriosVencimiento: true,
    recomendacionesPersonalizadas: true,
    newsletterBiblioteca: true,
    idiomaInterfaz: "es",
    temaOscuro: false,
    privacidadPerfil: "publico",
  })

  // Información de la cuenta (solo lectura) - dinámica según el rol
  const accountInfo = {
    numeroUsuario: user?.role === "admin" ? "ADM-001001" : user?.role === "bibliotecario" ? "BIB-001002" : "USR-001234",
    fechaRegistro: user?.role === "admin" ? "2022-01-10" : user?.role === "bibliotecario" ? "2022-11-08" : "2023-03-15",
    estadoCuenta: "activa",
    tipoUsuario: user?.role === "admin" ? "Administrador" : user?.role === "bibliotecario" ? "Bibliotecario" : "Lector",
    prestamosRealizados: user?.role === "admin" ? 0 : user?.role === "bibliotecario" ? 0 : 47,
    multasPagadas: user?.role === "admin" ? 0 : user?.role === "bibliotecario" ? 0 : 2,
    calificacionPromedio: user?.role === "admin" ? 0 : user?.role === "bibliotecario" ? 0 : 4.8,
    ultimoAcceso: "2024-12-29 14:30",
    // Estadísticas específicas para admin
    usuariosGestionados: user?.role === "admin" ? 1247 : 0,
    librosGestionados: user?.role === "admin" ? 5832 : user?.role === "bibliotecario" ? 2156 : 0,
    prestamosSupervisionados: user?.role === "admin" ? 15420 : user?.role === "bibliotecario" ? 8934 : 0,
    multasGestionadas: user?.role === "admin" ? 234 : user?.role === "bibliotecario" ? 156 : 0,
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) {
      return `+${numbers}`
    } else if (numbers.length <= 4) {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`
    } else if (numbers.length <= 8) {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`
    } else {
      return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPersonalInfo({ ...personalInfo, telefono: formatted })
  }

  const handleSavePersonalInfo = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validar teléfono si está presente
      if (personalInfo.telefono) {
        const phoneRegex = /^\+52 \d{2} \d{4} \d{4}$/
        if (!phoneRegex.test(personalInfo.telefono)) {
          throw new Error("El formato del teléfono debe ser: +52 55 1234 5678")
        }
      }

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage("Información personal actualizada correctamente")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al actualizar la información")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validaciones
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error("Todos los campos de contraseña son obligatorios")
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("Las contraseñas nuevas no coinciden")
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres")
      }

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage("Contraseña actualizada correctamente")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error al cambiar la contraseña")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage("Preferencias guardadas correctamente")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage("Error al guardar las preferencias")
      setTimeout(() => setErrorMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activa":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Activa
          </Badge>
        )
      case "suspendida":
        return <Badge variant="destructive">Suspendida</Badge>
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={
                user?.role === "lector"
                  ? "/lector/panel"
                  : user?.role === "bibliotecario"
                    ? "/bibliotecario/panel"
                    : user?.role === "admin"
                      ? "/admin/panel"
                      : "/"
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Información básica del usuario */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Foto de perfil" />
                  <AvatarFallback className="text-lg">
                    {personalInfo.nombre.charAt(0)}
                    {personalInfo.apellidoPaterno.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar Foto
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {personalInfo.nombre} {personalInfo.apellidoPaterno} {personalInfo.apellidoMaterno}
                </h2>
                <p className="text-muted-foreground mb-2">{personalInfo.email}</p>
                <div className="flex flex-wrap gap-2">
                  {getEstadoBadge(accountInfo.estadoCuenta)}
                  <Badge variant="outline">{accountInfo.tipoUsuario}</Badge>
                  <Badge variant="outline">Usuario #{accountInfo.numeroUsuario}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
            <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
            <TabsTrigger value="cuenta">Mi Cuenta</TabsTrigger>
          </TabsList>

          {/* Tab: Información Personal */}
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={personalInfo.nombre}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, nombre: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
                    <Input
                      id="apellidoPaterno"
                      value={personalInfo.apellidoPaterno}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, apellidoPaterno: e.target.value })}
                      placeholder="Apellido paterno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="apellidoMaterno"
                    value={personalInfo.apellidoMaterno}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, apellidoMaterno: e.target.value })}
                    placeholder="Apellido materno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="telefono"
                        value={personalInfo.telefono}
                        onChange={handlePhoneChange}
                        placeholder="+52 55 1234 5678"
                        className="pl-10"
                        maxLength={17}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Formato: +52 55 1234 5678</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={personalInfo.fechaNacimiento}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fechaNacimiento: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                    <Textarea
                      id="direccion"
                      value={personalInfo.direccion}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, direccion: e.target.value })}
                      placeholder="Tu dirección completa"
                      className="pl-10 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select
                      value={personalInfo.genero}
                      onValueChange={(value) => setPersonalInfo({ ...personalInfo, genero: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                        <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ocupacion">Ocupación</Label>
                    <Input
                      id="ocupacion"
                      value={personalInfo.ocupacion}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, ocupacion: e.target.value })}
                      placeholder="Tu ocupación"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biografia">Biografía</Label>
                  <Textarea
                    id="biografia"
                    value={personalInfo.biografia}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, biografia: e.target.value })}
                    placeholder="Cuéntanos un poco sobre ti y tus intereses de lectura..."
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{personalInfo.biografia.length}/500 caracteres</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePersonalInfo} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Seguridad */}
          <TabsContent value="seguridad" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad de la Cuenta
                </CardTitle>
                <CardDescription>Cambia tu contraseña y gestiona la seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual *</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Tu contraseña actual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Consejos de seguridad:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Usa una contraseña única que no uses en otros sitios</li>
                      <li>Incluye mayúsculas, minúsculas, números y símbolos</li>
                      <li>Evita información personal como nombres o fechas</li>
                      <li>Cambia tu contraseña regularmente</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Shield className="h-4 w-4 mr-2 animate-spin" />
                        Cambiando...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Cambiar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Preferencias */}
          <TabsContent value="preferencias" className="mt-6">
            <div className="space-y-6">
              {/* Notificaciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones
                  </CardTitle>
                  <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones importantes en tu correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificacionesEmail}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, notificacionesEmail: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe recordatorios urgentes en tu teléfono móvil
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notificacionesSMS}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, notificacionesSMS: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios de Vencimiento</Label>
                      <p className="text-sm text-muted-foreground">Te avisamos cuando tus préstamos estén por vencer</p>
                    </div>
                    <Switch
                      checked={preferences.recordatoriosVencimiento}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, recordatoriosVencimiento: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recomendaciones Personalizadas</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe sugerencias de libros basadas en tus gustos
                      </p>
                    </div>
                    <Switch
                      checked={preferences.recomendacionesPersonalizadas}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, recomendacionesPersonalizadas: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter de la Biblioteca</Label>
                      <p className="text-sm text-muted-foreground">
                        Mantente al día con eventos y novedades de la biblioteca
                      </p>
                    </div>
                    <Switch
                      checked={preferences.newsletterBiblioteca}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, newsletterBiblioteca: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Interfaz */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Interfaz y Experiencia
                  </CardTitle>
                  <CardDescription>Personaliza cómo se ve y funciona la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="idioma">Idioma de la Interfaz</Label>
                    <Select
                      value={preferences.idiomaInterfaz}
                      onValueChange={(value) => setPreferences({ ...preferences, idiomaInterfaz: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tema Oscuro</Label>
                      <p className="text-sm text-muted-foreground">Usa colores oscuros para reducir la fatiga visual</p>
                    </div>
                    <Switch
                      checked={preferences.temaOscuro}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, temaOscuro: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacidad">Privacidad del Perfil</Label>
                    <Select
                      value={preferences.privacidadPerfil}
                      onValueChange={(value) => setPreferences({ ...preferences, privacidadPerfil: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publico">Público</SelectItem>
                        <SelectItem value="amigos">Solo Amigos</SelectItem>
                        <SelectItem value="privado">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Controla quién puede ver tu actividad de lectura y reseñas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Preferencias
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Mi Cuenta */}
          <TabsContent value="cuenta" className="mt-6">
            <div className="space-y-6">
              {/* Información de la cuenta */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Información de la Cuenta
                  </CardTitle>
                  <CardDescription>Detalles de tu cuenta y estadísticas de uso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Número de Usuario:</span>
                        <span className="font-medium">{accountInfo.numeroUsuario}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de Registro:</span>
                        <span className="font-medium">{formatDate(accountInfo.fechaRegistro)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado de la Cuenta:</span>
                        {getEstadoBadge(accountInfo.estadoCuenta)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Usuario:</span>
                        <Badge variant="outline">{accountInfo.tipoUsuario}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Último Acceso:</span>
                        <span className="font-medium">{accountInfo.ultimoAcceso}</span>
                      </div>
                      {user?.role === "admin" ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Usuarios Gestionados:</span>
                            <span className="font-medium">{accountInfo.usuariosGestionados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Libros en Sistema:</span>
                            <span className="font-medium">{accountInfo.librosGestionados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Multas Gestionadas:</span>
                            <span className="font-medium">{accountInfo.multasGestionadas}</span>
                          </div>
                        </>
                      ) : user?.role === "bibliotecario" ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Libros Catalogados:</span>
                            <span className="font-medium">{accountInfo.librosGestionados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Préstamos Gestionados:</span>
                            <span className="font-medium">{accountInfo.prestamosSupervisionados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Multas Procesadas:</span>
                            <span className="font-medium">{accountInfo.multasGestionadas}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Préstamos Realizados:</span>
                            <span className="font-medium">{accountInfo.prestamosRealizados}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Multas Pagadas:</span>
                            <span className="font-medium">{accountInfo.multasPagadas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Calificación Promedio:</span>
                            <span className="font-medium">{accountInfo.calificacionPromedio}/5.0</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de lectura/gestión */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {user?.role === "admin"
                      ? "Estadísticas Administrativas"
                      : user?.role === "bibliotecario"
                        ? "Estadísticas de Gestión"
                        : "Estadísticas de Lectura"}
                  </CardTitle>
                  <CardDescription>
                    {user?.role === "admin"
                      ? "Tu actividad administrativa en números"
                      : user?.role === "bibliotecario"
                        ? "Tu actividad de gestión en números"
                        : "Tu actividad de lectura en números"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {user?.role === "admin" ? (
                      <>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{accountInfo.usuariosGestionados}</div>
                          <div className="text-sm text-muted-foreground">Usuarios Gestionados</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{accountInfo.librosGestionados}</div>
                          <div className="text-sm text-muted-foreground">Libros en Sistema</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {accountInfo.prestamosSupervisionados}
                          </div>
                          <div className="text-sm text-muted-foreground">Préstamos Supervisados</div>
                        </div>
                      </>
                    ) : user?.role === "bibliotecario" ? (
                      <>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{accountInfo.librosGestionados}</div>
                          <div className="text-sm text-muted-foreground">Libros Catalogados</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {accountInfo.prestamosSupervisionados}
                          </div>
                          <div className="text-sm text-muted-foreground">Préstamos Gestionados</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{accountInfo.multasGestionadas}</div>
                          <div className="text-sm text-muted-foreground">Multas Procesadas</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{accountInfo.prestamosRealizados}</div>
                          <div className="text-sm text-muted-foreground">Libros Leídos</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">156</div>
                          <div className="text-sm text-muted-foreground">Días de Lectura</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">12</div>
                          <div className="text-sm text-muted-foreground">Géneros Explorados</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Acciones de cuenta */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                  <CardDescription>Acciones irreversibles que afectan tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¡Atención!</strong> Las siguientes acciones son permanentes y no se pueden deshacer.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                      Desactivar Cuenta Temporalmente
                    </Button>
                    <Button variant="destructive">Eliminar Cuenta Permanentemente</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
