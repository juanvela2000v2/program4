# Marketplace Seguro

Proyecto separado en dos carpetas principales:

- `backend`: API NestJS + TypeORM + MySQL.
- `frontend`: Web Angular con signals.

## Requisitos

- Node.js 22+
- MySQL en `localhost:3307`
- Usuario `user`, password `1234`

## Configuracion

1. Crea la base de datos:

```sql
CREATE DATABASE marketplace_seguro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copia variables:

```bash
copy .env.example backend\.env
```

3. Instala dependencias:

```bash
npm install
```

4. Ejecuta:

```bash
npm run api:dev
npm run web:dev
```

API: `http://localhost:3000/api`
Web: `http://localhost:4200`

## Modulos incluidos

- Auth JWT con cookie HTTP-only y roles.
- Publicaciones con workflow real: `draft`, `pending_review`, `published`, `rejected`, `sold`, `archived`.
- Moderacion con proveedor local y punto de extension para OpenAI.
- Pagos con QR y comision de plataforma.
- Chat de soporte/denuncias por Socket.IO.
- Frontend Angular con signals, buscador, filtros, pagos y paneles de chat.
