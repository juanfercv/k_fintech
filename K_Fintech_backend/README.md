# k_fintech
# Estructura del Proyecto y Arquitectura

Este proyecto ha migrado de una estructura MVC tradicional a una **Arquitectura Hexagonal** (también conocida como *Ports and Adapters*). El objetivo de este cambio es desacoplar la lógica de negocio de las herramientas externas (como Express, MySQL o librerías de terceros) para hacer el sistema más mantenible, escalable y fácil de testear.

## Desglose de Carpetas

A continuación se detalla la responsabilidad de cada directorio en la nueva estructura:

### 1. src/domain (El Núcleo)
* **Contenido:** Modelos y lógica de negocio pura.
* **Razón del cambio:** En esta arquitectura, el Dominio es el centro de la aplicación y no debe depender de nada externo. Aquí se definen las reglas de negocio y entidades, independientemente de la base de datos o el framework web utilizado.

### 2. src/infrastructure (Los Adaptadores)
Esta carpeta contiene todo el código que conecta el Dominio con el mundo exterior. Se divide en sub-carpetas específicas según su responsabilidad técnica.

#### infrastructure/http (Adaptador Web)
* **Contenido:** Controladores, Enrutadores, Vistas (views) y Archivos Públicos (public).
* **Razón del cambio:** En la Arquitectura Hexagonal, la interfaz web se considera un "mecanismo de entrega" y no la aplicación en sí misma.
    * **Vistas y Public:** Se movieron dentro de esta carpeta porque el HTML, CSS y las imágenes pertenecen exclusivamente a la interfaz web. Al encapsularlos aquí, se asegura que si en el futuro se implementa otro tipo de interfaz (como una API REST pura o una aplicación móvil), los archivos visuales de la web no interfieran ni se mezclen con la lógica central.

#### infrastructure/Database (Adaptador de Persistencia)
* **Contenido:** Configuración de conexión SQL y ORM.
* **Razón del cambio:** La base de datos es tratada como un servicio externo. La aplicación utiliza la base de datos para persistir información, pero la lógica de negocio no debe estar acoplada a un motor específico. Esto facilita cambiar de motor de base de datos sin afectar el dominio.

#### infrastructure/lib (Librerías y Herramientas)
* **Contenido:** Passport, Auth, Handlebars helpers.
* **Razón del cambio:** Las librerías de terceros (como Passport para autenticación) y las utilidades técnicas son detalles de implementación y soporte. Pertenecen a la capa de infraestructura porque resuelven problemas técnicos, no problemas de negocio.

### 3. root (Arranque del Sistema)
* **Contenido:** app.js e index.js.
* **Razón del cambio:** Se separó el código de arranque del código fuente (src). Esta carpeta es la encargada de iniciar el servidor, inyectar dependencias y configurar variables de entorno, actuando como el punto de entrada único de la aplicación.

## Conceptos Clave de la Arquitectura

Para comprender el flujo de la aplicación, es fundamental distinguir los tipos de adaptadores y la función de la capa de aplicación.

### Adaptadores de Entrada y Salida

En la Arquitectura Hexagonal, se distingue entre el "Lado Conductor" (Driving) y el "Lado Conducido" (Driven):

#### 1. Adaptadores de Entrada (Driving Adapters)
Son los actores que inician la interacción con el sistema. "Conducen" la aplicación para que ejecute una acción.
* **En este proyecto:** Todo el contenido de `src/infrastructure/http`.
* **Ejemplo:** Cuando un usuario envía un formulario desde la vista, el **Controlador** actúa como adaptador de entrada recibiendo la petición HTTP.

#### 2. Adaptadores de Salida (Driven Adapters)
Son las herramientas externas que la aplicación necesita llamar para completar una tarea. La aplicación "conduce" a estos adaptadores.
* **En este proyecto:**
    * `src/infrastructure/Database`: La aplicación ordena a la base de datos guardar información.
    * `src/infrastructure/lib`: La aplicación utiliza Passport para validar credenciales.

### La Capa Application (Casos de Uso)

Ubicada en `src/application`, esta capa contiene los **Casos de Uso** del sistema.

* **Función:** Representa el "Qué hace" la aplicación. Su responsabilidad es orquestar el flujo de datos entre los adaptadores de entrada (UI), las reglas de negocio (Dominio) y los adaptadores de salida (Base de Datos).
* **Diferencia con el Dominio:** El Dominio contiene las reglas (ej: "una factura no puede ser negativa"), mientras que la Aplicación contiene el proceso (ej: "Recibir datos -> Validar -> Guardar -> Enviar Email").
* **Ejemplos de archivos en esta capa:** `CrearFacturaService.js`, `RegistrarUsuario.js`.

## Beneficios de esta Estructura

* **Independencia del Framework:** Facilita la migración o actualización del framework web tocando únicamente la capa de infraestructura HTTP.
* **Independencia de la Base de Datos:** La lógica de negocio permanece aislada de los detalles de conexión y consultas SQL específicas.
* **Organización Semántica:** Provee una distinción clara entre lo que es lógica de negocio (Dominio), lo que es coordinación (Aplicación) y lo que son detalles técnicos (Infraestructura).
K_FINTECH
K_FINTECH
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
├── node_modules
├── root
│   ├── app.js               <-- Configura Express y rutas
│   └── index.js             <-- Punto de entrada
└── src
    ├── application          
    ├── config
    │   └── keys.js          
    ├── domain               
    │   ├── models           
    │   │   ├── cliente.js
    │   │   ├── detalle_factura.js
    │   │   ├── detalle_total.js
    │   │   ├── dueño.js
    │   │   ├── factura.js
    │   │   ├── forma_pago.js
    │   │   └── tienda.js
    │   └── services         
    └── infrastructure       
        ├── Database         
        │   ├── dataBase.orm.js
        │   └── dataBase.sql.js
        ├── http             <-- ADAPTADOR WEB (Todo lo web vive aquí)
        │   ├── controller   
        │   │   ├── factura.controller.js
        │   │   ├── index.controller.js
        │   │   ├── principal.controller.js
        │   │   ├── registro.controller.js
        │   │   ├── tienda.controller.js
        │   │   └── vista.controller.js
        │   ├── public       <-- MOVIDO AQUÍ (Dentro de http)
        │   │   ├── css
        │   │   │   ├── agregar.css
        │   │   │   ├── crear.css
        │   │   │   ├── factura.css
        │   │   │   ├── formulario.css
        │   │   │   ├── inicio.css
        │   │   │   ├── login.css
        │   │   │   ├── registro.css
        │   │   │   ├── tienda.css
        │   │   │   └── vista.css
        │   │   └── img
        │   │       ├── agregar.png
        │   │       ├── bg.jpg
        │   │       ├── file.png
        │   │       ├── fondo.png
        │   │       ├── logo.png
        │   │       ├── registro-bg.png
        │   │       └── tienda.jpeg
        │   ├── router       
        │   │   ├── factura.router.js
        │   │   ├── index.rutas.js
        │   │   ├── principal.router.js
        │   │   ├── registro.rutas.js
        │   │   ├── tienda.router.js
        │   │   └── vista.router.js
        │   └── views        
        │       ├── factura
        │       │   ├── add.hbs
        │       │   ├── formulario.hbs
        │       │   └── lista.hbs
        │       ├── layouts
        │       │   └── main.hbs
        │       ├── login
        │       │   ├── login.hbs
        │       │   └── registro.hbs
        │       ├── partials
        │       │   ├── footer.hbs
        │       │   ├── message.hbs
        │       │   └── navegacion.hbs
        │       ├── principal
        │       │   └── principal.hbs
        │       └── tienda
        │           ├── agregar.hbs
        │           ├── editar.hbs
        │           ├── index.hbs
        │           └── lista.hbs
        └── lib              
            ├── auth.js
            ├── handlebars.js
            ├── helpers.js
            └── passport.js