🐾 PetCare Solution – Módulo Cuidador
📦 Descripción General
Este módulo implementa el flujo completo del cuidador dentro de la plataforma PetCare. Desde el registro, validación de perfil, gestión de solicitudes, hasta el acceso al chat en tiempo real con clientes.

🚀 Funcionalidades Implementadas
🔐 Autenticación y Autorización
Registro con rol (Cliente o Cuidador) en /registro

Completar perfil del cuidador en /registro-final/cuidador

Autenticación con JWT

Persistencia del token en localStorage

Protección de rutas según el rol (PrivateRoute)

Decodificación del JWT para validar roles

Validación automática del token en AuthContext

👤 Perfil del Cuidador
Completar datos personales tras el registro

Estado inicial: Pendiente (requiere validación de administrador)

Acceso al dashboard solo si el estado es Activo

Consulta de perfil con GET /api/cuidador/mi-perfil

📋 Gestión de Solicitudes
Visualización de solicitudes asignadas

Aceptar o rechazar solicitudes

Mostrar solicitudes agrupadas por estado

Uso de useFetch para peticiones con token

Chat disponible solo si el estado de solicitud es: Asignada, Aceptada, En Progreso

💬 Chat con Clientes
Integración con SignalR (WebSocket)

Validación de comunicación activa por estado de solicitud

Apertura del chat por solicitud activa

Conexión al hub usando el token

Interfaz de chat embebida en el dashboard

🧱 Estructura de Archivos Relevante
css
Copiar
Editar
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useFetch.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── RegistroFinal.jsx
│   │   └── Cuidador/
│   │       ├── CuidadorDashboard.jsx
│   │       └── Perfil.jsx (opcional futuro)
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   └── PrivateRoute.jsx
│   └── App.jsx
🧭 Flujo de navegación
El usuario accede a http://localhost:8080/

Si no está autenticado, es redirigido a /login

Puede registrarse como Cuidador en /registro, lo cual redirige a /registro-final/cuidador

Tras enviar su perfil, el sistema indica que debe esperar activación

Si el usuario es Activo, puede acceder a /cliente (si es cliente) o /dashboard (si es cuidador)

