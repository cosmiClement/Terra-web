# Cuenta

Dueño de los datos y validaciones del perfil del cliente. `domain/profile.ts` define el modelo y su validación; `application/save-profile.ts` coordina la operación; `components/account-page.tsx` presenta el formulario. `index.ts` es la API pública.

La página está conectada en `/account`. La persistencia y autenticación del perfil quedan pendientes de integrar con un backend.
