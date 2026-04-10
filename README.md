# Documentación del Proyecto Final: Pipeline DevOps

Este proyecto consiste en el diseño e implementación de un ciclo de vida de software automatizado para una aplicación web basada en Node.js. El objetivo principal es demostrar la integración de herramientas de control de versiones, contenedores, pruebas automatizadas, despliegue continuo y monitoreo básico.

**URL de produccion:** [https://practica-final-electiva-1.onrender.com/](https://practica-final-electiva-1.onrender.com/)

---

## 1. Guía de Instalación y Configuración

### Requisitos previos
* Node.js (versión 18 o superior)
* Docker Desktop (para ejecución mediante contenedores)
* Git

### Ejecución en entorno local
Para ejecutar la aplicación directamente en su máquina de desarrollo, siga estos pasos:

1. Clone el repositorio:
   `git clone https://github.com/Mejia26/practica-final-electiva-1.git`
2. Ingrese al directorio del proyecto:
   `cd practica-final-electiva-1/app`
3. Instale las dependencias necesarias:
   `npm install`
4. Inicie el servidor:
   `npm start`
5. Acceda a la aplicación en su navegador a través de la dirección `http://localhost:3000`.

### Ejecución con Docker
Si prefiere utilizar contenedores para asegurar la paridad de entornos:

1. Construya la imagen del contenedor:
   `docker build -t practica-final-electiva-1 .`
2. Ejecute el contenedor mapeando el puerto 3000:
   `docker run -p 3000:3000 practica-final-electiva-1`

---

## 2. Documentación del Pipeline CI/CD

El pipeline ha sido implementado utilizando **GitHub Actions** y se activa automáticamente con cada actualización de código en la rama principal. El flujo está diseñado para garantizar que solo el código que cumple con los estándares de calidad llegue al servidor de producción.

### Etapa 1: Integración Continua (Test & Lint)
En esta fase, el sistema levanta un entorno virtual, instala las dependencias y ejecuta:
* **Análisis de código estático:** Revisa la sintaxis y el cumplimiento de estándares.
* **Pruebas Unitarias e Integración:** Se utiliza la librería Jest para validar que la lógica del servidor y los endpoints de la API funcionen correctamente. Si alguna prueba falla, el pipeline se detiene y bloquea el despliegue.

### Etapa 2: Construcción (Docker Build)
Tras superar las pruebas, el pipeline construye la imagen de Docker utilizando las instrucciones del Dockerfile. Esto garantiza que el artefacto generado incluya todas las librerías y configuraciones necesarias para su ejecución.

### Etapa 3: Despliegue Continuo (CD)
Una vez construida la imagen, el pipeline envía una notificación a la infraestructura de Render mediante un Webhook para iniciar la actualización del servicio en vivo de forma automática.

---

## 3. Manual de Operaciones y Monitoreo

La aplicación incluye herramientas integradas para la supervisión de su estado en tiempo real.

### Monitoreo de Salud y Métricas
Se han habilitado rutas específicas para verificar la integridad del sistema:
* **Check de Salud:** `/health` - Informa si el servidor está operativo y responde correctamente.
* **Métricas de Rendimiento:** `/metrics` - Proporciona datos técnicos sobre el uso de memoria del servidor, el tiempo de actividad y la plataforma de ejecución.
* **Trazabilidad de Versión:** `/api/version` - Muestra el identificador único (Git SHA) de la versión actual, lo que permite confirmar que el último cambio en el código se ha aplicado correctamente.

### Gestión de Logs
Se ha implementado la librería **Morgan** para el registro centralizado de peticiones. Todos los eventos de acceso y errores del servidor son capturados en tiempo real, facilitando la identificación de posibles fallos en el entorno de producción.

---

## 4. Desafíos y Lecciones Aprendidas

### Desafíos encontrados
De manera teórica es muy fácil diseñar una solución como esta, pero en la práctica es totalmente diferente. Aquí aparecen unos errores que uno nunca se imagina, y aunque a veces son pequeños producen estres al no saber qué esta fallando. A parte de los errores inpredecibles, creo que no fue tan dificil poder hacer esta practica, pero si tuviera que elegir lo que mas me costó diría que desarrollar en express, porque es primera vez que lo hago

### Soluciones implementadas
Se reorganizó la estructura de carpetas para centralizar los archivos de prueba dentro del directorio `/app`, permitiendo una referencia de rutas consistente tanto en local como en la nube. Además, se configuraron variables de entorno dinámicas en Render para inyectar automáticamente el identificador de la versión en el frontend de la aplicación.

### Lecciones aprendidas
La práctica permitió consolidar la importancia de la automatización en el desarrollo moderno. La capacidad de detectar errores mediante pruebas automáticas antes del despliegue reduce significativamente el riesgo de interrupciones en el servicio, mientras que la contenerización con Docker elimina los conflictos de compatibilidad entre diferentes sistemas operativos.
