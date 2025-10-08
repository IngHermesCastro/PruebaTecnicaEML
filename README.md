# 🚀 Prueba Técnica EML -CRUD de Gestión de Usuarios

## Descripción del Proyecto

Aplicación web desarrollada para la **gestión de datos de usuarios (CRUD)** utilizando una arquitectura desacoplada (*frontend* y *backend*). El proyecto utiliza **Angular 19** para la interfaz, **PHP Nativo** para la API, y **Tailwind CSS con DaisyUI** para un diseño moderno y altamente personalizable. El sistema cumple rigurosamente con validaciones de datos exhaustivas, persistencia en **MySQL** y un diseño completamente **responsive**.

---

## Stack Tecnológico ⚙️

| Componente | Tecnología | Versión Clave | Descripción |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Angular** | 19+ | Framework robusto para una interfaz de usuario interactiva, utilizando los estándares de **ES**. |
| | **Tailwind CSS & DaisyUI** | Latest | *Utility-first* CSS y librería de componentes para un diseño ágil, limpio y **responsive**. |
| **Backend** | **PHP** | Nativo (8.x+) | Implementado como *API RESTful* para manejar la lógica de negocio y las consultas SQL. |
| **Base de Datos** | **MySQL** | 8.0+ | Base de datos relacional para el almacenamiento persistente y estructurado de los registros. |
| **Entorno Local** | **XAMPP** | Latest | Plataforma de desarrollo para facilitar la configuración de Apache, PHP y MySQL. |

---

## Requisitos Funcionales y Vistas 📋

El sistema soporta las siguientes operaciones sobre la tabla de usuarios:

### Funcionalidades (CRUD)

* **Listar Usuarios (Read)**: Muestra una tabla de usuarios ordenada **alfabéticamente** (A-Z).
* **Creación de Usuario (Create)**: Permite el registro de nuevos usuarios.
* **Edición de Usuario (Update)**: Permite la modificación de datos. La **fecha de última modificación** se actualiza automáticamente.
* **Eliminación de Usuario (Delete)**: Botón para manejar la eliminación.

### Validaciones y Buenas Prácticas

* **Validación de Datos**: Rigurosa validación (*server-side* y *client-side*) para:
    * Formato de *email* válido.
    * Teléfono sin caracteres no numéricos.
    * **Restricción de duplicidad de correo electrónico**.
* **Manejo de Errores/Éxito**: Implementación de **Alertas/Notificaciones** claras para cada acción CRUD.
* **Calidad del Código**: Código **comentado**, **formateado** y siguiendo **buenas prácticas de programación**.

### 💡 Valores Agregados (Puntos Adicionales)

* Implementación de un campo **"estado"** para la **eliminación lógica** (*soft delete*).
* Uso de **Modales** (DaisyUI/Angular) para formularios de creación y edición.
* Validación avanzada con **Expresiones Regulares (RegEx)**.

---

## Estructura de la Base de Datos (`usuarios`) 💾

| Campo | Tipo de Dato | Null | Índice | Restricción |
| :--- | :--- | :--- | :--- | :--- |
| **id** | INT(11) | NO | PRIMARY KEY, AUTO\_INCREMENT | - |
| **nombres** | VARCHAR(100) | NO | - | - |
| **apellidos** | VARCHAR(100) | NO | - | - |
| **telefono** | VARCHAR(20) | NO | - | - |
| **email** | VARCHAR(100) | NO | UNIQUE | **NO DUPLICADOS** |
| **fecha\_registro** | DATETIME | NO | - | - |
| **fecha\_ultima\_modificacion** | DATETIME | NO | Se actualiza | Se actualiza al editar. |
| **estado** | TINYINT(1) | NO | **Valor Agregado** | 1 (Activo) / 0 (Inactivo - Eliminación Lógica). |

---

## Instrucciones de Ejecución Local (Usando XAMPP)

### 1. Configuración del Backend (PHP y MySQL)

1.  **Instalar XAMPP** e iniciar los servicios **Apache** y **MySQL** desde el Panel de Control.
2.  **Clonar el Repositorio** y mover la carpeta del *backend* (archivos PHP) al directorio `htdocs` de XAMPP.
3.  Acceder a **phpMyAdmin** vía XAMPP y crear la base de datos.
4.  **Importar el *script* SQL** (para la tabla `usuarios`) y configurar las credenciales de conexión a la DB dentro del código PHP.

### 2. Configuración del Frontend (Angular 19)

1.  **Clonar el Repositorio** y acceder al directorio del *frontend* (Angular).
2.  Instalar las dependencias de Node.js:
    ```bash
    npm install
    ```
3.  Verificar que la URL base de la API en el servicio de Angular apunte correctamente a la ubicación de los archivos PHP en el servidor local de XAMPP (ej. `http://localhost:8000/get_users.php`).
4.  Compilar y levantar la aplicación de Angular:
    ```bash
    ng serve --open
    ```
