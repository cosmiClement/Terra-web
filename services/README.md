# Servicios

Cada microservicio debe ser desplegable de forma independiente y ser propietario de su lógica y sus datos. Mantén aquí un directorio por servicio; usa `service-template` como punto de partida.

## Estructura sugerida para un servicio

```text
mi-servicio/
  src/
    api/           # controladores, rutas o handlers
    application/   # casos de uso
    domain/        # modelo y reglas de negocio
    infrastructure/ # persistencia e integraciones externas
  tests/
  Dockerfile
  README.md
```

Define cada servicio con su propio runtime y dependencias cuando se conozca el dominio. Evita compartir acceso directo a las bases de datos de otros servicios.
