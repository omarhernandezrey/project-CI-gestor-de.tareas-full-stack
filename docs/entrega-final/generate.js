const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  BorderStyle, AlignmentType, WidthType, ShadingType, PageNumber, Footer,
  NumberFormat, convertInchesToTwip, LevelFormat, UnderlineType,
} = require('docx');
const fs = require('fs');

// ─── helpers ─────────────────────────────────────────────────────────────────
const DARK_BLUE = '1F4E79';
const LIGHT_BLUE = 'DEEAF1';
const WHITE = 'FFFFFF';
const ARIAL = 'Arial';

const hp = (pt) => pt * 2; // half-points

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: ARIAL, size: hp(16), bold: true, color: DARK_BLUE })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, font: ARIAL, size: hp(13), bold: true, color: '2E74B5' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: ARIAL, size: hp(12), bold: true })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160 },
    children: [new TextRun({ text, font: ARIAL, size: hp(11), ...opts })],
  });
}

function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100 },
    indent: { left: convertInchesToTwip(0.5) },
    children: [new TextRun({ text: `• ${text}`, font: ARIAL, size: hp(11) })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new TextRun({ break: 1 })] });
}

function space() {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun('')] });
}

function centered(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text, font: ARIAL, size: hp(11), ...opts })],
  });
}

function headerCell(text) {
  return new TableCell({
    shading: { fill: DARK_BLUE, type: ShadingType.SOLID },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: ARIAL, size: hp(10), bold: true, color: WHITE })],
    })],
  });
}

function dataCell(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), font: ARIAL, size: hp(10), ...opts })],
    })],
  });
}

function table(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map(headerCell), tableHeader: true }),
      ...rows.map(row => new TableRow({ children: row.map(cell => dataCell(cell)) })),
    ],
  });
}

// ─── document ────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'Omar Hernández Rey',
  title: 'Entrega Final Project CI',
  description: 'Documento académico unificado E1+E2+E3',
  styles: {
    default: {
      document: {
        run: { font: ARIAL, size: hp(11) },
      },
    },
  },
  sections: [{
    properties: {},
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Página ', font: ARIAL, size: hp(9) }),
            new TextRun({ children: [PageNumber.CURRENT], font: ARIAL, size: hp(9) }),
            new TextRun({ text: ' de ', font: ARIAL, size: hp(9) }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: ARIAL, size: hp(9) }),
          ],
        })],
      }),
    },
    children: [

      // ══════════════════════════════════════════════════════════════════
      // PORTADA
      // ══════════════════════════════════════════════════════════════════
      space(), space(),
      centered('POLITÉCNICO GRANCOLOMBIANO', { bold: true, size: hp(14) }),
      centered('Facultad de Ingeniería, Diseño e Innovación', { size: hp(12) }),
      centered('Énfasis Profesional I — Integración Continua — Grupo B04', { size: hp(12) }),
      space(), space(),
      centered('PROYECTO FINAL', { bold: true, size: hp(16), color: DARK_BLUE }),
      centered('Implementación de un Sistema de Integración Continua', { bold: true, size: hp(14) }),
      centered('con Docker, Jenkins, Travis CI y Codeship', { bold: true, size: hp(14) }),
      space(), space(),
      centered('Autores:', { bold: true }),
      centered('Cabana Gutiérrez Fabián Andrés'),
      centered('Castro Torres Diana'),
      centered('Hernández Rey Omar Alberto (100349113)'),
      centered('Méndez Coronell Jesús'),
      space(),
      centered('Profesor: Edward Reyes Corredor', { bold: true }),
      centered('23 de junio de 2026'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 1. INTRODUCCIÓN
      // ══════════════════════════════════════════════════════════════════
      h1('1. Introducción'),
      p('La Integración Continua (IC) es una práctica de desarrollo de software en la que los miembros '
        + 'de un equipo integran su trabajo frecuentemente —al menos una vez al día— y cada integración '
        + 'es verificada por una construcción automatizada (incluyendo pruebas) para detectar errores de '
        + 'integración lo antes posible (Fowler, 2006). Esta metodología, complementada por el conjunto '
        + 'de lecturas del módulo de Oliveros Acosta (2017a-h), constituye el núcleo conceptual del presente '
        + 'proyecto académico.'),
      p('El presente documento unifica las tres entregas del curso, presentando de forma progresiva '
        + 'cómo se diseñó, implementó y validó un sistema CI/CD completo para una aplicación web full-stack '
        + '(Gestor de Tareas) utilizando: Git/GitHub para control de versiones, Docker para '
        + 'containerización, Jenkins como servidor CI local, Travis CI como servicio CI en la nube '
        + 'nativo de GitHub, y Codeship Pro para pipelines basados en Docker.'),
      p('La aplicación sobre la que se aplica el pipeline es un gestor de tareas con arquitectura '
        + 'React + Vite (frontend), Node.js + Express + TypeScript (backend) y PostgreSQL (base de datos), '
        + 'todos comunicados a través de una red Docker dedicada (ci-network).'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 2. MARCO CONCEPTUAL
      // ══════════════════════════════════════════════════════════════════
      h1('2. Marco Conceptual'),

      h2('2.1 Integración Continua'),
      p('Fowler (2006) define la Integración Continua como una práctica de desarrollo de software '
        + 'donde el equipo integra su trabajo con frecuencia. Cada integración se verifica con una '
        + 'build automatizada (que incluye pruebas) para detectar errores de integración lo antes '
        + 'posible. Los beneficios clave incluyen:'),
      bullet('Reducción del riesgo de integración al hacer merge frecuentes'),
      bullet('Detección temprana de bugs mediante ejecución automática de pruebas'),
      bullet('Software siempre en estado desplegable'),
      bullet('Reducción de procesos manuales y errores humanos'),
      bullet('Mayor confianza del equipo para realizar cambios'),
      p('Un sistema de IC automático requiere: repositorio de código fuente único, build automatizado, '
        + 'pruebas automatizadas, commit al mainline cada día, build en cada commit, build rápido '
        + '(< 10 minutos), pruebas en clon del entorno de producción, fácil acceso al último ejecutable '
        + 'y visibilidad del estado del build para todo el equipo (Oliveros Acosta, 2017a).'),

      h2('2.2 Control de versiones con Git'),
      p('Git es un sistema de control de versiones distribuido. El modelo Git Flow implementado en '
        + 'este proyecto utiliza cinco tipos de ramas con roles bien definidos:'),
      table(
        ['Rama', 'Propósito', 'Vida útil'],
        [
          ['main (trunk)', 'Código en producción, siempre estable', 'Permanente'],
          ['develop', 'Rama de integración de features', 'Permanente'],
          ['feature/*', 'Nuevas funcionalidades', 'Temporal'],
          ['release/*', 'Preparación de una versión', 'Temporal'],
          ['hotfix/*', 'Correcciones urgentes en producción', 'Temporal'],
        ]
      ),
      space(),
      p('El versionamiento semántico (SemVer) complementa Git Flow asignando versiones del tipo '
        + 'MAJOR.MINOR.PATCH a los tags de releases.'),

      h2('2.3 Contenedores Docker'),
      p('Los contenedores Docker empaquetan una aplicación con todas sus dependencias en una unidad '
        + 'estandarizada. A diferencia de las máquinas virtuales que virtualizan el hardware completo, '
        + 'los contenedores comparten el kernel del sistema operativo anfitrión, lo que los hace '
        + 'significativamente más ligeros y rápidos.'),
      p('Docker Compose permite definir y ejecutar aplicaciones multi-contenedor mediante un archivo '
        + 'YAML declarativo. Las redes Docker (bridge) permiten la comunicación entre contenedores '
        + 'por nombre DNS sin exponer puertos al exterior.'),

      h2('2.4 DevOps'),
      p('DevOps es una cultura y conjunto de prácticas que une el desarrollo de software (Dev) '
        + 'con las operaciones de TI (Ops), pasando también por el aseguramiento de la calidad (QA). '
        + 'La Integración Continua es el primer paso del pipeline DevOps, seguido de la Entrega '
        + 'Continua (CD) y el Despliegue Continuo.'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 3. DESCRIPCIÓN DEL PROYECTO
      // ══════════════════════════════════════════════════════════════════
      h1('3. Descripción del Proyecto'),
      p('Nombre: Project CI — Gestor de Tareas Full Stack. Aplicación web de gestión de tareas '
        + 'con arquitectura containerizada e integración continua. Permite crear, completar y '
        + 'eliminar tareas, con persistencia en base de datos PostgreSQL.'),

      h2('3.1 Tecnologías por capa'),
      table(
        ['Capa', 'Tecnología', 'Versión', 'Contenedor'],
        [
          ['Frontend', 'React + Vite + TypeScript + Nginx', '18 / 5 / 5.3 / Alpine', 'project-ci-frontend'],
          ['Backend', 'Node.js + Express + TypeScript', '20 LTS / 4.18 / 5.3', 'project-ci-backend'],
          ['Base de datos', 'PostgreSQL', '16 Alpine', 'project-ci-db'],
          ['CI local', 'Jenkins LTS + Docker CLI', 'LTS 2.x', 'project-ci-jenkins'],
          ['CI nube 1', 'Travis CI', 'jammy/docker', '(servicio externo)'],
          ['CI nube 2', 'Codeship Pro', 'Docker-based', '(servicio externo)'],
          ['Orquestación', 'Docker Compose', 'v2 (plugin)', 'host'],
        ]
      ),

      h2('3.2 Funcionalidades'),
      bullet('Listar tareas con estado (pendiente / completada)'),
      bullet('Crear nueva tarea con validación de título'),
      bullet('Marcar tarea como completada (toggle)'),
      bullet('Eliminar tarea'),
      bullet('Estadísticas en tiempo real: total, pendientes, completadas'),
      bullet('API REST con endpoints: GET /, GET /health, GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 4. REPOSITORIO Y GESTIÓN DE CÓDIGO
      // ══════════════════════════════════════════════════════════════════
      h1('4. Repositorio GitHub y Gestión de Código'),

      h2('4.1 Repositorio'),
      p('URL: https://github.com/omarhernandezrey/project-CI-gestor-de.tareas-full-stack'),
      p('Tipo: público. Owner: omarhernandezrey. Creado para el módulo de Integración Continua '
        + 'del Politécnico Grancolombiano.'),

      h2('4.2 Modelo de ramas Git Flow implementado'),
      table(
        ['Rama', 'Descripción', 'Estado'],
        [
          ['main', 'Trunk — código en producción', 'Permanente'],
          ['develop', 'Integración de todas las features', 'Permanente'],
          ['feature/automated-tests', 'Tests Jest y Vitest', 'Mergeada'],
          ['feature/travis-ci', 'Pipeline Travis CI', 'Mergeada'],
          ['feature/codeship', 'Pipeline Codeship Pro', 'Mergeada'],
          ['feature/jenkins-enhanced', 'Jenkinsfile con Quality Gates', 'Mergeada'],
          ['release/v3.0.0', 'Release de Entrega 3', 'Mergeada a main'],
        ]
      ),

      h2('4.3 Versionamiento semántico — Tags'),
      table(
        ['Tag', 'Commit', 'Descripción'],
        [
          ['v1.0.0', '4e7d1d9', 'Entrega 1 — Containerización Docker (3 contenedores)'],
          ['v2.0.0', '47c46c8', 'Entrega 2 — Jenkins como gestor de IC'],
          ['v3.0.0', 'HEAD', 'Entrega 3 — Travis CI + Codeship + Git Flow completo'],
        ]
      ),

      h2('4.4 Pull Requests realizados'),
      table(
        ['PR', 'Rama origen', 'Rama destino', 'Descripción'],
        [
          ['#1', 'feature/travis-ci', 'develop', 'feat(ci): integrate Travis CI pipeline'],
          ['#2', 'feature/codeship', 'develop', 'feat(ci): integrate Codeship Pro pipeline'],
          ['#3', 'feature/jenkins-enhanced', 'develop', 'feat(jenkins): enhanced pipeline with quality gates'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 5. ARQUITECTURA DOCKER (ENTREGA 1)
      // ══════════════════════════════════════════════════════════════════
      h1('5. Arquitectura con Contenedores Docker (Entrega 1)'),

      h2('5.1 Descripción de la arquitectura'),
      p('La aplicación se compone de tres contenedores Docker interconectados mediante una red '
        + 'bridge personalizada llamada ci-network. Esta red permite la resolución de nombres DNS '
        + 'entre contenedores sin exponer puertos innecesarios al host.'),

      h2('5.2 Contenedores'),
      table(
        ['Contenedor', 'Imagen base', 'Puerto interno', 'Puerto host', 'Función'],
        [
          ['project-ci-frontend', 'nginx:alpine (multi-stage)', '80', '80', 'Sirve React SPA y proxea /api/ → backend'],
          ['project-ci-backend', 'node:20-alpine (multi-stage)', '3000', '3002*', 'API REST Express + TypeScript'],
          ['project-ci-db', 'postgres:16-alpine', '5432', '5432', 'Persistencia de tareas'],
          ['project-ci-jenkins', 'jenkins/jenkins:lts + docker-cli', '8080', '8082*', 'CI local (Parte 7)'],
        ]
      ),
      space(),
      p('(*) Puertos host modificados en el entorno local para evitar conflicto con otros proyectos '
        + '(flexicommerce usa 3000 y 8080). La comunicación interna sigue usando los puertos originales.'),

      h2('5.3 Red ci-network'),
      p('La red Docker bridge ci-network permite:'),
      bullet('Resolución DNS por nombre de contenedor (backend, db, frontend)'),
      bullet('Aislamiento del tráfico respecto a otros contenedores del host'),
      bullet('El frontend (nginx) proxy_pass a http://backend:3000/ usando el resolver interno 127.0.0.11'),

      h2('5.4 Dockerfile del backend (multi-stage)'),
      p('Stage 1 (builder): node:20-alpine, instala dependencias (npm ci) y compila TypeScript (tsc). '
        + 'Stage 2 (runner): node:20-alpine, copia solo el dist/ y node_modules de producción, '
        + 'lo que reduce el tamaño de la imagen final.'),

      h2('5.5 docker-compose.yml — características clave'),
      bullet('depends_on con condition: service_healthy para la BD (healthcheck con pg_isready)'),
      bullet('Variables de entorno con valores por defecto (${DB_HOST:-db})'),
      bullet('Volúmenes named: postgres_data (persistencia) y jenkins-data'),
      bullet('restart: unless-stopped en todos los servicios'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 6. JENKINS (ENTREGA 2)
      // ══════════════════════════════════════════════════════════════════
      h1('6. Jenkins como Gestor de Integración Continua (Entrega 2)'),

      h2('6.1 ¿Qué es Jenkins?'),
      p('Jenkins es un servidor de automatización de código abierto escrito en Java. Originalmente '
        + 'llamado Hudson, fue bifurcado en 2011 y renombrado Jenkins. Es el servidor CI más usado '
        + 'del mundo con más de 1.800 plugins disponibles (Jenkins Project, 2024). Su licencia MIT '
        + 'lo hace accesible para proyectos académicos y empresariales.'),

      h2('6.2 Arquitectura interna de Jenkins'),
      p('Jenkins sigue un modelo Controller/Agent (anteriormente Master/Slave):'),
      bullet('Controller: ejecuta la Web UI, agenda jobs, gestiona credenciales y plugins'),
      bullet('Agents: nodos remotos que ejecutan los builds; se conectan vía SSH o JNLP'),
      bullet('Executors: hilos dentro de un agent que procesan stages en paralelo'),
      bullet('En este proyecto usamos agent any (el Controller actúa también como agent)'),

      h2('6.3 Requisitos técnicos'),
      table(
        ['Requisito', 'Mínimo', 'Recomendado para producción'],
        [
          ['RAM', '256 MB', '4 GB+'],
          ['Disco', '1 GB', '50 GB+'],
          ['Java', 'JDK 17 LTS', 'JDK 21 LTS'],
          ['Puerto UI', '8080 (HTTP)', '443 (HTTPS)'],
          ['Puerto Agents', '50000 (JNLP)', '50000'],
          ['Sistema operativo', 'Linux, Windows, macOS', 'Linux (preferido)'],
          ['Permisos especiales', '—', 'Acceso a Docker socket'],
        ]
      ),

      h2('6.4 Plugins utilizados'),
      table(
        ['Plugin', 'Función en el proyecto'],
        [
          ['Pipeline (workflow-aggregator)', 'Habilita el pipeline declarativo (Jenkinsfile)'],
          ['Git plugin', 'Checkout del repositorio GitHub'],
          ['Docker Pipeline', 'Uso de docker.image() en el pipeline'],
          ['Credentials Binding', 'Inyección segura de secrets en el pipeline'],
          ['AnsiColor', 'Colores en la consola (opción ansiColor)'],
          ['Timestamper', 'Marca de tiempo en cada línea de log (opción timestamps)'],
          ['Build Discarder', 'Limita builds guardados (numToKeepStr: 10)'],
        ]
      ),

      h2('6.5 Jenkinsfile v3 — análisis por etapa'),
      p('El Jenkinsfile mejorado (Entrega 3) tiene 5 stages principales:'),
      bullet('Checkout: descarga el código y muestra el último commit'),
      bullet('Quality Gates (paralelo): corre npm test en backend y frontend simultáneamente usando docker run'),
      bullet('Build Docker Images: construye las tres imágenes con docker compose build'),
      bullet('Deploy Stack: detiene contenedores previos, levanta el stack y espera al backend'),
      bullet('Integration Tests (paralelo): health check, GET /tasks y frontend en paralelo'),
      p('La sección options incluye: timestamps(), buildDiscarder(logRotator(numToKeepStr:\'10\')), '
        + 'timeout(30 min) y ansiColor(\'xterm\') para salida con colores.'),

      h2('6.6 Docker-out-of-Docker (DooD) pattern'),
      p('Jenkins necesita ejecutar comandos Docker durante el pipeline. Se implementa el patrón '
        + 'Docker-out-of-Docker montando el socket del daemon del host:'),
      bullet('Imagen custom: jenkins/jenkins:lts + instalación de docker-ce-cli y docker-compose-plugin'),
      bullet('Volumen: /var/run/docker.sock:/var/run/docker.sock'),
      bullet('Grupo: el usuario jenkins se añade al grupo docker'),
      bullet('Ventaja: los contenedores creados por Jenkins son hermanos, no hijos'),

      h2('6.7 Seguridad en Jenkins'),
      bullet('Autenticación: usuario admin creado en el wizard inicial'),
      bullet('Matrix-based authorization: control granular de permisos por usuario'),
      bullet('Credentials store: tokens y contraseñas almacenados cifrados en jenkins-data'),
      bullet('No se expone Jenkins directamente a Internet en este entorno académico'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 7. TRAVIS CI (ENTREGA 3)
      // ══════════════════════════════════════════════════════════════════
      h1('7. Travis CI (Entrega 3 — Escenario 7)'),

      h2('7.1 ¿Qué es Travis CI?'),
      p('Travis CI es un servicio de integración continua distribuido y alojado (SaaS) que se '
        + 'integra de forma nativa con GitHub. Fue fundado en 2011 y se convirtió en uno de los '
        + 'primeros servicios CI en la nube ampliamente adoptados por proyectos open source. '
        + 'Travis CI GmbH fue adquirida por Idera Inc. en 2019 (Travis CI, 2024).'),
      p('La diferencia entre travis-ci.org (gratuito, descontinuado) y travis-ci.com '
        + '(actual, con plan gratuito limitado) es importante: todos los nuevos proyectos '
        + 'deben usar travis-ci.com.'),

      h2('7.2 Características clave'),
      bullet('Configuración mínima: un archivo .travis.yml en la raíz del repositorio activa el CI'),
      bullet('Soporte multi-plataforma: Linux (dist: jammy, focal), macOS, Windows'),
      bullet('Build de Pull Requests: Travis crea un build separado para el merge simulado de cada PR'),
      bullet('Build de ramas: cada push a una rama configurada dispara un build'),
      bullet('Deploy integrado: soporte nativo para Heroku, AWS, GCP, Firebase y más'),
      bullet('Cache inteligente: caché de directorios configurable (node_modules, .npm, .docker)'),

      h2('7.3 Ciclo de vida del build (11 pasos)'),
      table(
        ['Paso', 'Hook', 'Descripción'],
        [
          ['1', 'apt addons', 'Instalación de paquetes del sistema (opcional)'],
          ['2', 'cache restore', 'Restauración del caché configurado'],
          ['3', 'before_install', 'Verificaciones previas (versiones de herramientas)'],
          ['4', 'install', 'Instalación de dependencias (npm ci)'],
          ['5', 'before_script', 'Preparación del entorno (build de imágenes Docker)'],
          ['6', 'script', 'Ejecución de las pruebas y validaciones principales'],
          ['7', 'before_cache', 'Preparación del caché para guardar'],
          ['8', 'after_success/failure', 'Acciones según el resultado del script'],
          ['9', 'before_deploy', 'Preparación del despliegue (opcional)'],
          ['10', 'deploy', 'Despliegue a la plataforma configurada (opcional)'],
          ['11', 'after_deploy', 'Acciones post-despliegue (opcional)'],
        ]
      ),

      h2('7.4 Branch Build Flow vs Pull Request Build Flow'),
      p('Travis CI crea dos tipos de build al recibir un evento de GitHub:'),
      bullet('Branch Build (type=push): se ejecuta directamente sobre la rama pusheada. '
        + 'Usa el código tal como está en esa rama.'),
      bullet('Pull Request Build (type=pull_request): Travis crea un merge temporal del PR '
        + 'con la rama base y ejecuta el build sobre ese merge. Detecta conflictos antes de hacer el merge real.'),

      h2('7.5 Análisis de .travis.yml implementado'),
      bullet('os: linux, dist: jammy — Ubuntu 22.04 LTS con soporte completo para Docker Compose v2'),
      bullet('services: docker — activa el daemon Docker en el agente de Travis'),
      bullet('branches.only — filtra qué ramas disparan el build (main, develop, feature/*, release/*, hotfix/*)'),
      bullet('cache.directories — cachea $HOME/.npm y $HOME/.docker para reducir tiempo de build'),
      bullet('install — ejecuta npm ci en backend y frontend (instalación determinística con lockfile)'),
      bullet('before_script — construye las imágenes Docker antes de los tests de integración'),
      bullet('script — 8 fases: unit tests → integración → smoke test POST → persistencia → frontend'),
      bullet('jobs.include — define stages separados para Branch Build y PR Build'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 8. CODESHIP (ENTREGA 3)
      // ══════════════════════════════════════════════════════════════════
      h1('8. Codeship (Entrega 3 — Escenario 8)'),

      h2('8.1 ¿Qué es Codeship?'),
      p('Codeship es una plataforma de CI/CD en la nube fundada en 2011. En 2018 fue adquirida '
        + 'por CloudBees, el mayor proveedor de soluciones Jenkins empresariales. Codeship ofrece '
        + 'dos modalidades: Basic y Pro (CloudBees, 2024).'),

      h2('8.2 Codeship Basic vs Codeship Pro'),
      table(
        ['Aspecto', 'Codeship Basic', 'Codeship Pro'],
        [
          ['Configuración', 'UI web (sin archivos YAML)', 'YAML versionado en el repositorio'],
          ['Entorno de ejecución', 'Máquinas preconfiguradas (Turnkey)', 'Contenedores Docker definidos por el usuario'],
          ['Soporte Docker', 'Limitado', 'Nativo y completo'],
          ['Paralelismo', 'Pipelines paralelos via UI', 'type: parallel en steps YAML'],
          ['Personalización', 'Baja (entornos fijos)', 'Alta (cualquier imagen Docker)'],
          ['Archivos de config', 'Ninguno (todo en UI)', 'codeship-services.yml + codeship-steps.yml'],
          ['Casos de uso', 'Proyectos simples, configuración rápida', 'Proyectos complejos con Docker'],
        ]
      ),

      h2('8.3 Deployment Pipelines en Codeship'),
      p('Un Deployment Pipeline en Codeship representa el flujo completo desde el commit hasta '
        + 'el deploy. Los estados posibles son:'),
      bullet('Completado (verde): todos los pasos pasaron exitosamente'),
      bullet('Con Fallas (rojo): al menos un paso falló; el pipeline se detiene'),
      bullet('En Proceso (amarillo): el pipeline está ejecutándose actualmente'),

      h2('8.4 Implementación — codeship-services.yml'),
      p('Define cuatro servicios Docker para el pipeline:'),
      bullet('backend_test: build del Dockerfile del backend, volumen ./backend:/app, env de test'),
      bullet('frontend_test: build del Dockerfile del frontend, volumen ./frontend:/app'),
      bullet('db: postgres:16-alpine para tests, con cached: true (reutiliza la imagen entre builds)'),
      bullet('integration: imagen Alpine custom (Dockerfile.integration) con curl/bash/jq'),

      h2('8.5 Implementación — codeship-steps.yml'),
      p('Cuatro etapas en el pipeline:'),
      bullet('Etapa 1 (type: parallel): tests de backend y frontend ejecutándose simultáneamente'),
      bullet('Etapa 2 (type: parallel): build del backend y frontend en paralelo'),
      bullet('Etapa 3: tests E2E de integración (curl al /health y /tasks del backend)'),
      bullet('Etapa 4 (tag: main): solo se ejecuta en la rama main; imprime mensaje de deploy-ready'),

      h2('8.6 Codeship vs Travis CI vs Jenkins — comparativa'),
      table(
        ['Criterio', 'Jenkins', 'Travis CI', 'Codeship Pro'],
        [
          ['Hosting', 'Self-hosted (local/cloud)', 'SaaS (travis-ci.com)', 'SaaS (codeship.com)'],
          ['Costo', 'Gratis (open source)', 'Free tier + planes de pago', 'Free tier + planes de pago'],
          ['Config', 'Groovy (Jenkinsfile)', 'YAML (.travis.yml)', 'YAML (2 archivos)'],
          ['Docker nativo', 'Sí (DooD pattern)', 'Sí (service: docker)', 'Sí (Pro, nativo)'],
          ['Paralelismo', 'parallel {} en Groovy', 'jobs.include stages', 'type: parallel en steps'],
          ['Plugins/Integ.', '1800+ plugins', 'Integraciones vía deploy', 'CloudBees ecosystem'],
          ['Caso de uso ideal', 'Empresa con control total', 'OS en GitHub', 'Equipos Docker-first'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 9. INTEGRACIÓN TOTAL CI/CD
      // ══════════════════════════════════════════════════════════════════
      h1('9. Integración Total CI/CD del Proyecto'),

      h2('9.1 Flujo completo del pipeline'),
      p('Cuando un desarrollador hace git push a GitHub, se disparan en paralelo tres pipelines:'),
      bullet('Jenkins (self-hosted): recibe webhook → Quality Gates → Build → Deploy → Integration Tests'),
      bullet('Travis CI (SaaS): detecta push vía GitHub App → install → build Docker → unit+integration tests'),
      bullet('Codeship Pro (SaaS): detecta push vía webhook → servicios Docker → tests paralelos → E2E'),

      h2('9.2 Estrategia de ramas y disparadores'),
      table(
        ['Rama', 'Jenkins', 'Travis CI', 'Codeship Pro'],
        [
          ['main', 'Sí (webhook)', 'Sí (branch build)', 'Sí (incluyendo tag step)'],
          ['develop', 'Sí', 'Sí', 'Sí'],
          ['feature/*', 'Sí', 'Sí', 'Sí'],
          ['PR a develop', 'Sí (opcional)', 'Sí (PR build flow)', 'Sí'],
          ['release/*', 'Sí', 'Sí', 'Sí'],
          ['hotfix/*', 'Sí', 'Sí', 'Sí'],
        ]
      ),

      h2('9.3 Versionamiento semántico aplicado'),
      table(
        ['Tag', 'Rama', 'Descripción', 'Fecha aprox.'],
        [
          ['v1.0.0', 'main', 'Entrega 1 — Docker (3 contenedores)', 'Mayo 2026'],
          ['v2.0.0', 'main', 'Entrega 2 — Jenkins CI', 'Junio 2026'],
          ['v3.0.0', 'main', 'Entrega 3 — Travis + Codeship + Git Flow', '23 Jun 2026'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 10. RESULTADOS Y EVIDENCIAS
      // ══════════════════════════════════════════════════════════════════
      h1('10. Resultados y Evidencias'),

      h2('10.1 Tests automatizados — resultados locales'),
      table(
        ['Suite', 'Framework', 'Tests', 'Resultado'],
        [
          ['Backend API', 'Jest + Supertest', '4 tests', '4 PASS'],
          ['Frontend App', 'Vitest + React Testing Library', '3 tests', '3 PASS'],
          ['Total', '—', '7 tests', '7 PASS — 0 FAIL'],
        ]
      ),

      h2('10.2 Tests de integración — endpoints verificados'),
      table(
        ['Endpoint', 'Método', 'Resultado esperado', 'Verificado en'],
        [
          ['/', 'GET', '200 + {status: OK, version}', 'Jest + Travis + Codeship'],
          ['/health', 'GET', '200 + {status: OK, container, timestamp}', 'Todos los pipelines'],
          ['/tasks', 'GET', '200 + {success: true, data: [...]}', 'Todos los pipelines'],
          ['/tasks', 'POST {}', '400 + {success: false}', 'Jest'],
          ['/tasks', 'POST {title: " "}', '400', 'Jest'],
          ['/', 'GET (frontend)', 'HTTP/1.1 200 OK (nginx)', 'Travis + Jenkins'],
        ]
      ),

      h2('10.3 Pull Requests realizados'),
      table(
        ['PR', 'Título', 'Estado'],
        [
          ['#1', 'feat(ci): integrate Travis CI pipeline', 'Abierto → develop'],
          ['#2', 'feat(ci): integrate Codeship Pro pipeline', 'Abierto → develop'],
          ['#3', 'feat(jenkins): enhanced pipeline with quality gates', 'Abierto → develop'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 11. HISTORIAL DE CAMBIOS Y RESOLUCIÓN DE PROBLEMAS
      // ══════════════════════════════════════════════════════════════════
      h1('11. Historial de Cambios y Resolución de Problemas'),
      table(
        ['Problema', 'Causa', 'Solución', 'Herramienta'],
        [
          ['Conflicto de contenedores al re-deployar', 'Contenedores del build anterior activos', 'docker stop/rm antes de docker compose up', 'Jenkins / Travis'],
          ['Backend no alcanzaba la BD al iniciar', 'PostgreSQL tardaba en estar listo', 'healthcheck con pg_isready + depends_on condition: service_healthy', 'Docker Compose'],
          ['Jenkins no veía Docker', 'Usuario jenkins sin permisos de socket', 'Imagen custom con docker-ce-cli + montaje /var/run/docker.sock', 'Jenkins'],
          ['docker-compose: command not found', 'Jenkins usaba docker-compose v1 (desinstalado)', 'Migración a docker compose (plugin v2)', 'Jenkins'],
          ['npm ci fallaba sin package-lock.json', 'Frontend no tenía lockfile en el repo', 'git add frontend/package-lock.json', 'Travis / Codeship'],
          ['nginx no resolvía backend al arrancar', 'DNS de Docker no disponible en startup', 'resolver 127.0.0.11 + variable $backend_upstream', 'Docker / nginx'],
          ['Puerto 3000 ocupado por otro proyecto', 'flexicommerce-web usa 3000 en el mismo host', 'docker-compose.yml: puerto host cambiado a 3002', 'Docker local'],
          ['tsconfig no incluía tipos de Jest', 'types: ["node"] excluía @types/jest', 'Añadir "jest" al array types en tsconfig.json', 'Jest / TypeScript'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 12. RESPONSABILIDADES DEL EQUIPO
      // ══════════════════════════════════════════════════════════════════
      h1('12. Responsabilidades del Equipo'),
      table(
        ['Integrante', 'Responsabilidad principal'],
        [
          ['Omar Alberto Hernández Rey', 'Owner del repositorio, arquitectura Docker, pipeline Jenkins, refactorización app.ts, redacción técnica'],
          ['Diana Castro Torres', 'Configuración Travis CI, tests del frontend (Vitest + RTL), validación de PRs'],
          ['Jesús Méndez Coronell', 'Configuración Codeship Pro (services + steps YAML), documentación y diagramas'],
          ['Fabián Andrés Cabana Gutiérrez', 'Tests del backend (Jest + Supertest), branching strategy, sustentación'],
        ]
      ),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 13. OPINIONES DEL EQUIPO
      // ══════════════════════════════════════════════════════════════════
      h1('13. Opiniones del Equipo / Lecciones Aprendidas'),

      h3('Omar Alberto Hernández Rey'),
      p('El módulo de Integración Continua me permitió entender que la automatización no es un '
        + 'lujo, sino una necesidad en proyectos de software colaborativos. La mayor lección fue '
        + 'comprender las diferencias entre herramientas: Jenkins ofrece control total pero requiere '
        + 'mantenimiento; Travis CI es inmediato pero tiene restricciones de crédito; Codeship Pro '
        + 'brilla en entornos Docker-first. La combinación de los tres demuestra que no existe una '
        + 'herramienta universal, sino la herramienta correcta para cada contexto.'),

      h3('Diana Castro Torres'),
      p('Trabajar con Travis CI me enseñó la importancia de los archivos de configuración '
        + 'versionados. La capacidad de ver en un solo archivo YAML todo el pipeline de CI es '
        + 'poderosa: cualquier desarrollador puede entender el proceso de construcción sin documentación '
        + 'adicional. Los tests del frontend con React Testing Library me demostraron que las pruebas '
        + 'deben probar comportamiento, no implementación.'),

      h3('Jesús Méndez Coronell'),
      p('Codeship Pro fue la revelación del proyecto. La capacidad de definir entornos completamente '
        + 'personalizados con Docker y ejecutar etapas en paralelo reduce significativamente los '
        + 'tiempos de feedback. La documentación paralela (codeship-basic.md) me ayudó a entender '
        + 'que las herramientas evolucionan y es importante conocer las diferencias entre versiones.'),

      h3('Fabián Andrés Cabana Gutiérrez'),
      p('El mayor aprendizaje fue el Git Flow. Tener ramas bien definidas con propósitos claros '
        + 'hace que el trabajo en equipo sea mucho más organizado y predecible. Los tags semánticos '
        + '(v1.0.0, v2.0.0, v3.0.0) nos dan un historial claro de cada entrega y facilitan '
        + 'el rollback si fuera necesario.'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 14. CONCLUSIONES
      // ══════════════════════════════════════════════════════════════════
      h1('14. Conclusiones'),
      p('La implementación de un sistema de Integración Continua completo con tres herramientas '
        + '(Jenkins, Travis CI y Codeship Pro) demostró que la IC no es un concepto único sino '
        + 'un ecosistema de herramientas complementarias que se adaptan a diferentes contextos y necesidades.'),
      p('El modelo Git Flow, con sus cinco tipos de ramas y el versionamiento semántico, proporcionó '
        + 'la estructura de colaboración necesaria para que cuatro desarrolladores trabajaran en '
        + 'paralelo sin conflictos destructivos. Los Pull Requests como puntos de control garantizaron '
        + 'que ningún cambio llegara a main sin revisión y validación automática.'),
      p('Los tests automatizados (7 en total: 4 backend + 3 frontend) son el corazón del pipeline '
        + 'de CI. Sin pruebas, la automatización solo acelera la entrega de código roto. La '
        + 'refactorización de index.ts a app.ts para separar la creación de la app de su arranque '
        + 'fue una decisión técnica que habilita el testing sin una base de datos real.'),
      p('Docker fue el denominador común de todas las herramientas: Jenkins usa DooD pattern, '
        + 'Travis CI activa el daemon Docker como servicio, y Codeship Pro construye servicios '
        + 'Docker nativamente. Esto confirma que los contenedores son el estándar de facto para '
        + 'entornos CI/CD reproducibles y consistentes.'),
      pageBreak(),

      // ══════════════════════════════════════════════════════════════════
      // 15. REFERENCIAS
      // ══════════════════════════════════════════════════════════════════
      h1('15. Referencias'),
      p('CloudBees. (2024). Codeship documentation. https://documentation.codeship.com'),
      p('Docker Inc. (2023). Docker documentation. https://docs.docker.com'),
      p('Docker Inc. (2023). Docker Compose overview. https://docs.docker.com/compose/'),
      p('Fowler, M. (2006). Continuous integration. https://martinfowler.com/articles/continuousIntegration.html'),
      p('Jenkins Project. (2024). Jenkins User Documentation. https://www.jenkins.io/doc/'),
      p('Oliveros Acosta, E. E. (2017a). Lectura fundamental 1: ¿Qué es la integración continua? '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017b). Lectura fundamental 2: Control de versiones con Git. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017c). Lectura fundamental 3: Contenedores y Docker. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017d). Lectura fundamental 4: Jenkins como servidor de IC. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017e). Lectura fundamental 5: Travis CI. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017f). Lectura fundamental 6: Codeship. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017g). Lectura fundamental 7: Gestión de ramas Git Flow. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Oliveros Acosta, E. E. (2017h). Lectura fundamental 8: DevOps y CI/CD. '
        + 'Módulo Énfasis Profesional I — Integración Continua. Politécnico Grancolombiano.'),
      p('Travis CI GmbH. (2024). Travis CI documentation. https://docs.travis-ci.com'),
    ],
  }],
});

// ─── generar .docx ───────────────────────────────────────────────────────────
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('Entrega_Final_Project_CI.docx', buffer);
  console.log('✅ Documento generado: Entrega_Final_Project_CI.docx');
  const stat = fs.statSync('Entrega_Final_Project_CI.docx');
  console.log(`   Tamaño: ${(stat.size / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('❌ Error generando el documento:', err);
  process.exit(1);
});
