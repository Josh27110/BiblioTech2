// lib/auth.ts
"use client";

import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  rol: string;
  nombreCompleto?: string; // Asegúrate de que este campo coincida con lo que el backend envía
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
      console.error("API Login Error:", errorData.message || "Credenciales inválidas"); // Log de error
      throw new Error(errorData.message || "Credenciales inválidas");
    }

    const data = await response.json();
    const { access_token, user } = data;

    if (typeof window !== "undefined") {
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user)); // Guardamos el objeto user tal cual
      console.log("auth.ts: Login exitoso. Token y usuario guardados.", { user, access_token }); // Log de éxito
    }
    
    return user;

  } catch (error) {
    console.error("Error en la función login (lib/auth.ts):", error);
    logout(); // Asegúrate de que logout se llama aquí para limpiar el estado
    throw error;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    console.log("auth.ts: Ejecutando logout, limpiando localStorage."); // Log de logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    console.log("getCurrentUser: Ejecutando en servidor (SSR), retornando null."); // Log de SSR
    return null;
  }

  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  console.log("getCurrentUser: Verificando sesión. Token presente:", !!token, "Usuario string presente:", !!userStr);
  
  if (!token || !userStr) {
    console.log("getCurrentUser: Sesión no válida (falta token o usuario). Limpiando y retornando null.");
    logout(); // Limpiar por si acaso
    return null;
  }

  // Ahora validamos que el token no haya expirado, por seguridad
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now();
    const tokenExp = decodedToken.exp * 1000;

    console.log(`getCurrentUser: Token expira en: ${new Date(tokenExp).toLocaleString()} CST. Tiempo actual: ${new Date(currentTime).toLocaleString()} CST. Expirado: ${currentTime >= tokenExp}`); [cite_start]// [cite: 1]

    if (currentTime >= tokenExp) {
      console.log("getCurrentUser: Token expirado. Limpiando sesión y retornando null.");
      logout();
      return null;
    }
  } catch (error) {
    console.error("getCurrentUser: Error al decodificar/validar token. Limpiando sesión y retornando null.", error);
    logout();
    return null;
  }

  try {
    const parsedUser = JSON.parse(userStr) as User;
    console.log("getCurrentUser: Usuario parseado de localStorage:", parsedUser);
    // Opcional: una verificación adicional del rol o ID si es crítico
    if (!parsedUser || !parsedUser.id || !parsedUser.rol) {
      console.error("getCurrentUser: Objeto de usuario inválido en localStorage. Limpiando sesión.");
      logout();
      return null;
    }
    return parsedUser;
  } catch (error) {
    console.error("getCurrentUser: Error al parsear usuario de localStorage. Limpiando sesión.", error);
    logout();
    return null;
  }
}