# Arquitectura

La aplicación web usa un monolito modular: Next.js entrega las rutas y cada dominio mantiene su lógica y adaptadores. Los módulos se comunican mediante APIs públicas pequeñas; los servicios independientes se comunican mediante contratos versionados en `packages/contracts/`.

Los scaffolds de `services/` e `infrastructure/` son documentación, no sistemas desplegables. Registra decisiones de arquitectura en `decisions/` con contexto, decisión y consecuencias.
