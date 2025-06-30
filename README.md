# BiblioTech

# Sistema de Gestión de Biblioteca

¡Bienvenido al repositorio del Sistema de Gestión de Biblioteca! Esta es una plataforma digital diseñada para optimizar y automatizar los procesos clave de una biblioteca: el préstamo de materiales, el control de usuarios, la administración del catálogo y la aplicación de sus políticas internas.

El sistema está construido con una arquitectura web moderna, con un frontend en Next.js (React) y un backend en Flask (Python), utilizando MySQL como base de datos.

## 📚 Características Principales

Este sistema ofrece funcionalidades diferenciadas y seguras para tres roles de usuario:

* **Administrador:** Gestiona las cuentas de usuario del sistema (crear, editar, eliminar) y configura parámetros globales como los montos de multas y periodos de préstamo.
* **Bibliotecario:** Encargado de las operaciones diarias, como la gestión del catálogo (añadir, editar, eliminar materiales), la gestión de préstamos y devoluciones, y la aplicación y seguimiento de multas.
* **Lector:** El usuario final que puede registrarse, acceder al sistema, solicitar préstamos, consultar el catálogo, renovar libros, pagar multas y visualizar su historial de actividades.

### Funcionalidades Específicas:

* [cite_start]**Gestión de Usuarios:** Incluye el registro, autenticación, edición y eliminación de cuentas de usuario[cite: 25].
* [cite_start]**Gestión de Materiales:** Permite agregar, actualizar, eliminar y visualizar los diferentes materiales del catálogo (libros, revistas, etc.)[cite: 26].
* [cite_start]**Gestión de Préstamos:** Contempla la solicitud, renovación, finalización y validación de los límites establecidos para los préstamos[cite: 27].
* [cite_start]**Gestión de Multas:** Incluye la visualización y el registro del pago de multas[cite: 28].
* [cite_start]**Consultas:** Facilita al usuario el acceso a su historial de préstamos y al catálogo de material disponible[cite: 29].

## 🚀 Tecnologías Utilizadas

* **Frontend:**
    * [cite_start]**Next.js:** Framework de React para aplicaciones web[cite: 151].
    * [cite_start]**TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript[cite: 151].
    * [cite_start]**Tailwind CSS:** Framework de CSS para un desarrollo rápido de interfaces de usuario[cite: 151].
* **Backend:**
    * [cite_start]**Python:** Lenguaje de programación principal[cite: 151].
    * [cite_start]**Flask:** Micro-framework web para la API REST[cite: 151].
    * [cite_start]**SQLAlchemy:** ORM (Object-Relational Mapper) para la interacción con la base de datos[cite: 151].
    * **Flask-Migrate:** Herramienta para manejar migraciones de bases de datos.
    * **Bcrypt:** Para el hash de contraseñas.
    * **Flask-JWT-Extended:** Para la autenticación basada en JSON Web Tokens.
* **Base de Datos:**
    * [cite_start]**MySQL:** Sistema de gestión de base de datos relacional[cite: 151].

## ⚙️ Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

* **Node.js** (versión 18 o superior) y **npm** o **pnpm** (recomendado)
* **Python** (versión 3.9 o superior)
* **MySQL Server** (versión 8.0 o superior)
* **Git**

## 🏁 Instalación y Ejecución

Sigue estos pasos para poner en marcha el sistema en tu máquina local.

### 1. Clonar el Repositorio

Abre tu terminal o línea de comandos y ejecuta el siguiente comando para clonar el proyecto:

```bash
git clone [https://github.com/tu-usuario/nombre-del-repositorio.git](https://github.com/tu-usuario/nombre-del-repositorio.git)
cd nombre-del-repositorio
