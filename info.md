# 1C LevelUp — Конспект проекта

Проект для изучения 1С в геймифицированном формате, по типу Duolingo.
Уроки, вопросы, XP, уровни, прогресс — всё сохраняется в базе данных.

---

## 🛠️ Стек технологий

| Слой | Технология | Зачем |
|---|---|---|
| Frontend | React + TypeScript | UI, анимации, взаимодействие |
| Backend | ASP.NET Core (C#) | API, бизнес-логика |
| БД | PostgreSQL + EF Core | Хранение данных |
| Анимации | Framer Motion | Плавные переходы и эффекты |
| Иконки | Lucide React | Иконки (замок, звезда, и т.д.) |
| Стили | Tailwind CSS | Утилитарные CSS классы |
| Авторизация | JWT (JSON Web Token) | Безопасная аутентификация |

---

## 🚀 Запуск проекта

```bash
# Фронтенд (из папки frontend/)
npm run dev          # http://localhost:5173

# Бэкенд (из папки backend/)
dotnet run           # http://localhost:5184
```

---

## 📁 Структура проекта

```1c-levelup/
├── frontend/
│   └── src/
│       ├── App.tsx                          # Корневой компонент, роутинг между страницами
│       ├── main.tsx                         # Точка входа, оборачивает App в AuthProvider
│       ├── index.css                        # Глобальные стили (@import "tailwindcss")
│       ├── api.ts                           # Все запросы к бэкенду в одном месте
│       ├── context/
│       │   └── AuthContext.tsx              # Глобальное хранилище пользователя (токен, логин, logout)
│       └── components/
│           ├── LevelMap.tsx                 # Главная страница — карта пути с уроками
│           ├── LessonScreen.tsx             # Экран урока — вопросы, ответы, жизни, XP
│           ├── AuthScreen.tsx               # Экран входа и регистрации
│           ├── ProfileScreen.tsx            # Профиль пользователя — уровень, XP, статистика
│           └── admin/
│               ├── AdminPanel.tsx           # Список уроков с управлением
│               ├── LessonModal.tsx          # Модалка создания/редактирования урока
│               └── QuestionModal.tsx        # Модалка создания/редактирования вопроса
└── backend/
├── Models/
│   ├── User.cs                          # Модель пользователя (Id, Username, Email, XP, Level)
│   ├── Lesson.cs                        # Модель урока + Question (вопросы с вариантами)
│   └── UserProgress.cs                  # Прогресс пользователя по урокам
├── Data/
│   └── AppDbContext.cs                  # Контекст EF Core — связь моделей с БД + seed данные
└── Endpoints/
├── AuthEndpoints.cs                 # POST /auth/register, /auth/login, GET /auth/me
├── LessonEndpoints.cs               # GET /lessons/{userId}, /lessons/{id}/questions, POST /progress
└── AdminEndpoints.cs                # CRUD для уроков и вопросов (/admin/...)
```
---

## 🔑 Как работает авторизация (JWT)
> Пользователь вводит email + пароль
> Бэкенд проверяет пароль через BCrypt (хеширование)
> Бэкенд генерирует JWT токен (строка xxxxx.yyyyy.zzzzz)
> Фронт сохраняет токен в localStorage
> При каждом запросе отправляет: Authorization: Bearer <токен>
> Бэкенд проверяет токен и узнаёт кто делает запрос
> JWT токен содержит внутри ID пользователя и срок действия.
> Бэкенд может проверить его без обращения к БД — это быстро.

---

## 🗄️ База данных (EF Core + PostgreSQL)

**EF Core** — это ORM (Object Relational Mapper).
Позволяет работать с БД через C# классы, без написания SQL вручную.

```csharp
// Вместо SQL: SELECT * FROM Users WHERE Id = 1
var user = await db.Users.FindAsync(1);
```

**Миграции** — это история изменений схемы БД:
```bash
dotnet ef migrations add НазваниеИзменения  # создать миграцию
dotnet run  # миграции применяются автоматически при старте
```

**Seed данные** — начальные данные которые добавляются при первом запуске.
Настраиваются в `AppDbContext.cs` в методе `OnModelCreating`.

---

## 🌐 API эндпоинты

| Метод  | Путь                          | Что делает                                 |
|--------|-------------------------------|--------------------------------------------|
| POST   | /auth/register                | Регистрация нового пользователя            |
| POST   | /auth/login                   | Вход, возвращает JWT токен                 |
| GET    | /auth/me                      | Данные текущего пользователя по токену     |
| GET    | /lessons/{userId}             | Список уроков со статусом для пользователя |
| GET    | /lessons/{id}/questions       | Вопросы конкретного урока                  |
| POST   | /progress                     | Сохранить прогресс после урока             |
| GET    | /users/{userId}               | Профиль пользователя                       |
| GET    | /admin/lessons                | Все уроки для админки                      |
| POST   | /admin/lessons                | Создать урок                               |
| PUT    | /admin/lessons/{id}           | Редактировать урок                         |
| DELETE | /admin/lessons/{id}           | Удалить урок                               |
| POST   | /admin/lessons/{id}/questions | Создать вопрос                             |
| PUT    | /admin/questions/{id}         | Редактировать вопрос                       |
| DELETE | /admin/questions/{id}         | Удалить вопрос                             |

---

## ⚛️ Ключевые концепции React использованные в проекте

**useState** — локальное состояние компонента:
```tsx
const [lessons, setLessons] = useState<Lesson[]>([])
```

**useEffect** — выполнить код при загрузке компонента:
```tsx
useEffect(() => {
  // загрузить данные с бэка
}, []) // [] = только при первом рендере
```

**Context (useAuth)** — глобальные данные доступные везде без пропсов:
```tsx
const { user, logout } = useAuth() // в любом компоненте
```

**Props** — параметры которые передаются в компонент:
```tsx
<LessonScreen lessonId={1} onClose={() => {}} onComplete={(xp) => {}} />
```

---

## 📋 Roadmap

- [x] Карта пути с анимациями
- [x] Экран урока (вопросы, жизни, XP)
- [x] Бэкенд + PostgreSQL
- [x] Сохранение прогресса
- [x] Админ панель
- [x] Авторизация (JWT)
- [x] Профиль пользователя
- [ ] Роль Admin — защита /admin маршрута
- [ ] Контент уроков 4-6 через админку
- [ ] Стрики (серии дней)
- [ ] Достижения и бейджи
- [ ] Деплой (Railway + Vercel)

