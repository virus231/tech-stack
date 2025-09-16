# Tech Test Project

Повнофункціональний проект з бекендом (Express.js + TypeScript + PostgreSQL) та CI/CD через semantic-release.

## Структура проекту

```
tech-test/
├── backend/          # Express.js API сервер
├── frontend/         # Фронтенд додаток
├── .github/         # GitHub Actions workflows
└── package.json     # Root скрипти та semantic-release
```

## Встановлення та запуск

### Root команди
```bash
# Встановити всі залежності
pnpm install

# Розробка
pnpm dev              # Backend development server
pnpm dev:frontend     # Frontend development server

# Збірка
pnpm build           # Build backend + frontend
pnpm build:backend   # Тільки backend
pnpm build:frontend  # Тільки frontend

# Production
pnpm start           # Start backend server
```

### Backend окремо
```bash
cd backend
pnpm dev             # Development with hot reload
pnpm build           # Production build
pnpm start           # Start production server
```

## Git Workflow & Branching Strategy

### Branching Model
Проект використовує **Git Flow** стратегію з автоматизацією через GitHub Actions:

```
main/master     ←── Production releases (stable)
    ↑
develop         ←── Integration branch (beta releases)
    ↑
feature/*       ←── Feature development
hotfix/*        ←── Urgent production fixes
```

### Branch Rules
- **main/master**: Тільки стабільні релізи (v1.0.0, v1.1.0)
- **develop**: Beta релізи для тестування (v1.1.0-beta.1)
- **feature/**: Розробка нових функцій
- **hotfix/**: Термінові виправлення для production

### Workflow
1. **Розробка**: `feature/auth-system` ← branch з develop
2. **Code Review**: PR feature → develop
3. **Integration**: PR develop → main (release готовий)
4. **Hotfix**: `hotfix/critical-bug` ← branch з main

## CI/CD & Releases

### GitHub Actions Workflows

#### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
- **Triggers**: Push до develop, feature/*, hotfix/*
- **Triggers**: PR до main, master, develop
- **Actions**: Build, lint, type-check (без deploy)

#### 2. **Release Pipeline** (`.github/workflows/release.yml`)
- **Triggers**: Push до main, master, develop
- **Actions**: Build + semantic-release + deploy
- **Outputs**: 
  - main → stable release (v1.0.0)
  - develop → beta release (v1.1.0-beta.1)

#### 3. **PR Validation** (`.github/workflows/pr-to-main.yml`)
- **Triggers**: PR до main/master
- **Actions**: Повна валідація перед merge

### Semantic Release
Проект використовує [semantic-release](https://semantic-release.gitbook.io/) для автоматичних релізів:

#### Commit Message Convention
```bash
feat: add new feature          # minor version bump
fix: bug fix                   # patch version bump  
docs: update documentation     # patch version bump
style: formatting changes      # patch version bump
refactor: code refactoring     # patch version bump
perf: performance improvement  # patch version bump
test: add tests               # patch version bump
build: build system changes   # patch version bump
ci: CI configuration changes  # patch version bump
chore: maintenance tasks      # patch version bump
```

#### Приклади commit messages:
```bash
feat: add user authentication API
fix: resolve database connection timeout
docs: update API documentation
refactor: improve error handling in auth middleware
```

### GitHub Actions

#### Release Workflow
- **Trigger**: Push до `main`/`master` branch
- **Дії**: 
  1. Build backend та frontend
  2. Створити GitHub release з changelog
  3. Завантажити build артефакти
  4. Оновити CHANGELOG.md

### Налаштування Repository

1. **GitHub Settings > Actions > General**:
   - Workflow permissions: "Read and write permissions"
   - Allow GitHub Actions to create and approve pull requests: ✅

2. **Repository settings**:
   - Встановити default branch як `main`
   - Налаштувати branch protection rules (опціонально)

### Manual Release
```bash
# Локальний релім (тільки для тестування)
pnpm semantic-release --dry-run

# Force релім (якщо потрібно)
pnpm semantic-release --no-ci
```

## Environment Variables

### Backend
Див. `backend/.env.example` для списку необхідних змінних.

### Frontend
Див. `frontend/.env.example` для конфігурації фронтенда.

## Версії та Changelog

- Версії автоматично генеруються через semantic-release
- CHANGELOG.md автоматично оновлюється
- GitHub releases створюються автоматично
- Build артефакти завантажуються до GitHub releases