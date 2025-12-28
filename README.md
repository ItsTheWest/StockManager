# Sistema de Control de Inventario y Facturación StockManager

## 1. Arquitectura del Sistema

### 🐍 Django (Backend): El Centro de Lógica de Negocio
Django actúa como el Servicio de Lógica de Negocio Pesada. Su función principal es ejecutar los procesos que son sensibles, complejos o que requieren un alto consumo de recursos del servidor.

* **Lógica Compleja y Procesamiento Pesado:** Es responsable de ejecutar algoritmos estadísticos, modelos de Inteligencia Artificial (IA), o el cálculo y la generación de documentos complejos como la facturación.
* **Integraciones Seguras:** Sirve como un puente seguro para comunicarse con sistemas externos, como pasarelas de pago o servicios de envío de correos masivos. Este código no es visible para el cliente, garantizando la seguridad.
* **Seguridad (Servidor):** Protege la lógica de negocio más sensible, ya que este código reside en el servidor y no puede ser manipulado por el usuario final.

### 🔗 Supabase (Base de Datos y Auth): La Fuente de Verdad
Supabase es la Fuente de Datos y el Motor de Autenticación. Se encarga de la gestión de la información y la seguridad del acceso de los usuarios.

* **Persistencia y CRUD Básico:** Almacena todas las tablas de la aplicación. Permite que el Frontend (React) realice operaciones CRUD básicas (Crear, Leer, Actualizar, Eliminar) directamente a través de sus APIs (PostgREST).
* **Autenticación y Seguridad:** Gestiona el registro, el inicio de sesión de los usuarios y la emisión de tokens. Lo más importante, aplica las Políticas RLS (*Row Level Security*) para asegurar que un usuario solo pueda manipular los datos a los que tiene permiso, incluso cuando la petición viene directamente de React.

### ⚛️ React (Frontend): La Interfaz de Usuario
React funciona como el Cliente y la Interfaz de Usuario. Su enfoque está 100% en la experiencia del usuario y la interacción.

* **Presentación y Lógica de UI:** Muestra la información de manera organizada (tablas, gráficos) y maneja el estado visual de la aplicación. También gestiona las rutas internas y realiza validaciones iniciales y superficiales de formularios para mejorar la experiencia.
* **Iniciador de Peticiones:** Es el componente que inicia las llamadas, dirigiéndolas directamente a Supabase para datos simples, o a Django cuando necesita que se ejecute una lógica de negocio compleja o un proceso pesado.

---

## 2. Módulos y Dependencias Tecnológicas

### ⚙️ Backend (Python / Django)
El backend se centra en el framework Django, la gestión de datos PostgreSQL y la integración con servicios serverless como Supabase.

#### A. Núcleo del Framework y Conectividad de Base de Datos
| Librería / Herramienta | Versión / Descripción |
| :--- | :--- |
| **Django** | **6.0**. Es el framework web principal. Proporciona la estructura, el ORM, las plantillas y toda la maquinaria para construir la lógica de negocio del lado del servidor (API, manejo de rutas, etc.). |
| **psycopg2-binary** | Adaptador que permite a la aplicación Python (Django) comunicarse con la base de datos PostgreSQL, esencial para la persistencia de datos. |
| **dj-database-url** | Simplifica la configuración de la base de datos, permitiendo definir la conexión completa (tipo, usuario, contraseña, host) a través de una sola cadena de texto de URL. |
| **asgiref, anyio, websockets** | Paquetes fundamentales para manejar la asincronía y la concurrencia. `asgiref` es la interfaz entre Django y los servidores asíncronos, y `websockets` es crucial para comunicaciones bidireccionales en tiempo real. |

#### B. Integración de Servicios Cloud y Utilidades (Supabase)
*Uso extensivo de librerías versión 2.27.0, sugiriendo fuerte dependencia del ecosistema Backend-as-a-Service.*

* **supabase, postgrest, supabase-auth, realtime, storage3**: Conjunto de librerías cliente de Supabase. Permiten interactuar con la BD (`postgrest`), gestionar autenticación (`supabase-auth`), manejo de archivos (`storage3`) y actualizaciones en tiempo real (`realtime`).
* **PyJWT**: Utilizado para la creación y validación de JSON Web Tokens, fundamentales para la seguridad y gestión de sesión en entornos API/serverless.
* **python-dotenv**: Herramienta esencial de seguridad y configuración local. Carga variables de entorno (claves API, secretos) desde un archivo `.env`.

#### C. Validación de Datos, Peticiones y Seguridad
| Librería | Descripción |
| :--- | :--- |
| **pydantic** (y pydantic_core) | Cruciales para la validación de datos y definición de modelos con tipado estricto, garantizando que los datos entrantes sean correctos y válidos. |
| **requests** | Cliente HTTP estándar para peticiones sincrónicas. |
| **httpx** | Cliente HTTP para peticiones asíncronas, crucial para evitar el bloqueo del servidor durante llamadas externas. |
| **cryptography, certifi** | Proveen herramientas criptográficas básicas (`cryptography` para hashing/cifrado) y lista de certificados raíz de confianza (`certifi`) para verificación SSL/TLS. |

#### D. Manipulación de Archivos y Caching
* **pillow**: Biblioteca fundamental para el manejo de imágenes (subir, redimensionar, recortar, avatares).
* **cachetools**: Utilizada para implementar estrategias de caching en memoria (LRU, LFU) para mejorar tiempos de respuesta en consultas costosas.

### 🎨 Frontend (React)
Enfocado en crear una Interfaz de Usuario (UI) interactiva, moderna y fácil de mantener.

#### A. Framework y Routing
* **react (19.2.0) y @types/react**: Librería principal para construir la UI mediante componentes (SPA).
* **react-router-dom**: Biblioteca estándar para el enrutamiento, permitiendo navegación entre vistas sin recarga completa.

#### B. Estilizado y Diseño
* **tailwindcss (4.1.17) y @tailwindcss/vite**: Librería CSS utility-first para construir diseños aplicando clases en el HTML/JSX.
* **postcss y autoprefixer**: Herramientas de procesamiento CSS. `postcss` transforma estilos con JS y `autoprefixer` asegura compatibilidad con navegadores añadiendo prefijos.

---

## 3. Estructura del Proyecto

### Árbol de Directorios
```text
📦 PROYECTO-RAIZ
 ├── 📂 backDjango/               # 🐍 EL BACKEND (Django)
 │   ├── 📂 backDjango/           #    Configuración principal del proyecto
 │   │   ├── 📄 __init__.py
 │   │   ├── 📄 asgi.py           #    Configuración asíncrona (Importante para WebSockets)
 │   │   ├── 📄 settings.py       #    ⚙️ EL CEREBRO: Configuración global
 │   │   ├── 📄 urls.py           #    🚦 EL TRÁFICO: Rutas y URLs
 │   │   └── 📄 wsgi.py           #    Entrada para servidores web tradicionales
 │   ├── 📄 db.sqlite3            #    Base de datos local (por defecto)
 │   └── 📄 manage.py             #    🛠️ HERRAMIENTA DE COMANDO principal
 │
 ├── 📂 frontReact/               # ⚛️ EL FRONTEND (React + Vite)
 │   ├── 📂 node_modules/         #    Librerías instaladas
 │   ├── 📂 public/               #    Archivos estáticos públicos (favicon, robots.txt)
 │   ├── 📂 src/                  #    👨‍💻 CÓDIGO FUENTE (90% del trabajo aquí)
 │   │   ├── 📂 assets/           #       Imágenes, fuentes, iconos
 │   │   ├── 📂 components/       #       🧩 Piezas reutilizables (Botones, Navbars)
 │   │   ├── 📂 pages/            #       Vistas completas (Home, Login, Dashboard)
 │   │   ├── 📄 App.tsx           #       El componente "contenedor" principal
 │   │   ├── 📄 main.tsx          #       Punto de entrada de React al HTML
 │   │   └── 📄 supabase-client.ts # ⚡   Conexión con Supabase
 │   ├── 📄 .env                  #    Variables de entorno (Claves secretas del front)
 │   ├── 📄 index.html            #    El único archivo HTML real de la App
 │   ├── 📄 package.json          #    📦 Lista de dependencias del Frontend
 │   ├── 📄 tailwind.config.js    #    🎨 Configuración de estilos
 │   └── 📄 vite.config.ts        #    ⚡ Configuración del compilador Vite
 │
 └── 📂 venv/                     # 🐍 Entorno Virtual (Librerías de Python aisladas)