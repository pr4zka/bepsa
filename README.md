# API de Gestión de Tareas - BEPSA

Una API REST desarrollada con NestJS, Prisma y PostgreSQL para la gestión de tareas, como parte de la prueba técnica de BEPSA.

## 🚀 Tecnologías Utilizadas

- **Framework**: NestJS v10.0.0
- **ORM**: Prisma v6.12.0
- **Base de datos**: PostgreSQL
- **Autenticación**: API Key
- **Documentación**: Swagger/OpenAPI
- **Contenedores**: Docker & Docker Compose
- **Validación**: class-validator
- **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure)

## 📋 Características

- ✅ **3 endpoints principales**: Crear, Listar (con filtros) y Actualizar estado
- ✅ **Autenticación por API Key**: Seguridad en todos los endpoints
- ✅ **Documentación automática**: Swagger UI integrado
- ✅ **Validación de datos**: Validación robusta con mensajes personalizados
- ✅ **Manejo de errores**: Filtro global de excepciones con formato consistente
- ✅ **Arquitectura limpia**: Separación clara de responsabilidades
- ✅ **Dockerizada**: Fácil despliegue con Docker Compose

## 🏗️ Arquitectura del Proyecto

```
src/
├── tareas/
│   ├── domain/                 # Entidades y reglas de negocio
│   │   ├── tarea.entity.ts
│   │   ├── tarea-status.enum.ts
│   │   └── tarea.repository.ts
│   ├── application/            # Casos de uso
│   │   ├── create-tarea.use.case.ts
│   │   ├── list-tareas.use.case.ts
│   │   └── update-tarea-status.use-case.ts
│   └── infrastructure/         # Controladores, DTOs y repositorios
│       ├── tarea.controller.ts
│       ├── tarea.repository.prisma.ts
│       └── dto/
├── auth/                      # Autenticación
├── shared/                    # Código compartido
│   └── filters/              # Filtros de excepciones
└── prisma/                  
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/pr4zka/bepsa.git
cd bepsa
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT = 3000
DATABASE_URL="postgresql://tareas_user:tareas_pass@postgres:5432/tareas_db"
POSTGRES_USER=tareas_user
POSTGRES_PASSWORD=tareas_pass
POSTGRES_DB=tareas_db

```

### 3. Instalación con Docker (Recomendado)

```bash
# Iniciar los servicios
docker-compose up --build

# En modo detached (segundo plano)
docker-compose up -d --build
```

### 4. Instalación local (alternativa)

```bash
# Instalar dependencias
npm install

# Iniciar PostgreSQL con Docker
docker-compose up postgres -d

# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar el cliente de Prisma
npx prisma generate

# Iniciar la aplicación
npm run start:dev
```

## 🚀 Ejecutar la Aplicación

### Con Docker Compose

```bash
# Construcción y ejecución
docker-compose up --build

# Solo ejecución (si ya está construido)
docker-compose up

# Parar los servicios
docker-compose down
```

### Localmente

```bash
# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000`

## 📚 Documentación de la API

### Swagger UI
Accede a la documentación interactiva en: `http://localhost:3000/api`

### Autenticación
Todos los endpoints requieren el header:
```
x-api-key: the-goat-api-key
```

### Endpoints Disponibles

#### 1. **GET** `/tareas` - Listar Tareas

Obtiene todas las tareas con filtros opcionales.

**Query Parameters:**
- `estado` (opcional): `PENDIENTE` | `EN_PROGRESO` | `COMPLETADA`

**Ejemplo de Request:**
```bash
curl -X GET "http://localhost:3000/tareas?estado=PENDIENTE" \
  -H "x-api-key: the-goat-api-key"
```

**Ejemplo de Response:**
```json
[
  {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "title": "Completar proyecto",
    "description": "Finalizar la implementación de la API",
    "status": "PENDIENTE",
    "completed": false,
    "fecha": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-07-28T22:30:00.000Z",
    "updatedAt": "2025-07-28T22:30:00.000Z"
  }
]
```

#### 2. **POST** `/tareas` - Crear Nueva Tarea

Crea una nueva tarea en el sistema.

**Request Body:**
```json
{
  "title": "Completar proyecto",
  "description": "Finalizar la implementación de la API",
  "fecha": "2025-12-31T23:59:59Z" // Opcional, por defecto fecha actual
}
```

**Ejemplo de Request:**
```bash
curl -X POST "http://localhost:3000/tareas" \
  -H "Content-Type: application/json" \
  -H "x-api-key: the-goat-api-key" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea"
  }'
```

**Ejemplo de Response (201):**
```json
{
  "id": "clr1k2j3k4l5m6n7o8p9",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "PENDIENTE",
  "completed": false,
  "fecha": "2025-07-28T22:30:00.000Z",
  "createdAt": "2025-07-28T22:30:00.000Z",
  "updatedAt": "2025-07-28T22:30:00.000Z"
}
```

#### 3. **PATCH** `/tareas/:id/status` - Actualizar Estado

Actualiza el estado de una tarea específica.

**Path Parameters:**
- `id`: ID único de la tarea

**Request Body:**
```json
{
  "status": "COMPLETADA"
}
```

**Ejemplo de Request:**
```bash
curl -X PATCH "http://localhost:3000/tareas/clr1k2j3k4l5m6n7o8p9/status" \
  -H "Content-Type: application/json" \
  -H "x-api-key: the-goat-api-key" \
  -d '{
    "status": "COMPLETADA"
  }'
```

**Ejemplo de Response (200):**
```json
{
  "id": "clr1k2j3k4l5m6n7o8p9",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "COMPLETADA",
  "completed": true,
  "fecha": "2025-07-28T22:30:00.000Z",
  "createdAt": "2025-07-28T22:30:00.000Z",
  "updatedAt": "2025-07-28T22:35:00.000Z"
}
```

### Estados Disponibles
- `PENDIENTE`: Tarea recién creada
- `EN_PROGRESO`: Tarea en desarrollo  
- `COMPLETADA`: Tarea finalizada

### Respuestas de Error

**400 - Bad Request:**
```json
{
  "statusCode": 400,
  "timestamp": "2025-07-28T22:18:34.968Z",
  "path": "/tareas",
  "method": "POST",
  "message": [
    "title is required",
    "description is required"
  ]
}
```

**401 - Unauthorized:**
```json
{
  "statusCode": 401,
  "timestamp": "2025-07-28T22:18:34.968Z",
  "path": "/tareas",
  "method": "GET",
  "message": ["API Key inválida o faltante"]
}
```

**404 - Not Found:**
```json
{
  "statusCode": 404,
  "timestamp": "2025-07-28T22:18:34.968Z",
  "path": "/tareas/invalid-id/status",
  "method": "PATCH",
  "message": ["Tarea no encontrada"]
}
```

## 🛠️ Decisiones Técnicas

### 1. **Arquitectura Clean Architecture**
- **Dominio**: Entidades y reglas de negocio puras
- **Aplicación**: Casos de uso que orquestan la lógica
- **Infraestructura**: Detalles técnicos (DB, HTTP, etc.)

**Justificación**: Facilita el mantenimiento, testing y escalabilidad.

### 2. **Prisma como ORM**
- Type-safety completo
- Migraciones automáticas
- Cliente optimizado
- Excelente tooling

**Justificación**: Reduce boilerplate y mejora la productividad del desarrollo.

### 3. **Autenticación por API Key**
- Simple de implementar
- Adecuado para APIs internas
- Fácil de documentar

**Justificación**: Cumple los requerimientos sin over-engineering.

### 4. **Validación con class-validator**
- Decoradores declarativos
- Mensajes personalizables
- Integración nativa con NestJS

**Justificación**: Validación robusta con código limpio.

### 5. **Filtro Global de Excepciones**
- Respuestas consistentes
- Manejo centralizado de errores
- Logs estructurados

**Justificación**: Mejora la experiencia del desarrollador y debugging.

### 6. **Docker Multi-stage Build**
- Optimización de imagen
- Consistencia entre entornos
- Fácil despliegue

**Justificación**: Simplifica el deployment y reduce problemas de entorno.

### 7. **Swagger/OpenAPI**
- Documentación automática
- Testing interactivo
- Contratos de API claros

**Justificación**: Reduce la documentación manual y mejora la comunicación.

## 📊 Base de Datos

### Esquema de la Tabla `Task`

```sql
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDIENTE',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
```

### Gestión de Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (solo desarrollo)
npx prisma migrate reset
```


**Desarrollado para BEPSA** - Prueba Técnica
