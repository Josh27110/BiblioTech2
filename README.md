# Sistema de Gestión de Biblioteca

¡Bienvenido al repositorio del Sistema de Gestión de Biblioteca! Esta es una plataforma digital diseñada para optimizar y automatizar los procesos clave de una biblioteca: el préstamo de materiales, el control de usuarios, la administración del catálogo y la aplicación de sus políticas internas.

El sistema está construido con una arquitectura web moderna, con un frontend en Next.js (React) y un backend en Flask (Python), utilizando MySQL como base de datos.

## 📚 Características Principales

Este sistema ofrece funcionalidades diferenciadas y seguras para tres roles de usuario (Administrador, Bibliotecario y Lector), garantizando que cada uno acceda únicamente a las funcionalidades que le corresponden.

* **Administrador:** Encargado de la gestión de alto nivel de los usuarios del sistema, con la capacidad de agregar, editar, visualizar, eliminar y buscar cuentas. También establece parámetros globales como los montos de las multas por día de retraso y los periodos de préstamo estándar. No interviene en las operaciones diarias de la biblioteca.
* **Bibliotecario:** Responsable de los procesos operativos diarios, como la gestión de préstamos, la aplicación de multas, el control de la disponibilidad de material y la actualización del inventario en el catálogo. Utiliza el sistema como su principal herramienta de trabajo para interactuar con los lectores y el catálogo.
* **Lector:** El usuario final, quien podrá registrarse, acceder al sistema, solicitar préstamos, consultar el catálogo, renovar libros, pagar multas y visualizar su historial de actividades.

### Funcionalidades Específicas:

* **Gestión de Usuarios:** Incluye el registro, autenticación, edición y eliminación de cuentas de usuario.
* **Gestión de Materiales:** Permite agregar, actualizar, eliminar y visualizar los diferentes materiales del catálogo (libros, revistas, etc.).
* **Gestión de Préstamos:** Contempla la solicitud, renovación, finalización y validación de los límites establecidos para los préstamos.
* **Gestión de Multas:** Incluye la visualización y el registro del pago de multas.
* **Consultas:** Facilita al usuario el acceso a su historial de préstamos y al catálogo de material disponible.

## 🚀 Tecnologías Utilizadas

* **Frontend:**
    * **Next.js:** Framework de React para aplicaciones web.
    * **TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript.
    * **Tailwind CSS:** Framework de CSS para un desarrollo visual ágil.
* **Backend:**
    * **Python:** Lenguaje de programación principal.
    * **Flask:** Micro-framework web para la API REST, seleccionado por su simplicidad y velocidad de desarrollo.
    * **SQLAlchemy:** ORM (Object-Relational Mapper) para la interacción con la base de datos.
    * **Flask-Migrate:** Herramienta para manejar migraciones de bases de datos.
    * **Bcrypt:** Para el hash de contraseñas.
    * **Flask-JWT-Extended:** Para la autenticación basada en JSON Web Tokens.
* **Base de Datos:**
    * **MySQL:** Sistema de gestión de base de datos relacional.

## ⚙️ Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo. No asumas que ya los tienes; te guiaremos para instalarlos si es necesario.

* **Node.js** (versión 18 o superior)
* **npm** o **pnpm** (gestores de paquetes de Node.js, pnpm es recomendado)
* **Python** (versión 3.9 o superior)
* **MySQL Server** (versión 8.0 o superior)
* **Git**

### Cómo verificar si los tienes instalados:

Abre tu terminal o línea de comandos y ejecuta los siguientes comandos:

* **Node.js:**
    ```bash
    node -v
    ```
    Si no lo tienes, puedes descargarlo desde el sitio oficial: [nodejs.org](https://nodejs.org/es/download).

* **npm:**
    ```bash
    npm -v
    ```
    Generalmente viene con Node.js.

* **pnpm:**
    ```bash
    pnpm -v
    ```
    Si no lo tienes, puedes instalarlo con npm:
    ```bash
    npm install -g pnpm
    ```

* **Python:**
    ```bash
    python --version
    ```
    Si no lo tienes, puedes descargarlo desde el sitio oficial: [python.org](https://www.python.org/downloads/).

* **MySQL Server:** Esto es más complejo de verificar directamente con un comando simple si no tienes un cliente CLI configurado. Puedes intentar:
    ```bash
    mysql --version
    ```
    Si no lo tienes, deberás descargar e instalar MySQL Community Server desde [dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/). Sigue las instrucciones de instalación para tu sistema operativo.

* **Git:**
    ```bash
    git --version
    ```
    Si no lo tienes, puedes descargarlo desde el sitio oficial: [git-scm.com/downloads](https://git-scm.com/downloads).

## 🏁 Instalación y Ejecución

Sigue estos pasos para poner en marcha el sistema en tu máquina local.

### 1. Clonar el Repositorio

Abre tu terminal o línea de comandos y ejecuta el siguiente comando para clonar el proyecto:

`bash
git clone https://github.com/tu-usuario/nombre-del-repositorio.git
cd nombre-del-repositorio
2. Configuración de la Base de Datos MySQL
Iniciar MySQL Server: Asegúrate de que tu servidor MySQL esté en ejecución. Si lo acabas de instalar, es probable que se inicie automáticamente o necesites iniciarlo manualmente desde los servicios de tu sistema operativo.

Crear la Base de Datos: Abre un cliente MySQL (como MySQL Workbench, la línea de comandos mysql, o phpMyAdmin) y ejecuta el siguiente comando SQL para crear la base de datos biblioteca_db:

SQL

CREATE DATABASE biblioteca_db;
Crear Usuario (Opcional pero recomendado): Para mayor seguridad, puedes crear un usuario específico para la aplicación en lugar de usar root. Ejecuta estos comandos SQL:

SQL

CREATE USER 'biblio_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON biblioteca_db.* TO 'biblio_user'@'localhost';
FLUSH PRIVILEGES;
Importante: Reemplaza 'your_strong_password' con una contraseña segura de tu elección. Recuerda esta contraseña.

3. Configuración y Ejecución del Backend (API REST)
Navegar a la Carpeta del Backend: Cambia al directorio donde se encuentra tu código Flask (asumo que es una carpeta llamada backend en la raíz del proyecto clonado, y que tu archivo run.py está dentro de ella).

Bash

cd backend
Crear un Entorno Virtual (Python): Es una buena práctica aislar las dependencias del proyecto para evitar conflictos con otras instalaciones de Python. Ejecuta:

Bash

python -m venv venv
Activar el Entorno Virtual: Esto te permitirá instalar librerías solo para este proyecto.

En Windows (Símbolo del Sistema / CMD):

Bash

.\venv\Scripts\activate
En Windows (PowerShell):

PowerShell

.\venv\Scripts\Activate.ps1
En macOS / Linux (Bash / Zsh):

Bash

source venv/bin/activate
Verás (venv) al inicio de tu línea de comandos si el entorno virtual se activó correctamente.

Instalar Dependencias: Instala todas las librerías necesarias para el backend desde el archivo requirements.txt.

Bash

pip install -r requirements.txt
Nota: Si el archivo requirements.txt no existe o está incompleto, puedes instalar las principales dependencias manualmente:

Bash

pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Bcrypt Flask-JWT-Extended PyMySQL
Configurar las Variables de Entorno: Crea un archivo llamado .env en la raíz de tu carpeta del backend (al mismo nivel que tu run.py o la carpeta app principal de Flask) y añade las siguientes variables. Asegúrate de reemplazar los marcadores de posición.

# Configuración de la Base de Datos
DATABASE_URL=mysql+pymysql://biblio_user:your_strong_password@localhost/biblioteca_db

# Configuración de JWT (JSON Web Token)
JWT_SECRET_KEY=super_secret_jwt_key_replace_this_with_a_long_random_string_and_unique_value
DATABASE_URL: Usa el biblio_user y la your_strong_password que configuraste en el paso 2 de MySQL.

JWT_SECRET_KEY: Debe ser una cadena larga, aleatoria y única para la seguridad de tus tokens. Puedes generar una en línea o usar alguna herramienta.

Inicializar y Ejecutar Migraciones de la Base de Datos: Estos comandos de Flask-Migrate crearán las tablas necesarias en tu base de datos MySQL según tus modelos de Python.

Bash

flask db init
flask db migrate -m "Initial database setup"
flask db upgrade
Ejecutar el Servidor Backend: Inicia el servidor Flask.

Bash

python run.py
El backend debería estar funcionando y escuchando peticiones en http://127.0.0.1:5000 (o http://localhost:5000). Deja esta terminal abierta.

4. Configuración y Ejecución del Frontend (Next.js)
Navegar a la Carpeta del Frontend: Abre una nueva terminal (mantén la del backend ejecutándose en la primera terminal) y navega a la carpeta de tu aplicación Next.js (asumo que es una carpeta llamada frontend en la raíz del proyecto clonado).

Bash

cd frontend
(Nota: Ajusta frontend si tu estructura de carpetas es diferente. Asumo que el archivo package.json de Next.js está en un directorio llamado frontend o similar en la raíz del proyecto clonado.)

Instalar Dependencias: Instala las librerías de JavaScript necesarias para el frontend. Usaremos pnpm como se sugiere en tu pnpm-lock.yaml.

Bash

pnpm install
o si prefieres npm:

Bash

npm install
Configurar Variables de Entorno del Frontend: Crea un archivo .env.local en la raíz de tu carpeta del frontend y añade la URL base de tu API de backend:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
Ejecutar la Aplicación Frontend: Inicia el servidor de desarrollo de Next.js.

Bash

pnpm dev
o si usas npm:

Bash

npm run dev
La aplicación frontend debería abrirse en tu navegador web predeterminado en http://localhost:3000.

🔒 Roles y Credenciales de Prueba
Una vez que la aplicación esté funcionando, puedes registrarte como "Lector" directamente desde la interfaz de usuario.

Para otros roles (Bibliotecario, Administrador), necesitarás crearlos inicialmente a través del sistema (si el rol de Administrador ya existe) o directamente en la base de datos para los primeros usuarios. Para fines de prueba y desarrollo inicial, aquí hay algunas credenciales de ejemplo que podrías usar:

Lector (ejemplo para registro):

Email: lector_prueba@biblioteca.com

Contraseña: password123
(Puedes registrarte con tus propios datos desde la UI).

Bibliotecario (ejemplo, si lo creas manualmente o vía un admin):

Email: bibliotecario@biblioteca.com

Contraseña: biblio123

Administrador (ejemplo, si lo creas manualmente):

Email: admin@biblioteca.com

Contraseña: admin123

Importante: Es muy recomendable cambiar estas credenciales por defecto después de la instalación inicial o usar un script de inicialización de datos para poblar la base de datos de forma segura para entornos de producción.

🤝 Contribución
Si deseas contribuir a este proyecto, por favor, sigue estos pasos:

Haz un "fork" de este repositorio.

Crea una nueva rama para tu característica o corrección de error:

Bash

git checkout -b feature/nombre-de-tu-caracteristica-o-bugfix
Realiza tus cambios y commitea con un mensaje descriptivo:

Bash

git commit -m 'feat: Añade nueva característica que hace X'
o

Bash

git commit -m 'fix: Corrige error en el módulo Y'
Empuja tus cambios a la rama remota de tu fork:

Bash

git push origin feature/nombre-de-tu-caracteristica-o-bugfix
Abre un Pull Request desde tu repositorio fork hacia el repositorio original, explicando tus cambios.

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE en la raíz del repositorio para más detalles.
