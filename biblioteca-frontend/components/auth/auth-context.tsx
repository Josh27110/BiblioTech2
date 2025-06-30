// components/auth/auth-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser, logout as authLogout } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("AuthContext: Efecto de inicialización, llamando getCurrentUser.");
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
    console.log("AuthContext: Inicialización completada. User:", currentUser, "IsLoading:", false);
  }, [])

  const login = (loggedInUser: User) => {
    console.log("AuthContext: Función login llamada, actualizando user en contexto:", loggedInUser);
    setUser(loggedInUser);
    // Asegurarse de que isLoading sea false si el login termina aquí
    setIsLoading(false); 
  }

  const logout = () => {
    console.log("AuthContext: Función logout llamada, limpiando contexto.");
    authLogout() // Llama a la función de logout real que limpia localStorage
    setUser(null)
    setIsLoading(false); // Asegurarse de que isLoading sea false después de logout
  }

  console.log("AuthContext Render: Estado actual -> User:", user, "IsLoading:", isLoading);

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}