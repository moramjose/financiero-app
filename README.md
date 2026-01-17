# Banco Financiero - Frontend

Aplicación web desarrollada en Angular para la gestión de productos financieros. Este proyecto sigue los principios de **Clean Architecture** y **SOLID**, utilizando las últimas características del framework.

## 🚀 Características Técnicas

*   **Framework**: Angular 20+.
*   **Arquitectura**: Clean Architecture (Separación de capas: features, core, shared).
*   **Gestión de Estado**: Angular Signals (Nativo).
*   **Componentes**: Standalone Components.
*   **Control Flow**: Nueva sintaxis (`@if`, `@for`, `@defer`).
*   **Estilos**: SCSS Puro (Sin librerías de UI como Bootstrap o Tailwind). Diseño Responsive y Pixel Perfect.
*   **Testing**: Jest (Unit Testing).
*   **HTTP**: `provideHttpClient` con Interceptors funcionales y manejo de errores centralizado.
*   **Seguridad**: Proxy reverso configurado para evitar problemas de CORS en desarrollo.

## 📋 Requisitos Previos

Asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (Versión LTS recomendada, v18+).
*   [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`.

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd financiero-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

## ▶️ Ejecución

### 1. Backend (Requerido)
Para que la aplicación funcione correctamente, el servicio backend debe estar ejecutándose en el puerto `3002`.

*   Base URL esperada: `http://localhost:3002/bp/products`

### 2. Frontend (Desarrollo)
La aplicación utiliza un proxy interno (`proxy.conf.json`) para redirigir las peticiones `/bp` al backend y evitar errores de CORS.

Ejecuta el siguiente comando para iniciar el servidor de desarrollo:

```bash
npm start
```
*   Abre tu navegador en `http://localhost:4200`.

## ✅ Testing

El proyecto utiliza **Jest** para las pruebas unitarias. Se ha cubierto la lógica de los servicios y componentes principales.

Para ejecutar los tests:

```bash
npm test
```

Para generar un reporte de cobertura:

```bash
npm test -- --coverage
```

## 📂 Estructura del Proyecto

```text
src/app/
├── core/               # Interceptores, Guards, Servicios Globales
├── features/           # Módulos funcionales (DDD)
│   └── products/
│       ├── components/ # Componentes tontos (Presentational)
│       ├── models/     # Interfaces y Tipos
│       ├── pages/      # Componentes inteligentes (Smart/Pages)
│       └── services/   # Lógica de negocio y comunicación HTTP
├── app.config.ts       # Configuración global (Proveedores)
└── app.routes.ts       # Definición de rutas
```

---
Desarrollado con ❤️ para la Prueba Técnica.
