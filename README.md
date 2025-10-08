# 🚀 Prueba Técnica EML -CRUD de Gestión de Usuarios
## Vistas Previas

### Listado de Usuarios
![Captura de la vista principal del listado de usuarios][<img width="1919" height="1199" alt="Image" src="https://github.com/user-attachments/assets/cb0c2c11-e138-4679-95ff-e16b7e8cc620" />](https://github.com/IngHermesCastro/PruebaTecnicaEML/issues/1#issue-3493730046)

### Formulario de Editarr Usuario
![Captura del formulario para editar un usuario][(<img width="1919" height="1199" alt="Image" src="https://github.com/user-attachments/assets/59e019f8-80ca-4b3b-9afe-579cdfea5647" />
)]

### Boton de Borrar Usuario
![Captura del Boton para eliminar usuario][<img width="1919" height="1199" alt="Image" src="https://github.com/user-attachments/assets/ef200af8-b098-4399-a074-89e5598239fa" />
)]
### Formulario de Creación
![Captura del formulario para crear un nuevo usuario][(<img width="1919" height="1199" alt="Image" src="https://github.com/user-attachments/assets/2546ba5f-bae2-4533-bcad-37d1c1284fce" />
)
]

### Base De Datos - MySQL
![Captura de la Base de Datos]
https://private-user-images.githubusercontent.com/161852864/498661482-5345782b-5624-460a-81e0-7a828f34e889.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTk4OTY1MTIsIm5iZiI6MTc1OTg5NjIxMiwicGF0aCI6Ii8xNjE4NTI4NjQvNDk4NjYxNDgyLTUzNDU3ODJiLTU2MjQtNDYwYS04MWUwLTdhODI4ZjM0ZTg4OS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDA4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAwOFQwNDAzMzJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iNjVlYmQ5YmRjOWE3YmMyMmFjOGQyZGYxNTE4Mjc4NTNlMjA2MmRjZGQ5NDExYzIzMzhiZGFmZTY0YzNjMjg3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.MvuAWTYV_EGkUxwvU_OXg8TmhwP-0UG91uQFHhudLa4



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
