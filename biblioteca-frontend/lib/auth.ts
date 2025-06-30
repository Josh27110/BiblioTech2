// lib/auth.ts
"use client";

import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  rol: string;
  nombreCompleto?: string; // Cambiamos 'name' por 'nombreCompleto' para que coincida con tu backend
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Credenciales inválidas");
    }

    const data = await response.json();
    const { access_token, user } = data;

    if (typeof window !== "undefined") {
      // 1. Guardamos el TOKEN
      localStorage.setItem('authToken', access_token);
      // 2. ¡NUEVO! Guardamos el OBJETO DE USUARIO COMPLETO como un string JSON
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return user;

  } catch (error) {
    console.error("Error en el login:", error);
    logout(); 
    throw error;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    // ¡NUEVO! También limpiamos el objeto de usuario al hacer logout
    localStorage.removeItem("user");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("authToken");
  // ¡NUEVO! Obtenemos el usuario guardado
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    // Si falta el token O el usuario, la sesión no es válida
    logout();
    return null;
  }

  // Ahora validamos que el token no haya expirado, por seguridad
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    if (Date.now() >= decodedToken.exp * 1000) {
      console.log("Token expirado, cerrando sesión.");
      logout();
      return null;
    }
  } catch (error) {
    console.error("Token inválido, cerrando sesión.", error);
    logout();
    return null;
  }

  // Si el token es válido, devolvemos el objeto de usuario que guardamos
  // Esto preserva toda la información, incluido el nombre.
  return JSON.parse(userStr) as User;
}

// La función de ayuda 'getCurrentUserFromToken' ya no es necesaria 
// para la lógica principal, la hemos integrado en 'getCurrentUser'.