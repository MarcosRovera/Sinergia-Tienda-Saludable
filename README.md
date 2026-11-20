## Sinergia Tienda Saludable



El proyecto cuenta con un frontend desarrollado con HTML, CSS y JavaScript, y un backend desarrollado con Node.js y Express, conectado a una base de datos MongoDB.

### Tecnologías utilizadas

#### Frontend 

* HTML5
* CSS3
* JavaScript
* LocalStorage 
* SessionStorage 

#### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* API REST
* JWT (JSON Web Token) para la autenticación y protección de rutas.
* Bcrypt para el cifrado de contraseñas.
* .env para la gestión de variables de entorno.
* CORS para permitir la comunicación entre frontend y backend.

### Estructura del proyecto

Sinergia-Tienda-Saludable/
├── frontend/
│   ├── index.html
│   ├── pages/
│   ├── css/
│   ├── js/
│   ├── data/
│   └── productos/
│
├── Backend/
│   ├── data/
│   │   ├── clientes.json
│   │   ├── productos.json
│   │   └── pedidos.json
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── scripts/
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md

### Requisitos previos

Para ejecutar el proyecto se necesita:

* Node.js y npm.
* MongoDB Community Server instalado y en ejecución.
* Un navegador web.

Instalación y configuración

1. Clonar el repositorio

git clone https://github.com/MarcosRovera/Sinergia-Tienda-Saludable.git

Ingresar a la carpeta del proyecto:

cd Sinergia-Tienda-Saludable

2. Configurar el backend

Ingresar a la carpeta Backend:

cd Backend

Instalar las dependencias:

npm install

3. Configurar las variables de entorno

Crear un archivo .env dentro de la carpeta Backend, tomando como referencia .env.example.

Configurar las siguientes variables:

MONGO_URI=mongodb://localhost:27017/sinergia
JWT_SECRET=clave

* MONGO_URI: dirección de conexión a MongoDB.
* JWT_SECRET: clave privada utilizada para firmar los tokens de autenticación.

4. Iniciar el servidor

Ejecutar:

npm run dev

El backend se ejecutará en:

http://localhost:3000

### Base de datos

Se utiliza MongoDB como sistema de gestión de base de datos.

La base de datos se denomina sinergia y contiene las colecciones:

* clientes
* productos
* pedidos

Los archivos JSON ubicados en Backend/data/ se conservan como datos de origen para el proceso de migración a MongoDB.


### Consideraciones

* MongoDB debe estar iniciado antes de ejecutar el backend.
* El backend debe permanecer activo para que funcionen las consultas y el registro de pedidos.
* El archivo .env contiene información privada y no debe subirse al repositorio.
* El navegador puede requerir permiso para abrir ventanas emergentes o redirigir a WhatsApp.

### Usuario de prueba

* marcos.rovera@gmail.com
* marcos123
