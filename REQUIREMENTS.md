# 📋 Requisitos del Proyecto PetCare Solution

Este documento detalla los requisitos funcionales y no funcionales del sistema, así como el mapeo de seguridad con Common Criteria y la tabla de agrupación por Sprint/Tipo.

## 1. Requisitos Funcionales

### 🔐 Módulo de Autenticación (Auth Service)
*   **RF-AUTH-01:** El sistema debe permitir el registro de nuevos usuarios con roles específicos (Cliente, Cuidador).
*   **RF-AUTH-02:** El sistema debe permitir el inicio de sesión mediante credenciales (email y contraseña) y devolver un token JWT.
*   **RF-AUTH-03:** El sistema debe gestionar roles de usuario (Admin, Cliente, Cuidador) para controlar el acceso.
*   **RF-AUTH-04:** El sistema debe permitir el restablecimiento de contraseñas (Reset Password).
*   **RF-AUTH-05:** El sistema debe validar la unicidad del correo electrónico durante el registro.

### 👤 Módulo de Clientes (Cliente Service)
*   **RF-CLI-01:** El cliente debe poder crear y gestionar su perfil personal.
*   **RF-CLI-02:** El cliente debe poder visualizar la lista de cuidadores disponibles.
*   **RF-CLI-03:** El sistema (Admin) debe permitir la verificación de documentos de identidad del cliente.
*   **RF-CLI-04:** El cliente debe poder eliminar su cuenta (Soft Delete).

### 🏥 Módulo de Cuidadores (Cuidador Service)
*   **RF-CUID-01:** El cuidador debe poder crear y gestionar su perfil profesional.
*   **RF-CUID-02:** El sistema (Admin) debe permitir la verificación de documentos y certificaciones del cuidador.
*   **RF-CUID-03:** El cuidador debe poder establecer su disponibilidad (implícito en gestión de perfil).

### 📋 Módulo de Solicitudes (Request Service)
*   **RF-REQ-01:** El cliente debe poder crear una solicitud de servicio para su mascota.
*   **RF-REQ-02:** El cliente debe poder asignar un cuidador a una solicitud.
*   **RF-REQ-03:** El cuidador debe poder aceptar o rechazar una solicitud asignada.
*   **RF-REQ-04:** El sistema debe gestionar el ciclo de vida de la solicitud (Pendiente -> Asignada -> Aceptada -> En Progreso -> Finalizada).
*   **RF-REQ-05:** El cliente debe poder cancelar una solicitud antes de que sea iniciada.

---

## 2. Requisitos No Funcionales

### 🏗️ Arquitectura y Diseño
*   **RNF-ARQ-01:** El sistema debe seguir una arquitectura de microservicios desacoplados.
*   **RNF-ARQ-02:** Cada microservicio debe tener su propia base de datos independiente (Database per Service).
*   **RNF-ARQ-03:** La comunicación entre servicios debe ser asíncrona o mediante APIs RESTful seguras.

### 🔒 Seguridad
*   **RNF-SEG-01:** La autenticación debe realizarse mediante tokens JWT (JSON Web Tokens).
*   **RNF-SEG-02:** Las contraseñas deben almacenarse encriptadas (hashing) utilizando algoritmos robustos (ASP.NET Core Identity).
*   **RNF-SEG-03:** El sistema debe forzar políticas de contraseña segura (mínimo 8 caracteres, mayúsculas, números).
*   **RNF-SEG-04:** Todas las comunicaciones externas deben realizarse sobre HTTPS.

### 🚀 Escalabilidad y Despliegue
*   **RNF-DEP-01:** El sistema debe ser desplegable mediante contenedores Docker.
*   **RNF-DEP-02:** La orquestación de servicios en desarrollo debe gestionarse con Docker Compose.

### 📊 Mantenibilidad y Calidad
*   **RNF-MAN-01:** El código debe seguir los principios SOLID y Clean Architecture.
*   **RNF-MAN-02:** Cada servicio debe exponer documentación de su API mediante Swagger/OpenAPI.
*   **RNF-MAN-03:** El sistema debe contar con logs de aplicación para diagnóstico de errores.

---

## 3. Mapeo de Seguridad (Common Criteria Parte 2)

La siguiente tabla mapea los requisitos de seguridad implementados con las familias de requisitos funcionales de seguridad de Common Criteria Parte 2.

| ID Requisito | Descripción de la Funcionalidad | Clase CC | Familia CC | Componente CC | Descripción del Componente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Login con usuario y contraseña | **FIA** (Identificación y Autenticación) | **FIA_UID** | **FIA_UID.1** | El TSF (TOE Security Functionality) debe permitir la identificación de usuarios antes de cualquier acción mediada por el TSF. |
| **SEC-02** | Generación y validación de JWT | **FIA** (Identificación y Autenticación) | **FIA_UAU** | **FIA_UAU.1** | El TSF debe permitir la autenticación de usuarios antes de cualquier acción mediada por el TSF. |
| **SEC-03** | Roles (Admin, Cliente, Cuidador) | **FDP** (Protección de Datos de Usuario) | **FDP_ACC** | **FDP_ACC.1** | El TSF debe imponer la política de control de acceso basada en roles sobre los objetos del sistema. |
| **SEC-04** | Restricción de endpoints por rol | **FDP** (Protección de Datos de Usuario) | **FDP_ACF** | **FDP_ACF.1** | El TSF debe imponer atributos de seguridad (roles) para determinar si una operación es permitida. |
| **SEC-05** | Creación y gestión de roles | **FMT** (Gestión de Seguridad) | **FMT_MSA** | **FMT_MSA.1** | El TSF debe restringir la capacidad de gestionar atributos de seguridad (roles) a usuarios autorizados (Admin). |
| **SEC-06** | Reset de contraseña | **FMT** (Gestión de Seguridad) | **FMT_SMF** | **FMT_SMF.1** | El TSF debe ser capaz de realizar funciones de gestión de seguridad (como cambio de credenciales). |
| **SEC-07** | Logs de sistema y migraciones | **FAU** (Auditoría de Seguridad) | **FAU_GEN** | **FAU_GEN.1** | El TSF debe ser capaz de generar datos de auditoría para eventos iniciables (arranque, errores). |
| **SEC-08** | Expiración de Token JWT | **FPT** (Protección del TSF) | **FPT_STM** | **FPT_STM.1** | El TSF debe ser capaz de proporcionar marcas de tiempo fiables (usado para validar `exp` en JWT). |

---

## 4. Tabla Final: Requisitos por Sprint/Tipo y Clase

Esta tabla agrupa todos los requisitos identificados por el tipo de módulo (simulando Sprints de desarrollo) y su clase (Funcional, No Funcional, Seguridad).

| Sprint / Tipo (Módulo) | Clase | ID | Descripción Corta | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1: Core & Auth** | Funcional | RF-AUTH-01 | Registro de Usuarios | Alta |
| **Sprint 1: Core & Auth** | Funcional | RF-AUTH-02 | Login y Emisión de JWT | Alta |
| **Sprint 1: Core & Auth** | Seguridad | RNF-SEG-01 | Implementación JWT | Crítica |
| **Sprint 1: Core & Auth** | Seguridad | RNF-SEG-02 | Hashing de Contraseñas | Crítica |
| **Sprint 1: Core & Auth** | Funcional | RF-AUTH-03 | Gestión de Roles | Alta |
| **Sprint 2: Gestión Usuarios** | Funcional | RF-CLI-01 | Perfil de Cliente | Media |
| **Sprint 2: Gestión Usuarios** | Funcional | RF-CUID-01 | Perfil de Cuidador | Media |
| **Sprint 2: Gestión Usuarios** | Funcional | RF-CLI-03 | Verificación Documentos (Cliente) | Alta |
| **Sprint 2: Gestión Usuarios** | Funcional | RF-CUID-02 | Verificación Documentos (Cuidador) | Alta |
| **Sprint 3: Operaciones** | Funcional | RF-REQ-01 | Crear Solicitud | Alta |
| **Sprint 3: Operaciones** | Funcional | RF-REQ-02 | Asignar Cuidador | Alta |
| **Sprint 3: Operaciones** | Funcional | RF-REQ-03 | Aceptar/Rechazar Solicitud | Alta |
| **Sprint 3: Operaciones** | Funcional | RF-REQ-04 | Flujo de Estados Solicitud | Alta |
| **Transversal** | No Funcional | RNF-ARQ-01 | Arquitectura Microservicios | Crítica |
| **Transversal** | No Funcional | RNF-DEP-01 | Dockerización | Alta |
| **Transversal** | No Funcional | RNF-MAN-02 | Documentación Swagger | Media |
