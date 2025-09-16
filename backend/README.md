# Backend API - Tech Test

Backend сервер на Express.js з TypeScript, PostgreSQL та Prisma.

## Технологічний стек

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **pnpm** - Package manager

## Структура проекту

```
backend/
├── src/
│   ├── config/         # Конфігурація
│   ├── controllers/    # Controllers
│   ├── routes/         # API маршрути
│   ├── middleware/     # Middleware
│   ├── models/         # Prisma моделі
│   ├── utils/          # Утиліти
│   ├── types/          # TypeScript типи
│   ├── app.ts          # Express app
│   └── server.ts       # Server entry point
├── prisma/
│   └── schema.prisma   # Prisma схема
├── .env.example        # Приклад змінних середовища
└── package.json
```

## Встановлення

1. Встановити залежності:
```bash
pnpm install
```

2. Налаштувати змінні середовища:
```bash
cp .env.example .env
# Відредагувати .env файл з вашими налаштуваннями
```

3. Згенерувати Prisma client:
```bash
pnpm prisma:generate
```

4. Запустити міграції (після налаштування бази даних):
```bash
pnpm prisma:migrate
```

## Запуск

### Development режим
```bash
pnpm dev
```

### Production режим
```bash
pnpm build
pnpm start
```

## Доступні команди

- `pnpm dev` - Запуск у development режимі з hot reload
- `pnpm build` - Збірка проекту
- `pnpm start` - Запуск production збірки
- `pnpm prisma:generate` - Генерація Prisma client
- `pnpm prisma:migrate` - Запуск міграцій
- `pnpm prisma:studio` - Відкрити Prisma Studio

## API Endpoints

- `GET /health` - Health check
- `GET /api` - Базовий API endpoint

## Environment Variables

Дивіться `.env.example` для списку необхідних змінних середовища.