# Gestión de Contenedores Individuales PetCare 🐳

Este documento explica cómo levantar, bajar y reconstruir **solo los contenedores** de cada microservicio (API y base de datos) usando `docker-compose`.

---

## Cliente Service

### Reconstruir la imagen de Cliente Service
```bash
# Si cambiaste el código fuente o dependencias:
docker-compose build --no-cache petcare-cliente
```

### Levantar solo Cliente Service y su base de datos
```bash
# Levantar base de datos y API Cliente
# (desde la raíz del proyecto)
docker-compose up -d db-cliente petcare-cliente
```

### Bajar solo Cliente Service y su base de datos
```bash
# Detener API y base de datos Cliente
docker-compose stop petcare-cliente db-cliente

# (Opcional) Eliminar contenedores detenidos
docker-compose rm -f petcare-cliente db-cliente
```

### Ver logs de Cliente Service
```bash
docker-compose logs -f petcare-cliente
```

### Ver logs de la base de datos Cliente
```bash
docker-compose logs -f db-cliente
```

---

## Cuidador Service

### Reconstruir la imagen de Cuidador Service
```bash
docker-compose build --no-cache petcare-cuidador
```

### Levantar solo Cuidador Service y su base de datos
```bash
docker-compose up -d db-cuidador petcare-cuidador
```

### Bajar solo Cuidador Service y su base de datos
```bash
docker-compose stop petcare-cuidador db-cuidador
docker-compose rm -f petcare-cuidador db-cuidador
```

### Ver logs de Cuidador Service
```bash
docker-compose logs -f petcare-cuidador
```

### Ver logs de la base de datos Cuidador
```bash
docker-compose logs -f db-cuidador
```

---

## Auth Service

### Reconstruir la imagen de Auth Service
```bash
docker-compose build --no-cache petcare-auth
```

### Levantar solo Auth Service y su base de datos
```bash
docker-compose up -d db-auth petcare-auth
```

### Bajar solo Auth Service y su base de datos
```bash
docker-compose stop petcare-auth db-auth
docker-compose rm -f petcare-auth db-auth
```

### Ver logs de Auth Service
```bash
docker-compose logs -f petcare-auth
```

### Ver logs de la base de datos Auth
```bash
docker-compose logs -f db-auth
```

---

## Notas
- Puedes combinar servicios en un solo comando, por ejemplo:
  ```bash
  docker-compose up -d db-auth petcare-auth db-cuidador petcare-cuidador
  ```
- Para ver el estado de todos los contenedores:
  ```bash
  docker-compose ps
  ```
- Para eliminar todos los contenedores detenidos:
  ```bash
  docker-compose rm -f
  ```

---

**¡Gestiona tus microservicios de PetCare de forma flexible! 🐾** 