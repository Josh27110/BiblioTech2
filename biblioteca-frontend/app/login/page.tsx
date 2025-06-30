"use client"; // Necesario para usar hooks como useState y useEffect

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context"; // Importa el hook useAuth
import { login as apiLogin } from "@/lib/auth"; // Importa la función login que llama a la API

// Importa los componentes de UI que estás usando
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, BookOpen, AlertCircle, Loader2 } from "lucide-react"; // Asegúrate de importar Loader2
import { MainLayout } from "@/components/layout/main-layout"; // Si envuelves tu página de login con MainLayout

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el spinner del botón del formulario
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const router = useRouter();
  // Obtener el usuario, y el estado de carga del contexto de autenticación
  const { login: setAuthUserInContext, user, isLoading: isAuthLoadingContext } = useAuth(); 

  // Este bloque se ejecuta cuando el componente se renderiza.
  // Si el AuthContext ya terminó de cargar y hay un usuario,
  // se asume que el usuario ya está logueado y el MainLayout debería manejar la redirección.
  // Aquí, simplemente mostramos un spinner para evitar que el formulario parpadee mientras se redirige.
  if (!isAuthLoadingContext && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Redirigiendo...</p>
      </div>
    );
  }
  // Si isAuthLoadingContext es true, el MainLayout ya mostrará su Loader global,
  // así que no renderizamos el formulario de login ni este spinner.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Limpiar errores anteriores

    try {
      // 1. Llamar a la función `login` de lib/auth.ts para autenticar al usuario con el backend.
      // Esta función maneja la comunicación con la API y guarda el token en localStorage.
      const loggedInUser = await apiLogin(formData.email, formData.password);

      // 2. Actualizar el contexto global de autenticación con el objeto de usuario recién logueado.
      // Esto hace que el resto de la aplicación (como el Navbar y MainLayout) sepa que hay un usuario activo.
      setAuthUserInContext(loggedInUser);

      // 3. Redirigir al usuario al panel de control apropiado según su rol.
      // El MainLayout actuará como guardián para asegurar que solo los roles correctos accedan.
      switch (loggedInUser.rol) { // Usa loggedInUser.rol para la redirección inmediata
        case "Lector":
          router.replace("/lector/panel");
          break;
        case "Bibliotecario":
          router.replace("/bibliotecario/panel");
          break;
        case "Admin": // Asegúrate de que esta cadena coincida EXACTAMENTE con el rol devuelto por tu backend (ej. "Admin" vs "Administrador")
          router.replace("/admin/panel");
          break;
        default:
          // Si el rol no se reconoce, redirige a una página por defecto (ej. home o un mensaje de error).
          console.warn("Rol de usuario no reconocido:", loggedInUser.rol, "Redirigiendo a /");
          router.replace("/");
          break;
      }

    } catch (err: any) {
      // Manejar errores de login, por ejemplo, credenciales incorrectas o problemas de red.
      setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.");
      console.error("Error en handleSubmit de LoginPage:", err);
    } finally {
      // Restablecer el estado de carga del botón del formulario.
      setIsLoading(false);
    }
  };

  return (
    // Envuelve tu página de login con MainLayout.
    // Esto asegura que la Navbar y el AuthGuard del MainLayout estén presentes.
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
            {/* Bloque de credenciales de prueba, puedes eliminarlo en producción */}
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
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email" type="email" placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required disabled={isLoading} // Deshabilitar mientras se carga
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required disabled={isLoading} // Deshabilitar mientras se carga
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading} // Deshabilitar mientras se carga
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
                    disabled={isLoading} // Deshabilitar mientras se carga
                  />
                  <Label htmlFor="remember" className="text-sm">Recordarme</Label>
                </div>
                <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
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
  );
}