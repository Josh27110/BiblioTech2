# Sistema de Gestión de Biblioteca 📖

<p align="center">
  <strong>Una plataforma web moderna para la administración eficiente de bibliotecas.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/estado-en%20desarrollo-yellow" alt="Estado del Proyecto">
  <img src="https://img.shields.io/badge/licencia-MIT-blue" alt="Licencia MIT">
</p>

## Resumen del Proyecto

¡Bienvenido al **Sistema de Gestión de Biblioteca**! Esta es una plataforma digital diseñada para optimizar y automatizar los procesos clave de una biblioteca: el préstamo de materiales, el control de usuarios, la administración del catálogo y la aplicación de políticas internas.

El sistema está construido con una arquitectura web moderna, utilizando **Next.js (React)** para el frontend y **Flask (Python)** para el backend, con **MySQL** como base de datos.

## 📋 Tabla de Contenidos

1.  [📚 Características Principales](#-características-principales)
2.  [🚀 Tecnologías Utilizadas](#-tecnologías-utilizadas)
3.  [⚙️ Requisitos Previos](#️-requisitos-previos)
4.  [🏁 Instalación y Ejecución](#-instalación-y-ejecución)
5.  [📂 Estructura del Proyecto](#-estructura-del-proyecto)
6.  [🔒 Credenciales de Prueba](#-credenciales-de-prueba)
7.  [🤝 Contribuciones](#-contribuciones)
8.  [📄 Licencia](#-licencia)

## 📚 Características Principales

El sistema ofrece funcionalidades seguras y diferenciadas para tres roles de usuario, garantizando un acceso controlado a las operaciones.

### Roles de Usuario

* **👤 Administrador:**
    * Gestión de alto nivel de cuentas de usuario (crear, editar, eliminar).
    * Configuración de parámetros globales del sistema (ej. multas, periodos de préstamo).
    * No participa en las operaciones diarias.
* **🧑‍💼 Bibliotecario:**
    * Responsable de las operaciones diarias de la biblioteca.
    * Gestiona préstamos, devoluciones y aplicación de multas.
    * Actualiza el inventario y el catálogo de materiales.
* **🙋 Lector:**
    * Usuario final del sistema.
    * Puede registrarse, solicitar préstamos, renovar materiales y consultar su historial.
    * Interactúa con el catálogo para buscar y encontrar materiales.

### Módulos Principales

* **Gestión de Usuarios:** Registro, autenticación, edición y eliminación de cuentas.
* **Gestión de Materiales:** CRUD completo para libros, revistas y otros ítems del catálogo.
* **Gestión de Préstamos:** Flujo completo de solicitud, renovación y devolución de materiales.
* **Gestión de Multas:** Cálculo, visualización y registro de pagos de multas por retraso.
* **Consultas e Historial:** Acceso para los lectores a su historial de actividades y al catálogo.

## 🚀 Tecnologías Utilizadas

| Componente    | Tecnología                                                                                                                                                                                                   | Descripción                                                                 |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Frontend** | **Next.js (React), TypeScript, Tailwind CSS** | Para una interfaz de usuario moderna, reactiva y estilizada.                |
| **Backend** | **Python, Flask, SQLAlchemy** | Para construir una API RESTful ligera, rápida y escalable.                  |
| **Base de Datos** | **MySQL** | Sistema de gestión de base de datos relacional, robusto y confiable.        |
| **Autenticación** | **Flask-JWT-Extended, Bcrypt** | Implementación de autenticación segura basada en JSON Web Tokens (JWT).     |
| **Migraciones** | **Flask-Migrate** | Manejo de cambios en el esquema de la base de datos de forma versionada.    |

## ⚙️ Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo.

| Herramienta     | Versión Mínima | Comando de Verificación               | Instalación                                                                          |
| :-------------- | :------------- | :------------------------------------ | :----------------------------------------------------------------------------------- |
| **Node.js** | `18.0`         | `node -v`                             | [nodejs.org](https://nodejs.org/es/download)                                         |
| **pnpm** | (Recomendado)  | `pnpm -v`                             | `npm install -g pnpm`                                                                |
| **Python** | `3.9`          | `python --version`                    | [python.org](https://www.python.org/downloads/)                                      |
| **MySQL Server**| `8.0`          | `mysql --version`                     | [dev.mysql.com/downloads/mysql](https://dev.mysql.com/downloads/mysql/)              |
| **Git** | `2.0`          | `git --version`                       | [git-scm.com/downloads](https://git-scm.com/downloads)                               |

> **Nota sobre MySQL:** Verificar la versión de MySQL puede requerir tener el cliente de línea de comandos en tu PATH. Si el comando falla, pero sabes que está instalado, puedes continuar.

## 🏁 Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 1. Clonar el Repositorio

### 2. Configuración del Backend (API REST)

Primero, configuraremos la base de datos y el servidor que proveerá los datos a la aplicación.

#### a. Navegar a la carpeta del backend

```bash
cd backend
b. Crear y activar un entorno virtual
Bash

# Crear el entorno virtual
python -m venv venv

# Activar en Windows (CMD/PowerShell)
.\venv\Scripts\activate

# Activar en macOS/Linux
source venv/bin/activate
c. Instalar dependencias de Python
Bash

pip install -r requirements.txt
d. Configurar la Base de Datos y Variables de Entorno
Inicia tu servidor MySQL.

Crea la base de datos usando un cliente de MySQL (Workbench, DBeaver, etc.):

SQL

CREATE DATABASE biblioteca_db;
(Recomendado) Crea un usuario dedicado para la aplicación:

SQL

CREATE USER 'biblio_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON biblioteca_db.* TO 'biblio_user'@'localhost';
FLUSH PRIVILEGES;
Crea un archivo .env en la carpeta backend/ y añade las siguientes variables:

Code snippet

# Configuración de la Base de Datos (ajusta con tus credenciales)
DATABASE_URL=mysql+pymysql://biblio_user:tu_contraseña_segura@localhost/biblioteca_db

# Clave secreta para JWT (debe ser larga, aleatoria y única)
JWT_SECRET_KEY=clave_secreta_muy_larga_y_aleatoria_para_jwt
¡Importante! La JWT_SECRET_KEY es crucial para la seguridad. Usa un generador de cadenas aleatorias para crear un valor robusto.

e. Ejecutar las Migraciones de la Base de Datos
Estos comandos crearán las tablas del sistema en biblioteca_db según los modelos definidos en el código.

Bash

flask db init      # Ejecutar solo la primera vez
flask db migrate -m "Configuración inicial de la base de datos"
flask db upgrade
f. Ejecutar el Servidor Backend
Bash

python run.py
El servidor backend estará ahora corriendo en http://127.0.0.1:5000. Mantén esta terminal abierta.

3. Configuración del Frontend (Next.js)
Abre una nueva terminal para configurar y ejecutar la interfaz de usuario.

a. Navegar a la carpeta del frontend
Bash

# Desde la raíz del proyecto
cd frontend
b. Instalar dependencias de JavaScript
Bash

# Usando pnpm (recomendado)
pnpm install

# O si prefieres npm
npm install
c. Configurar Variables de Entorno del Frontend
Crea un archivo llamado .env.local en la carpeta frontend/ y añade la URL de la API:

Code snippet

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
d. Ejecutar la Aplicación Frontend
Bash

# Usando pnpm
pnpm dev

# O si usas npm
npm run dev
La aplicación frontend estará disponible en tu navegador en http://localhost:3000.

📂 Estructura del Proyecto
.
├── backend/            # Aplicación Flask (API REST)
│   ├── app/            # Lógica de la aplicación
│   ├── migrations/     # Archivos de migración de la BD
│   ├── venv/           # Entorno virtual de Python
│   ├── .env            # Variables de entorno (NO versionar)
│   └── requirements.txt# Dependencias de Python
└── frontend/           # Aplicación Next.js (UI)
    ├── app/            # Rutas y componentes de la UI (App Router)
    ├── public/         # Archivos estáticos
    ├── node_modules/   # Dependencias de Node
    ├── .env.local      # Variables de entorno locales (NO versionar)
    └── package.json    # Dependencias y scripts de Node
🔒 Credenciales de Prueba
Una vez que la aplicación esté funcionando, puedes registrarte como "Lector" desde la interfaz. Para otros roles, puedes crearlos desde una cuenta de administrador o insertarlos directamente en la base de datos para el desarrollo inicial.

Rol

Email

Contraseña

Notas

Lector

lector_prueba@email.com

password123

Puedes registrarte con tus propios datos.

Bibliotecario

bibliotecario@email.com

biblio123

Debe ser creado por un Administrador.

Administrador

admin@email.com

admin123

Generalmente es el primer usuario creado.


Export to Sheets
Advertencia de Seguridad: Estas credenciales son solo para fines de desarrollo. Cámbialas inmediatamente en un entorno de producción o utiliza un script de seeding para poblar la base de datos de forma segura.

🤝 Contribuciones
Si deseas contribuir a este proyecto, ¡eres bienvenido! Por favor, sigue estos pasos:

Haz un Fork de este repositorio.

Crea una nueva rama para tu funcionalidad o corrección:

Bash

git checkout -b feat/nombre-de-la-funcionalidad
Realiza tus cambios y haz commit siguiendo un estilo convencional:

Bash

git commit -m 'feat: Añade un nuevo módulo de reportes'
Empuja tus cambios a tu fork:

Bash

git push origin feat/nombre-de-la-funcionalidad
Abre un Pull Request hacia la rama main del repositorio original.

📄 Licencia
Este proyecto está distribuido bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.












Video

Deep Research

Canvas

