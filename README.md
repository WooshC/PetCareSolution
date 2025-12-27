# 🐾 PetCare Solution

**PetCare Solution** es una plataforma integral de microservicios diseñada para conectar dueños de mascotas con cuidadores profesionales verificados. Combina un robusto ecosistema backend en **.NET 8** con una experiencia de usuario premium en **React**, priorizando la escalabilidad, seguridad y diseño de vanguardia.

---

## 📑 Índice

1.  [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
2.  [� Aplicación Frontend](#-aplicación-frontend)
3.  [�🚀 Guía de Ejecución Local](#-guía-de-ejecución-local)
4.  [🔍 Detalles de los Servicios](#-detalles-de-los-servicios)
5.  [✨ Características Implementadas](#-características-implementadas)
6.  [🗺️ Roadmap de Desarrollo](#️-roadmap-de-desarrollo)
7.  [🐳 Despliegue con Docker](#-despliegue-con-docker)
8.  [📚 Documentación Adicional](#-documentación-adicional)

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una **arquitectura de microservicios desacoplada** donde cada dominio de negocio tiene su propio servicio aislado con base de datos independiente. El frontend consume las APIs de forma segura mediante autenticación JWT.

### 🧩 Componentes del Ecosistema

| Servicio | Puerto HTTP | Puerto HTTPS | Base de Datos | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **🌐 Frontend** | - | `5173` | - | Interfaz Premium con Tailwind CSS y Lucide Icons |
| **🔐 Auth Service** | `5043` | `7001` | `PetCareAuth` | Identidad, roles y emisión de tokens |
| **👤 Cliente Service** | `5045` | `7009` | `PetCareCliente` | Gestión de perfiles de dueños |
| **🏥 Cuidador Service** | `5044` | `7044` | `PetCareCuidador` | Gestión de perfiles profesionales |
| **📋 Request Service** | `5050` | `7254` | `PetCareRequest` | Orquestación del ciclo de solicitudes |
| **⭐ Calificar Service** | `5075` | `7228` | `PetCareRatings` | Sistema de reputación y reseñas |

### 📂 Estructura del Proyecto

```
PetCareSolution/
├── PetCareSolution-frontend/    # 🌐 Aplicación React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── cliente/         # Dashboard Cliente
│   │   │   ├── cuidador/        # Dashboard Cuidador
│   │   │   ├── common/          # Componentes compartidos
│   │   │   ├── layout/          # Headers y navegación
│   │   │   └── ui/              # Sistema de diseño base
│   │   ├── pages/               # Páginas principales
│   │   │   ├── Auth/            # Login y Registro
│   │   │   └── Home/            # Landing Page
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── services/            # Clientes API
│   │   └── models/              # Tipos y constantes
│   └── tailwind.config.js       # Configuración de diseño
├── auth-service/                # 🔐 Servicio de Autenticación
│   └── PetCare.Auth/
├── cliente-service/             # 👤 Servicio de Clientes
│   └── PetCare.Cliente/
├── cuidador-service/            # 🏥 Servicio de Cuidadores
│   └── PetCare.Cuidador/
├── request-service/             # 📋 Servicio de Solicitudes
│   └── PetCare.Request/
├── calificar-servicie/          # ⭐ Servicio de Calificaciones
│   └── PetCare.Calificar/
├── shared-kernel/               # 📦 Código compartido
├── docker-compose.yml           # 🐳 Orquestación Docker
├── PetCare.sln                  # 🎯 Solución .NET
├── REQUIREMENTS.md              # 📋 Requisitos del sistema
└── C4_MODEL.md                  # 🏛️ Documentación arquitectónica
```

---

## � Aplicación Frontend

El frontend ha sido diseñado bajo una **estética Premium Dashboard**, enfocada en la claridad visual, elegancia y experiencia de usuario excepcional.

### ✨ Características de Diseño

*   **🎨 Sistema de Diseño Boxed**: Contenedores con sombras profundas, glassmorphism y bordes redondeados pronunciados (`rounded-[2rem]`, `rounded-[3rem]`)
*   **🎭 Experiencia Multi-Rol**: Dashboards especializados con paletas diferenciadas:
    *   **Cliente**: Paleta Emerald (verde) para acciones de búsqueda y contratación
    *   **Cuidador**: Paleta Brand (azul) para gestión profesional
*   **🔄 Actualizaciones en Tiempo Real**: Sistema de polling automático (30s) para refrescar estados de solicitudes
*   **🎯 Iconografía Profesional**: Uso exclusivo de Lucide React Icons (sin emojis)
*   **📱 Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
*   **🔐 Flujo de Autenticación Premium**: Selección interactiva de rol con tarjetas animadas

### 🛠️ Stack Tecnológico Frontend

```json
{
  "core": ["React 19", "Vite 7", "React Router Dom 7"],
  "styling": ["Tailwind CSS 3.4", "PostCSS", "Autoprefixer"],
  "forms": ["React Hook Form 7", "Zod 4", "@hookform/resolvers"],
  "icons": ["Lucide React 0.552"],
  "http": ["Axios 1.13"]
}
```

---

## 🚀 Guía de Ejecución Local

### 📋 Prerrequisitos

1.  **.NET 8.0 SDK** instalado
2.  **Node.js 18+** y **npm**
3.  **SQL Server** local en puerto `1433`
4.  Usuario `sa` habilitado en SQL Server

### ▶️ Paso 1: Iniciar Backend (Microservicios)

Cada servicio debe ejecutarse en una terminal separada:

```powershell
# 1. Auth Service (Identidad)
cd auth-service/PetCare.Auth
dotnet run
# Swagger: https://localhost:7001/swagger

# 2. Cuidador Service
cd cuidador-service/PetCare.Cuidador
dotnet run
# Swagger: https://localhost:7044/swagger

# 3. Cliente Service
cd cliente-service/PetCare.Cliente
dotnet run
# Swagger: https://localhost:7009/swagger

# 4. Request Service
cd request-service/PetCare.Request
dotnet run
# Swagger: https://localhost:7254/swagger

# 5. Calificar Service
cd calificar-servicie/PetCare.Calificar
dotnet run
# Swagger: https://localhost:7228/swagger
```

### ▶️ Paso 2: Iniciar Frontend

```powershell
cd PetCareSolution-frontend
npm install
npm run dev
# Aplicación: http://localhost:5173
```

### ⚙️ Configuración de Base de Datos

Cada servicio crea automáticamente su base de datos y aplica migraciones al iniciarse. Verifica que tu `appsettings.json` apunte a tu instancia local:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=PetCare[Servicio];User Id=sa;Password=TuPassword;TrustServerCertificate=True;"
  }
}
```

---

## 🔍 Detalles de los Servicios

### 🔐 Auth Service
*   **Responsabilidad**: Autenticación centralizada y autorización
*   **Funcionalidades**: 
    *   Login y Registro con validación de email único
    *   Emisión de tokens JWT (Access + Refresh)
    *   Gestión de roles: `Admin`, `Cliente`, `Cuidador`
    *   Reset de contraseñas
*   **Seguridad**: Hashing de contraseñas con ASP.NET Core Identity, tokens firmados con clave secreta

### 👤 Cliente Service
*   **Responsabilidad**: Información de dueños de mascotas
*   **Funcionalidades**: 
    *   CRUD de perfil personal
    *   Gestión de documento de identidad y teléfono de emergencia
    *   Verificación de identidad (Admin)
*   **Datos Sensibles**: Protegidos con políticas de autorización

### 🏥 Cuidador Service
*   **Responsabilidad**: Información de proveedores de servicio
*   **Funcionalidades**: 
    *   Perfil profesional con biografía y experiencia
    *   Configuración de tarifas por hora
    *   Horarios de atención
    *   Verificación de documentos y certificaciones
*   **Interacción**: Consultado por Request Service para validar disponibilidad

### 📋 Request Service
*   **Responsabilidad**: Orquestación del servicio de cuidado
*   **Flujo de Estados**:
    1.  `PENDIENTE` → Cliente crea solicitud
    2.  `ASIGNADA` → Cliente asigna cuidador específico
    3.  `ACEPTADA` / `RECHAZADA` → Cuidador responde
    4.  `EN_PROGRESO` → Cuidador inicia servicio
    5.  `FINALIZADA` → Cuidador completa servicio
    6.  `CANCELADA` → Cliente cancela antes de inicio
*   **Validaciones**: Verifica existencia de usuarios, estados válidos y transiciones permitidas

### ⭐ Calificar Service
*   **Responsabilidad**: Gestión de reputación
*   **Funcionalidades**: 
    *   Calificación de 1-5 estrellas
    *   Comentarios de texto
    *   Validación de servicio finalizado
*   **Dependencias**: Consume Request Service para verificar estado `FINALIZADA`

---

## ✨ Características Implementadas

### 👥 Gestión de Perfiles

#### Dashboard Cliente
*   ✅ Visualización de perfil con verificación de identidad
*   ✅ Creación y edición de información personal
*   ✅ Búsqueda y visualización de cuidadores disponibles
*   ✅ Gestión de solicitudes activas con estados en tiempo real
*   ✅ Historial de servicios con paginación (5 por página)
*   ✅ Sistema de calificación post-servicio

#### Dashboard Cuidador
*   ✅ Perfil profesional con biografía y experiencia editables
*   ✅ Configuración de tarifas y horarios
*   ✅ Visualización de solicitudes asignadas
*   ✅ Gestión de solicitudes activas (Aceptar/Rechazar/Iniciar/Finalizar)
*   ✅ Historial de servicios completados con paginación
*   ✅ Estadísticas de rendimiento (servicios totales, calificación promedio)

### 📋 Sistema de Solicitudes

*   ✅ Creación de solicitudes con descripción detallada
*   ✅ Asignación directa de cuidador
*   ✅ Flujo completo de estados con validaciones
*   ✅ Cancelación de solicitudes pendientes
*   ✅ Actualización automática de estados (polling 30s)
*   ✅ Visualización de timeline de eventos

### 🎨 Interfaz de Usuario

*   ✅ Landing Page premium con Hero dinámico
*   ✅ Secciones de Features, How It Works, FAQ
*   ✅ Header flotante con efecto scroll
*   ✅ Footer corporativo con información de contacto
*   ✅ Formularios de Login/Registro con validación Zod
*   ✅ Modales de confirmación y notificación
*   ✅ Sistema de paginación reutilizable
*   ✅ Estados de carga y error consistentes

---

## 🗺️ Roadmap de Desarrollo

### ✅ Completado (Sprint 1-3)

*   [x] Arquitectura de microservicios base
*   [x] Auth Service con JWT
*   [x] Cliente y Cuidador Services
*   [x] Request Service con flujo completo
*   [x] Calificar Service básico
*   [x] Frontend React con diseño premium
*   [x] Sistema de paginación
*   [x] Polling en tiempo real
*   [x] Landing Page optimizada
*   [x] Dashboards multi-rol

### 🚧 En Progreso (Sprint 4)

#### ⭐ Rating Service - Refinamiento
*   [ ] Cálculo automático de promedio de calificaciones
*   [ ] Sistema de comentarios con moderación
*   [ ] Integración de calificaciones en perfil de cuidador
*   [ ] Filtrado de cuidadores por rating

### 🔮 Próximos Pasos (Sprint 5+)

#### 💳 Payment Service (Prioridad Alta)
*   [ ] Integración con Stripe/PayPal
*   [ ] Tokenización de tarjetas (PCI-DSS compliant)
*   [ ] Generación de recibos/facturas
*   [ ] Sistema de reembolsos
*   [ ] Encriptación AES-256 para datos financieros
*   [ ] Auditoría de transacciones

---

## 🐳 Despliegue con Docker

### Prerrequisitos
*   Docker Desktop instalado y corriendo

### Comandos Básicos

```bash
# 1. Construir y levantar todos los servicios
docker-compose up -d --build

# 2. Verificar estado de contenedores
docker-compose ps

# 3. Ver logs de un servicio específico
docker-compose logs -f petcare-auth

# 4. Detener y eliminar contenedores
docker-compose down

# 5. Reconstruir un servicio específico
docker-compose up -d --build petcare-auth
```

### Puertos en Docker

| Servicio | Puerto Host | Swagger URL |
| :--- | :--- | :--- |
| **Auth Service** | `5001` | `http://localhost:5001/swagger` |
| **Cuidador Service** | `5008` | `http://localhost:5008/swagger` |
| **Cliente Service** | `5009` | `http://localhost:5009/swagger` |
| **Request Service** | `5010` | `http://localhost:5010/swagger` |
| **Calificar Service** | `5011` | `http://localhost:5011/swagger` |

> ⚠️ **Nota**: La configuración de Docker puede requerir actualización para incluir servicios recientes. Se recomienda desarrollo local para nuevas funcionalidades.

---

## 📚 Documentación Adicional

*   **[REQUIREMENTS.md](./REQUIREMENTS.md)**: Requisitos funcionales, no funcionales y mapeo de seguridad (Common Criteria)
*   **[C4_MODEL.md](./C4_MODEL.md)**: Diagramas de arquitectura C4 (Contexto, Contenedores, Componentes)
*   **[Frontend README](./PetCareSolution-frontend/README.md)**: Documentación específica del frontend
*   **[Auth Service README](./auth-service/README-Auth.md)**: Documentación detallada del servicio de autenticación

---

## 🔒 Seguridad

El sistema implementa múltiples capas de seguridad:

*   **Autenticación**: JWT con expiración configurable
*   **Autorización**: Control de acceso basado en roles (RBAC)
*   **Encriptación**: 
    *   Contraseñas con hashing (ASP.NET Core Identity)
    *   Datos financieros con AES-256 (planeado)
*   **Comunicación**: HTTPS obligatorio en producción
*   **Validación**: Sanitización de inputs y validación de esquemas
*   **Auditoría**: Logs de aplicación para trazabilidad

---

## 🤝 Contribución

1.  Fork del repositorio
2.  Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3.  Commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4.  Push a la rama (`git push origin feature/nueva-funcionalidad`)
5.  Abrir Pull Request

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](./LICENSE) para más detalles.

---

**© 2025 PetCare Solutions • Cuidado Experto para tu Mejor Amigo 🐾**