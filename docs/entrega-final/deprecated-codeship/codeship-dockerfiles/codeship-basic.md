# Codeship Basic — Configuración equivalente vía UI

Si en lugar de Codeship Pro se utilizara **Codeship Basic**, la configuración
se haría desde la interfaz web del proyecto en https://app.codeship.com en lugar de
archivos YAML. La equivalencia sería:

## Comandos de preparación (Setup Commands)

```bash
nvm install 20
nvm use 20
cd backend && npm ci
cd ../frontend && npm ci
```

## Comandos de prueba (Test Commands)

Pipeline 1 — Backend:
```bash
cd backend && npm test
```

Pipeline 2 — Frontend:
```bash
cd frontend && npm test
```

Pipeline 3 — Build:
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Comandos de despliegue (Deploy)

Trigger: rama `main`
Provider: Heroku / Amazon S3 / Google AppEngine (configurar llaves API)

## Limitaciones de Codeship Basic vs Pro

| Aspecto | Basic | Pro |
|---|---|---|
| Configuración | UI web | YAML versionado |
| Contenedores | Preconfigurados (Turnkey) | Docker nativo definido por el usuario |
| Flujo de trabajo | Lineal con pipelines paralelos | Definible y editable |
| Soporte Docker | No nativo | Sí nativo |
| Costo | Por miembro de equipo | Por número de builds |
