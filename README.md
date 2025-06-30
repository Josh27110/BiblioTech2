# BiblioTech



¡Bienvenido al repositorio del Sistema de Gestión de Biblioteca! Esta es una plataforma digital diseñada para optimizar y automatizar los procesos clave de una biblioteca: el préstamo de materiales, el control de usuarios, la administración del catálogo y la aplicación de sus políticas internas.

El sistema está construido con una arquitectura web moderna, con un frontend en Next.js (React) y un backend en Flask (Python), utilizando MySQL como base de datos.

## 📚 Características Principales

Este sistema ofrece funcionalidades diferenciadas y seguras para tres roles de usuario:

* [cite_start]**Administrador:** Gestiona las cuentas de usuario del sistema (crear, editar, eliminar) y configura parámetros globales como los montos de multas y periodos de préstamo[cite: 33, 76, 77].
* [cite_start]**Bibliotecario:** Encargado de las operaciones diarias, como la gestión del catálogo (añadir, editar, eliminar materiales), la gestión de préstamos y devoluciones, y la aplicación y seguimiento de multas[cite: 34, 81, 82, 83, 84, 85].
* [cite_start]**Lector:** El usuario final que puede registrarse, acceder al sistema, solicitar préstamos, consultar el catálogo, renovar libros, pagar multas y visualizar su historial de actividades[cite: 35, 88, 89, 90, 91, 92].

### Funcionalidades Específicas:

* [cite_start]**Gestión de Usuarios:** Incluye el registro, autenticación, edición y eliminación de cuentas de usuario[cite: 40].
* [cite_start]**Gestión de Materiales:** Permite agregar, actualizar, eliminar y visualizar los diferentes materiales del catálogo (libros, revistas, etc.)[cite: 41].
* [cite_start]**Gestión de Préstamos:** Contempla la solicitud, renovación, finalización y validación de los límites establecidos para los préstamos[cite: 42].
* [cite_start]**Gestión de Multas:** Incluye la visualización y el registro del pago de multas[cite: 43].
* [cite_start]**Consultas:** Facilita al usuario el acceso a su historial de préstamos y al catálogo de material disponible[cite: 44].

## 🚀 Tecnologías Utilizadas

* **Frontend:**
    * [cite_start]**Next.js:** Framework de React para aplicaciones web[cite: 166].
    * [cite_start]**TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript[cite: 166].
    * [cite_start]**Tailwind CSS:** Framework de CSS para un desarrollo rápido de interfaces de usuario[cite: 166].
* **Backend:**
    * [cite_start]**Python:** Lenguaje de programación principal[cite: 166].
    * [cite_start]**Flask:** Micro-framework web para la API REST[cite: 166].
    * [cite_start]**SQLAlchemy:** ORM (Object-Relational Mapper) para la interacción con la base de datos[cite: 166].
    * **Flask-Migrate:** Herramienta para manejar migraciones de bases de datos.
    * **Bcrypt:** Para el hash de contraseñas.
    * **Flask-JWT-Extended:** Para la autenticación basada en JSON Web Tokens.
* **Base de Datos:**
    * [cite_start]**MySQL:** Sistema de gestión de base de datos relacional[cite: 166].

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
2. Configuración de la Base de Datos MySQL
Iniciar MySQL Server: Asegúrate de que tu servidor MySQL esté en ejecución.

Crear la Base de Datos: Abre un cliente MySQL (como MySQL Workbench, la línea de comandos mysql, o phpMyAdmin) y ejecuta el siguiente comando para crear la base de datos.

SQL

CREATE DATABASE biblioteca_db;
Crear Usuario (Opcional pero recomendado): Si no quieres usar root, puedes crear un usuario dedicado para la aplicación:

SQL

CREATE USER 'biblio_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON biblioteca_db.* TO 'biblio_user'@'localhost';
FLUSH PRIVILEGES;
Reemplaza 'your_strong_password' con una contraseña segura de tu elección.

3. Configuración y Ejecución del Backend (API REST)
Navegar a la Carpeta del Backend:

Bash

cd backend # O la carpeta donde esté tu código Flask (ej. 'src' o 'api'). Asumo que `run.py` está en esta carpeta.
(Nota: Ajusta backend si tu estructura de carpetas es diferente. Asumo que el app.py o la carpeta app de Flask y run.py están en un directorio llamado backend o similar en la raíz del proyecto clonado.)

Crear un Entorno Virtual (Python):
Es una buena práctica aislar las dependencias del proyecto.

Bash

python -m venv venv
Activar el Entorno Virtual:

Windows:

Bash

.\venv\Scripts\activate
macOS/Linux:

Bash

source venv/bin/activate
Instalar Dependencias:

Bash

pip install -r requirements.txt
Si no tienes un requirements.txt, puedes generar uno después de instalar las dependencias con pip freeze > requirements.txt. Por ahora, instala las principales:

Bash

pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Bcrypt Flask-JWT-Extended PyMySQL
Configurar las Variables de Entorno:
Crea un archivo llamado .env en la raíz de tu carpeta del backend (donde está run.py o el directorio app principal de Flask) y añade las siguientes variables:

# Configuración de la Base de Datos
DATABASE_URL=mysql+pymysql://biblio_user:your_strong_password@localhost/biblioteca_db

# Configuración de JWT
JWT_SECRET_KEY=super_secret_jwt_key_replace_this_with_a_long_random_string
Asegúrate de usar el biblio_user y your_strong_password que configuraste en el paso 2 de MySQL.

JWT_SECRET_KEY debe ser una cadena larga y aleatoria para seguridad.

Inicializar y Ejecutar Migraciones de la Base de Datos:
Esto creará las tablas en tu base de datos MySQL.

Bash

flask db init
flask db migrate -m "Initial migration."
flask db upgrade
Ejecutar el Servidor Backend:

Bash

python run.py
El backend debería estar funcionando en http://127.0.0.1:5000 (o http://localhost:5000).

4. Configuración y Ejecución del Frontend (Next.js)
Navegar a la Carpeta del Frontend:
Abre una nueva terminal (mantén la del backend ejecutándose) y navega a la carpeta del frontend:

Bash

cd frontend # O la carpeta donde esté tu código Next.js (ej. 'client' o 'web')
(Nota: Ajusta frontend si tu estructura de carpetas es diferente. Asumo que el package.json de Next.js está en un directorio llamado frontend o similar en la raíz del proyecto clonado.)

Instalar Dependencias:
Usaremos pnpm como se sugiere en tu pnpm-lock.yaml. Si no lo tienes, puedes instalarlo con npm install -g pnpm.

Bash

pnpm install
o si prefieres npm:

Bash

npm install
Configurar Variables de Entorno del Frontend:
Crea un archivo .env.local en la raíz de tu carpeta del frontend y añade la URL de tu API de backend:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
Ejecutar la Aplicación Frontend:

Bash

pnpm dev
o si usas npm:

Bash

npm run dev
La aplicación frontend debería abrirse en tu navegador en http://localhost:3000.

🔒 Roles y Credenciales de Prueba
Una vez que la aplicación esté funcionando, puedes registrarte como "Lector" desde la interfaz de usuario.

Para otros roles, el administrador puede crearlos. Sin embargo, para fines de prueba y desarrollo inicial, aquí hay algunas credenciales de ejemplo que podrías usar (asumiendo que las creas manualmente en la BD o a través de un script de inicialización):

Lector:

Email: lector@biblioteca.com

Contraseña: lector123

Bibliotecario:

Email: bibliotecario@biblioteca.com

Contraseña: biblio123

Administrador:

Email: admin@biblioteca.com

Contraseña: admin123

(Nota: Es recomendable cambiar estas credenciales por defecto después de la instalación inicial o usar un script de inicialización de datos para poblar la base de datos de forma segura).

🤝 Contribución
Si deseas contribuir a este proyecto, por favor, sigue estos pasos:

Haz un "fork" de este repositorio.

Crea una nueva rama (git checkout -b feature/nueva-caracteristica).

Realiza tus cambios y commitea (git commit -m 'feat: Añade nueva característica').

Empuja tus cambios a la rama remota (git push origin feature/nueva-caracteristica).

Abre un Pull Request.

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
