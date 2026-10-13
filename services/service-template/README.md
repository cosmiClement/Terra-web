# Plantilla de microservicio

Usa este directorio como base para crear un servicio concreto. Renómbralo y completa:

- `src/api`: interfaz HTTP o de mensajería.
- `src/application`: casos de uso.
- `src/domain`: reglas y entidades del dominio.
- `src/infrastructure`: base de datos y adaptadores externos.
- `tests`: pruebas del servicio.
- `Dockerfile` y `README.md`: ejecución y despliegue independientes.

Cada servicio debe ser dueño de sus datos. Comparte contratos mediante `packages/contracts`, no modelos internos ni tablas.
