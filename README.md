## Estructura del proyecto


```text
Sinergia-Tienda-Saludable/
├── front/
│   ├── index.html
│   ├── pages/
│   ├── css/
│   ├── js/
│   ├── data/
│   └── productos/
├── Backend/
│   ├── data/
│   │   ├── clientes.json
│   │   ├── productos.json
│   │   └── pedidos.json
│   ├── routes/
│   ├── index.js
│   └── package.json
└── README.md


```

## Tecnologías utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- LocalStorage para persistir el carrito de compras.
- SessionStorage para mantener los datos del cliente durante la sesión.

### Backend
- Node.js
- Express
- API REST
- Archivos JSON para almacenar clientes, productos y pedidos.

### Cómo ejecutar el proyecto
#### Iniciar el backend
Desde una terminal ubicada en la carpeta del proyecto:
cd Backend
npm install
npm run dev

#### Credenciales de prueba

  Correo electrónico   marcos.rovera@gmail.com
  
  Contraseña            marcos123

### Consideraciones
- El backend debe estar iniciado para que funcionen las consultas y el
  registro de pedidos.
- El navegador puede requerir permiso para abrir ventanas emergentes
  de WhatsApp.

