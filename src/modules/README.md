# Módulos de producto

Cada módulo corresponde a un área de negocio y es dueño de sus datos, componentes y casos de uso. Las carpetas internas pueden evolucionar según el tamaño real del dominio:

```text
modulo/
  components/       # componentes de interfaz del dominio
  domain/           # entidades, tipos y reglas de negocio
  application/      # casos de uso y coordinación
  infrastructure/  # persistencia e integraciones
  index.ts          # API pública para otros módulos
```

No es necesario crear todas las carpetas en un módulo pequeño. Importa desde otro módulo únicamente su `index.ts` y evita ciclos de dependencia.
