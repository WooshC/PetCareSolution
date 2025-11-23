# 🐾 PetCare Solution

**PetCare Solution** es una plataforma integral basada en microservicios diseñada para conectar a dueños de mascotas con cuidadores profesionales de confianza.

La arquitectura está construida sobre **.NET 8** y **SQL Server**, priorizando la escalabilidad, la seguridad y la separación de responsabilidades.

---

## 📑 Índice

1.  [🏗️ Arquitectura del Sistema](#-arquitectura-del-sistema)
2.  [🚀 Guía de Ejecución Local](#-guía-de-ejecución-local)
3.  [🔍 Detalles de los Servicios](#-detalles-de-los-servicios)
4.  [🗺️ Roadmap de Desarrollo](#-roadmap-de-desarrollo)
5.  [🐳 Despliegue con Docker](#-despliegue-con-docker)

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura de microservicios donde cada dominio de negocio tiene su propio servicio aislado y su propia base de datos.

### 🧩 Servicios Principales

| Servicio | Puerto HTTP | Puerto HTTPS | Base de Datos | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **🔐 Auth Service** | `5043` | `7001` | `PetCareAuth` | Gestión de identidad, roles y emisión de tokens JWT. |
| **👤 Cliente Service** | `5045` | `7009` | `PetCareCliente` | Gestión de perfiles de dueños de mascotas. |
| **🏥 Cuidador Service** | `5044` | `7044` | `PetCareCuidador` | Gestión de perfiles profesionales de cuidadores. |
| **📋 Request Service** | `5050` | `7254` | `PetCareRequest` | Ciclo de vida de las solicitudes de servicio. |
| **⭐ Calificar Service** | `5075` | `7228` | `PetCareRatings` | Sistema de calificaciones y reseñas (En desarrollo). |

### 📂 Estructura del Proyecto

```
PetCareSolution/
├── auth-service/           # 🔐 Servicio de Autenticación
│   ├── PetCare.Auth/      # API de autenticación con JWT
│   └── README-Auth.md     # 📖 Documentación del Auth Service
├── cliente-service/        # 👤 Servicio de Clientes
├── cuidador-service/       # 🏥 Servicio de Cuidadores
├── request-service/        # 📋 Servicio de Solicitudes
├── chat-service/          # 💬 Servicio de Chat
├── calificar-servicie/    # ⭐ Servicio de Calificaciones
├── docker-compose.yml     # 🐳 Configuración de Docker
└── PetCare.sln           # 🎯 Solución principal
```

---

## 🚀 Guía de Ejecución Local

Actualmente, el desarrollo y las pruebas se realizan en un entorno local. Sigue estos pasos para levantar el ecosistema.

### 📋 Prerrequisitos
1.  **.NET 8.0 SDK** instalado.
2.  **SQL Server** local corriendo en el puerto `1433`.
3.  Usuario `sa` habilitado en SQL Server.

### ⚙️ Configuración de Base de Datos
Cada servicio está configurado para crear automáticamente su base de datos y aplicar las migraciones al iniciarse (`dotnet run`). Asegúrate de que tu cadena de conexión en `appsettings.json` apunte a tu instancia local.

### ▶️ Cómo Iniciar los Servicios

Debes iniciar cada servicio en una terminal separada:

#### 1. Auth Service (Identidad)
```powershell
cd auth-service/PetCare.Auth
dotnet run
# Swagger: http://localhost:5043/swagger
```

#### 2. Cuidador Service (Profesionales)
```powershell
cd cuidador-service/PetCare.Cuidador
dotnet run
# Swagger: http://localhost:5044/swagger
```

#### 3. Cliente Service (Dueños)
```powershell
cd cliente-service/PetCare.Cliente
dotnet run
# Swagger: http://localhost:5045/swagger
```

#### 4. Request Service (Solicitudes)
```powershell
cd request-service/PetCare.Request
dotnet run
# Swagger: http://localhost:5050/swagger
```

#### 5. Calificar Service (Ratings)
```powershell
cd calificar-servicie/PetCare.Calificar
dotnet run
# Swagger: http://localhost:5075/swagger
```

---

## 🔍 Detalles de los Servicios

### 🔐 Auth Service
*   **Responsabilidad:** Autenticación centralizada y autorización.
*   **Funcionalidades:** Login, Registro, Refresh Tokens, Gestión de Roles (Admin, Cliente, Cuidador).
*   **Seguridad:** Emite tokens JWT firmados que son validados por los demás servicios.

### 👤 Cliente Service
*   **Responsabilidad:** Información de los dueños de mascotas.
*   **Funcionalidades:** CRUD de perfil, carga de foto, dirección.
*   **Datos:** Almacena información personal sensible protegida.

### 🏥 Cuidador Service
*   **Responsabilidad:** Información de los proveedores de servicio.
*   **Funcionalidades:** Perfil profesional, tarifas, experiencia, validación de documentos.
*   **Interacción:** Es consultado por el Request Service para validar disponibilidad.

### 📋 Request Service
*   **Responsabilidad:** Orquestación del servicio de cuidado.
*   **Flujo:**
    1.  Cliente crea solicitud (Pendiente).
    2.  Cliente asigna cuidador.
    3.  Cuidador Acepta/Rechaza.
    4.  Servicio en Progreso -> Finalizado.
*   **Validaciones:** Verifica existencia de usuarios y estado de las solicitudes.

### ⭐ Calificar Service (Beta)
*   **Responsabilidad:** Gestión de la reputación.
*   **Funcionalidades:** Permitir a clientes calificar a cuidadores tras un servicio finalizado.
*   **Dependencias:** Consume `Request Service` para verificar que el servicio finalizó.

---

## 🗺️ Roadmap de Desarrollo

El enfoque actual está en completar el ciclo económico y de reputación de la plataforma.

### 🚧 En Progreso / Próximos Pasos

#### 1. ⭐ Rating Service (Refinamiento)
Aunque el servicio base existe, se requiere completar:
*   [ ] Validación estricta de que el servicio ha finalizado (comunicación con Request Service).
*   [ ] Cálculo de promedio de calificaciones para el perfil del Cuidador.
*   [ ] Sistema de comentarios/reseñas de texto.
*   [ ] Moderación de comentarios ofensivos.

#### 2. 💳 Payment Service (Nuevo - Prioridad Alta)
Implementación del módulo de pagos seguros para monetizar la plataforma.
*   **Requisitos Funcionales:**
    *   [ ] Procesamiento de pagos (Integración con pasarela tipo Stripe/PayPal).
    *   [ ] Almacenamiento seguro de métodos de pago (Tokenización).
    *   [ ] Generación de recibos/facturas.
    *   [ ] Gestión de reembolsos.
*   **Seguridad:**
    *   [ ] Cumplimiento PCI-DSS (No guardar CVV, encriptación AES-256 para datos sensibles).
    *   [ ] Auditoría de transacciones.

#### 3. 💬 Chat Service (Futuro)
*   Comunicación en tiempo real entre Cliente y Cuidador durante la solicitud activa.

---

## 🐳 Despliegue con Docker

Si prefieres ejecutar todo el entorno utilizando contenedores (útil para validación de integración o despliegue), puedes usar Docker Compose.

> ⚠️ **Nota:** La configuración de Docker puede no incluir los servicios más recientes (como Calificar Service) si no se ha actualizado el `docker-compose.yml`. Se recomienda el desarrollo local para nuevas funcionalidades.

### Prerrequisitos
*   Docker Desktop instalado y corriendo.

### Comandos

```bash
# 1. Construir y levantar todos los servicios
docker-compose up -d --build

# 2. Verificar estado de los contenedores
docker-compose ps

# 3. Ver logs de un servicio específico (ej. Auth)
docker-compose logs -f petcare-auth

# 4. Detener y eliminar contenedores
docker-compose down
```

### Puertos en Docker
| Servicio | Puerto Host | Swagger URL |
| :--- | :--- | :--- |
| **Auth Service** | `5001` | `http://localhost:5001/swagger` |
| **Cuidador Service** | `5008` | `http://localhost:5008/swagger` |
| **Cliente Service** | `5009` | `http://localhost:5009/swagger` |
| **Request Service** | `5010` | `http://localhost:5010/swagger` |