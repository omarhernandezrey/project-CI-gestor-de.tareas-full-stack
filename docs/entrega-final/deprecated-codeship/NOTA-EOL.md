# Nota: Codeship fue descontinuado (EOL)

CloudBees anunció el fin de vida útil de CodeShip a partir de enero de 2026.
Fuente oficial: https://docs.cloudbees.com/docs/cloudbees-common/latest/cloudbees-codeship-eol

> "A partir de enero de 2026, CloudBees dejará de ofrecer soporte para el
> producto CloudBees CodeShip [...] CloudBees recomienda migrar a CloudBees
> Unify, una plataforma de CI/CD moderna."

Los archivos en este directorio (`codeship-services.yml`, `codeship-steps.yml`
y los Dockerfiles auxiliares) se conservan como evidencia de la configuración
original diseñada para Codeship Pro durante el desarrollo del Escenario 8,
pero **no son ejecutables** porque la plataforma ya no acepta nuevos proyectos.

## Herramienta de sustitución

Se sustituyó por **GitHub Actions**, configurado en `.github/workflows/ci.yml`,
manteniendo la misma estructura conceptual:

| Codeship Pro (original)               | GitHub Actions (sustituto)                                           |
|---------------------------------------|----------------------------------------------------------------------|
| `codeship-services.yml`               | `jobs:` con contenedores definidos                                   |
| `codeship-steps.yml` (pasos paralelos)| `jobs.backend_test` + `jobs.frontend_test` (paralelos por defecto)   |
| Servicio `integration`                | `job: integration_test`                                              |
| Tag en rama `main`                    | `job: release_notice` con `if: github.ref == 'refs/heads/main'`     |
| Trigger por push                      | `on: push`                                                           |
| Trigger por Pull Request              | `on: pull_request`                                                   |
| (no contemplado en el diseño original)| `job: browser_test` con Playwright — cubre el apartado de *browser testing* del Escenario 8 |

_Fecha de consulta a la documentación oficial de CloudBees EOL: 2026-06-23_
