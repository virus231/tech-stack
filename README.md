# 📝 Ukrainian Mini Blog

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://tech-stack-green.vercel.app/)

🌐 **Live Demo**: [https://tech-stack-green.vercel.app/](https://tech-stack-green.vercel.app/)

A modern, responsive mini-blog application built with Next.js 15 and Express.js, featuring user authentication, post management, and a beautiful Ukrainian interface.

---

## 🌟 Features

### 🔐 Authentication System
- **User Registration & Login** - Secure authentication with JWT tokens
- **Protected Routes** - Access control for authenticated users only
- **Auto-logout** - Automatic session management on token expiration

### 📚 Post Management
- **Create Posts** - Rich text posts with title, description, and content
- **View Posts** - Beautiful, responsive post listing with pagination
- **Edit Posts** - Full post editing for post authors
- **Query-based Routing** - SEO-friendly URLs with query parameters

### 👤 User Profile
- **Profile Management** - Update user information and password
- **Account Settings** - Secure password changes with validation
- **Account Deletion** - Complete account removal with confirmation

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with TailwindCSS 4
- **ShadcnUI Components** - Beautiful, accessible UI components
- **Loading States** - Skeleton loaders and smooth transitions
- **Toast Notifications** - User-friendly feedback system
- **Ukrainian Localization** - Full Ukrainian language support

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ShadcnUI](https://ui.shadcn.com/)** - Beautiful UI component library
- **[TanStack React Query](https://tanstack.com/query)** - Powerful data fetching
- **[Axios](https://axios-http.com/)** - HTTP client with interceptors
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[date-fns](https://date-fns.org/)** - Date formatting with Ukrainian locale

### Backend
- **[Express.js](https://expressjs.com/)** - Fast, minimalist web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe server development
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Reliable relational database
- **[JWT](https://jwt.io/)** - Secure authentication tokens
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing

### Development Tools
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[pnpm](https://pnpm.io/)** - Efficient package manager
- **[Turbopack](https://turbo.build/pack)** - Fast development builds

---

## 🌐 Live Demo

🚀 **Experience the app**: [https://tech-stack-green.vercel.app/](https://tech-stack-green.vercel.app/)

### Demo Features:
- ✅ User registration and login
- ✅ Create, view, and edit posts
- ✅ Responsive design on all devices
- ✅ Ukrainian interface
- ✅ Real-time notifications

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm/pnpm**
- **PostgreSQL** database
- **Git** for version control

### 📦 Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd tech-test
```

2. **Install dependencies**
```bash
# Backend dependencies
cd backend
pnpm install

# Frontend dependencies
cd ../frontend
pnpm install
```

3. **Environment Setup**

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/miniblog"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000"
```

**Frontend** (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Database Setup**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

6. **Open your browser** 🌐
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

---

## 🌐 Deployment

### Production Deployment
- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Backend**: Deployed with database hosting
- **Database**: PostgreSQL with connection pooling

### Custom Deployment

#### Vercel (Frontend)
1. Connect your repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url/api`
3. Deploy! 🚀

#### Railway/Render (Backend)
1. Connect your repository to Railway or Render
2. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
3. Deploy the backend service
4. Update frontend `NEXT_PUBLIC_API_URL` to point to your backend

---

## 📁 Project Structure

```
tech-test/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── package.json
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (owner only)

### Users
- `GET /api/users/me` - Get current user (auth required)
- `PUT /api/users/me` - Update user profile (auth required)
- `DELETE /api/users/me` - Delete user account (auth required)

---

## 🚀 Git Workflow & CI/CD

### Branching Strategy
The project uses **Git Flow** with automated releases:

```
main/master     ←── Production releases (stable)
    ↑
develop         ←── Integration branch (beta releases)  
    ↑
feature/*       ←── Feature development
hotfix/*        ←── Urgent production fixes
```

### Semantic Release
Automated versioning with conventional commits:

```bash
feat: add new feature          # minor version bump
fix: bug fix                   # patch version bump
docs: update documentation     # patch version bump
refactor: code refactoring     # patch version bump
```

### GitHub Actions
- **CI Pipeline**: Build, lint, type-check on PRs
- **Release Pipeline**: Automated releases to production
- **PR Validation**: Full validation before merge

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

**Happy coding! 🎉**

---

# 📝 Український Міні-Блог

🌐 **Демо-версія**: [https://tech-stack-green.vercel.app/](https://tech-stack-green.vercel.app/)

Сучасний, адаптивний додаток міні-блогу, створений з Next.js 15 та Express.js, з автентифікацією користувачів, управлінням постами та красивим українським інтерфейсом.

---

## 🌟 Можливості

### 🔐 Система Автентифікації
- **Реєстрація та Вхід** - Безпечна автентифікація з JWT токенами
- **Захищені Маршрути** - Контроль доступу тільки для авторизованих користувачів
- **Авто-вихід** - Автоматичне управління сесіями при закінченні токена

### 📚 Управління Постами
- **Створення Постів** - Багатий текстовий контент з заголовком, описом і змістом
- **Перегляд Постів** - Красивий, адаптивний список постів з пагінацією
- **Редагування Постів** - Повне редагування для авторів постів
- **Query-based Маршрутизація** - SEO-дружні URL з query параметрами

### 👤 Профіль Користувача
- **Управління Профілем** - Оновлення інформації користувача та пароля
- **Налаштування Акаунта** - Безпечна зміна пароля з валідацією
- **Видалення Акаунта** - Повне видалення акаунта з підтвердженням

### 🎨 Сучасний UI/UX
- **Адаптивний Дизайн** - Mobile-first підхід з TailwindCSS 4
- **ShadcnUI Компоненти** - Красиві, доступні UI компоненти
- **Стани Завантаження** - Скелетони завантаження та плавні переходи
- **Toast Сповіщення** - Зручна система зворотного зв'язку
- **Українська Локалізація** - Повна підтримка української мови

---

## 🚀 Технологічний Стек

### Фронтенд
- **[Next.js 15](https://nextjs.org/)** - React фреймворк з App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Типобезпечний JavaScript
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS фреймворк
- **[ShadcnUI](https://ui.shadcn.com/)** - Красива бібліотека UI компонентів
- **[TanStack React Query](https://tanstack.com/query)** - Потужне отримання даних
- **[Axios](https://axios-http.com/)** - HTTP клієнт з інтерцепторами
- **[React Hook Form](https://react-hook-form.com/)** - Продуктивна обробка форм
- **[Zod](https://zod.dev/)** - Валідація схем
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast сповіщення
- **[date-fns](https://date-fns.org/)** - Форматування дат з українською локаллю

### Бекенд
- **[Express.js](https://expressjs.com/)** - Швидкий, мінімалістичний веб-фреймворк
- **[TypeScript](https://www.typescriptlang.org/)** - Типобезпечна розробка сервера
- **[Prisma](https://www.prisma.io/)** - ORM нового покоління
- **[PostgreSQL](https://www.postgresql.org/)** - Надійна реляційна база даних
- **[JWT](https://jwt.io/)** - Безпечні токени автентифікації
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Хешування паролів
- **[CORS](https://github.com/expressjs/cors)** - Спільний доступ до ресурсів різних доменів

### Інструменти Розробки
- **[Biome](https://biomejs.dev/)** - Швидкий лінтер та форматер
- **[pnpm](https://pnpm.io/)** - Ефективний менеджер пакетів
- **[Turbopack](https://turbo.build/pack)** - Швидка збірка для розробки

---

## 🌐 Демо-версія

🚀 **Спробуйте додаток**: [https://tech-stack-green.vercel.app/](https://tech-stack-green.vercel.app/)

### Демо-функції:
- ✅ Реєстрація та авторизація користувачів
- ✅ Створення, перегляд та редагування постів
- ✅ Адаптивний дизайн на всіх пристроях
- ✅ Український інтерфейс
- ✅ Сповіщення в реальному часі

---

## 🛠️ Встановлення та Налаштування

### Вимоги
- **Node.js** 18+ та **npm/pnpm**
- **PostgreSQL** база даних
- **Git** для контролю версій

### 📦 Швидкий Старт

1. **Клонувати репозиторій**
```bash
git clone <repository-url>
cd tech-test
```

2. **Встановити залежності**
```bash
# Залежності бекенду
cd backend
pnpm install

# Залежності фронтенду
cd ../frontend
pnpm install
```

3. **Налаштування Середовища**

**Бекенд** (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/miniblog"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000"
```

**Фронтенд** (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Налаштування Бази Даних**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Запуск Серверів Розробки**
```bash
# Термінал 1 - Бекенд
cd backend
pnpm dev

# Термінал 2 - Фронтенд
cd frontend
pnpm dev
```

6. **Відкрити у браузері** 🌐
   - Фронтенд: http://localhost:3000
   - Бекенд API: http://localhost:3001/api

---

## 🌐 Деплоймент

### Продакшн Деплоймент
- **Фронтенд**: Деплоїто на [Vercel](https://vercel.com/)
- **Бекенд**: Деплоїто з хостингом бази даних
- **База Даних**: PostgreSQL з пулом з'єднань

### Власний Деплоймент

#### Vercel (Фронтенд)
1. Підключити репозиторій до Vercel
2. Встановити змінні середовища:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url/api`
3. Деплоїти! 🚀

#### Railway/Render (Бекенд)
1. Підключити репозиторій до Railway або Render
2. Встановити змінні середовища (DATABASE_URL, JWT_SECRET, тощо)
3. Деплоїти бекенд сервіс
4. Оновити `NEXT_PUBLIC_API_URL` фронтенду, щоб вказувати на ваш бекенд

---

## 📁 Структура Проекту

```
tech-test/
├── backend/                 # Express.js API Сервер
│   ├── src/
│   │   ├── controllers/     # Обробники маршрутів
│   │   ├── middleware/      # Користувацький middleware
│   │   ├── routes/         # API маршрути
│   │   ├── config/         # Файли конфігурації
│   │   └── index.ts        # Точка входу сервера
│   ├── prisma/             # Схема бази даних та міграції
│   └── package.json
├── frontend/               # Next.js Додаток
│   ├── src/
│   │   ├── app/           # Сторінки App Router
│   │   ├── components/    # UI компоненти для повторного використання
│   │   ├── contexts/      # React контексти
│   │   ├── hooks/         # Користувацькі React хуки
│   │   └── lib/           # Допоміжні функції
│   └── package.json
└── README.md
```

---

## 🔑 API Точки Доступу

### Автентифікація
- `POST /api/auth/register` - Реєстрація користувача
- `POST /api/auth/login` - Вхід користувача

### Пости
- `GET /api/posts` - Отримати всі пости
- `GET /api/posts/:id` - Отримати пост за ID
- `POST /api/posts` - Створити новий пост (потрібна авторизація)
- `PUT /api/posts/:id` - Оновити пост (тільки власник)

### Користувачі
- `GET /api/users/me` - Отримати поточного користувача (потрібна авторизація)
- `PUT /api/users/me` - Оновити профіль користувача (потрібна авторизація)
- `DELETE /api/users/me` - Видалити акаунт користувача (потрібна авторизація)

---

## 🚀 Git Workflow та CI/CD

### Стратегія Гілок
Проект використовує **Git Flow** з автоматизованими релізами:

```
main/master     ←── Продакшн релізи (стабільні)
    ↑
develop         ←── Інтеграційна гілка (бета релізи)
    ↑
feature/*       ←── Розробка функцій
hotfix/*        ←── Термінові виправлення
```

### Семантичні Релізи
Автоматична версійність з конвенційними комітами:

```bash
feat: add new feature          # minor version bump
fix: bug fix                   # patch version bump
docs: update documentation     # patch version bump
refactor: code refactoring     # patch version bump
```

### GitHub Actions
- **CI Pipeline**: Збірка, лінтинг, перевірка типів на PR
- **Release Pipeline**: Автоматичні релізи в продакшн
- **PR Validation**: Повна валідація перед злиттям

---

## 🤝 Внесок

1. Форкнути репозиторій
2. Створити гілку з функцією (`git checkout -b feature/amazing-feature`)
3. Закомітити зміни (`git commit -m 'feat: add amazing feature'`)
4. Пушнути до гілки (`git push origin feature/amazing-feature`)
5. Відкрити Pull Request

---

## 📄 Ліцензія

Цей проект ліцензовано під MIT License - дивіться файл [LICENSE](LICENSE) для деталей.

---

## 📞 Підтримка

Якщо у вас є питання або потрібна допомога з налаштуванням, будь ласка, відкрийте issue або зв'яжіться з командою розробки.

**Щасливого кодування! 🎉**