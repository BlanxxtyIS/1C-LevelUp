# 1C LevelUp — Конспект проекта

Проект для изучения 1С в геймифицированном формате, по типу Duolingo.
Уроки, вопросы, XP, уровни, прогресс — всё сохраняется в базе данных.

---

## 🗺️ Философия проекта

Контент пишется в стиле **космос + восточная мудрость**:

- Каждая тема начинается с цитаты (Лао-цзы, японские концепции, космические аналогии)
- Технические концепции объясняются через метафоры (переменные = отсеки корабля, циклы = орбита)
- Тон живой, без канцелярщины — как будто старший товарищ объясняет за чашкой чая
- В конце каждой темы — **Космическая аналогия 🌌**
- Японские концепции: **Кайдзен** (улучшение на 1% каждый день), **Ичиго Ичиэ** (каждый момент уникален)

**Микропромт для написания уроков:**
> Пиши как старший товарищ который уже набил все шишки. Космические аналогии,
> японская философия, живые примеры из реальной разработки 1С. Никакой воды.
> Каждая тема: цитата → суть → примеры кода → космическая аналогия.

---

## 🛠️ Стек технологий

| Слой | Технология | Зачем |
|---|---|---|
| Frontend | React + TypeScript + Vite | UI, анимации, взаимодействие |
| Backend | ASP.NET Core 9 (C#) | API, бизнес-логика |
| БД | PostgreSQL + EF Core 9 | Хранение данных |
| Анимации | Framer Motion | Плавные переходы и эффекты |
| Иконки | Lucide React | Иконки |
| Стили | Tailwind CSS | Утилитарные CSS классы |
| Авторизация | JWT | Безопасная аутентификация |
| Markdown | react-markdown + remark-gfm | Рендеринг контента уроков |
| Компилятор | OneScript (oscript) | Запуск кода 1С прямо в браузере |

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

```
1c-levelup/
├── frontend/
│   └── src/
│       ├── App.tsx                          # Роутинг между страницами (state-based SPA)
│       ├── api.ts                           # Все fetch-запросы к бэкенду
│       ├── context/
│       │   └── AuthContext.tsx              # JWT + user state + refreshUser()
│       └── components/
│           ├── game/
│           │   ├── LevelMap.tsx             # Карта пути — змейка, XP, уроки
│           │   ├── LessonScreen.tsx         # Экран урока — вопросы, жизни, XP, провал
│           │   └── CodeEditor.tsx           # Интерактивный компилятор 1С
│           ├── courses/
│           │   ├── CoursesPage.tsx          # Список курсов с прогрессом
│           │   ├── ChaptersPage.tsx         # Главы с прогрессом
│           │   ├── TopicsPage.tsx           # Темы с прогрессом + блокировка
│           │   └── TopicScreen.tsx          # Markdown контент + компилятор + XP
│           ├── home/
│           │   ├── HomePage.tsx             # Главная — выбор режима + Premium эффекты
│           │   ├── PremiumModal.tsx         # Модал подписки 250₽/мес + триал 3 дня
│           │   └── LegalPage.tsx            # Оферта, реквизиты (ИНН 165051909394)
│           ├── layout/
│           │   ├── StarField.tsx            # Анимированный звёздный фон (canvas)
│           │   ├── PremiumGlow.tsx          # Фоновое свечение для Premium
│           │   ├── PremiumBadge.tsx         # Бейдж PRO ✨
│           │   ├── Avatar.tsx               # Аватарка (фото или буква)
│           │   └── AchievementToast.tsx     # Всплывашка при получении достижения
│           ├── AuthScreen.tsx               # Вход/регистрация + StarField
│           ├── ProfileScreen.tsx            # Профиль, стрики, достижения (сворачиваемые)
│           ├── LeaderboardPage.tsx          # Таблица лидеров с топ-3 подиумом
│           └── admin/
│               ├── AdminPanel.tsx           # Табы: Игровые уроки / Курсы / Пользователи
│               ├── CourseAdmin.tsx          # Drill-down: курс→глава→тема→урок
│               └── UsersAdmin.tsx           # Список пользователей, смена ролей
└── backend/
├── Models/
│   ├── User.cs                          # Id, Name, Email, TotalXp, Level, Role,
│   │                                    # AvatarUrl, IsPremium, PremiumUntil
│   ├── Lesson.cs                        # Урок + Question. TopicId=null → игровой режим
│   ├── Course.cs                        # Course → Chapter → Topic → Lesson
│   ├── UserProgress.cs                  # Прогресс по урокам
│   ├── Streak.cs                        # Стрики (серии дней)
│   └── Achievement.cs                   # Достижения + UserAchievement
├── Data/
│   └── AppDbContext.cs                  # EF Core контекст + seed данные
└── Endpoints/
├── AuthEndpoints.cs                 # POST /auth/register, /auth/login, GET /auth/me
├── LessonEndpoints.cs               # 🎮 Игровой режим + 📚 Курсы прогресс + 👤 Профиль
├── CourseEndpoints.cs               # 📚 Курсы, главы, темы, прогресс
├── StreakEndpoints.cs               # 🔥 Стрики и достижения
├── AdminEndpoints.cs                # 🔧 CRUD для уроков, курсов, пользователей
└── ExecuteEndpoints.cs              # 💻 Компилятор OneScript (запуск кода 1С)
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

## 🗄️ Ключевые модели БД
User: Id, Name, Email, PasswordHash, Role, TotalXp, Level, AvatarUrl, IsPremium, PremiumUntil
Lesson: Id, Title, XpReward, Order, TopicId(null=игровой), Content, DurationMinutes
Course → Chapter → Topic → Lesson (курсовые уроки, TopicId != null)
UserProgress: UserId, LessonId, IsCOmpleted, XpEarned
Streak: UserId, CurrentStreak, MaxStreak, LastActivityDate
Achievement: Id, Key, Title, Emoji | UserAchievement: UserId, AchievementId

**Важно:** `TopicId == null` → урок игрового режима. `TopicId != null` → урок курса.

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

### 🎮 Игровой режим
| Метод | Путь | Что делает |
|---|---|---|
| GET | /lessons/{userId} | Уроки карты со статусом (completed/active/locked) |
| GET | /lessons/{id}/questions | Вопросы урока |
| POST | /progress | Сохранить прогресс игрового урока |
| GET | /leaderboard | Топ-20 по XP |
| POST | /execute | Запустить код 1С через OneScript |

### 📚 Курсы
| Метод | Путь | Что делает |
|---|---|---|
| GET | /courses | Все курсы |
| GET | /courses/{id}/chapters | Главы курса |
| GET | /chapters/{id}/topics | Темы главы |
| GET | /topics/{id}/lessons | Уроки темы |
| POST | /progress/topic-lesson | Сохранить прогресс урока курса |
| GET | /chapters/{id}/progress/{userId} | Прогресс по темам главы |
| GET | /courses/{id}/progress/{userId} | Прогресс по главам курса |

### 👤 Профиль
| Метод | Путь | Что делает |
|---|---|---|
| GET | /users/{userId} | Профиль пользователя |
| PUT | /users/{id}/avatar | Обновить аватарку (Base64) |
| POST | /users/{userId}/trial | Активировать триал 3 дня (один раз!) |
| GET | /streaks/{userId} | Стрики и достижения |
| POST | /streaks/{userId}/activity | Обновить стрик после урока |
| GET | /achievements/{userId} | Все достижения с флагом isEarned |

### 🔐 Auth
| Метод | Путь | Что делает |
|---|---|---|
| POST | /auth/register | Регистрация |
| POST | /auth/login | Вход → JWT токен |
| GET | /auth/me | Данные по токену |

---

## 💰 Монетизация

- **Бесплатно:** до 100 XP полный доступ
- **Premium:** 250 ₽/месяц — безлимитный доступ
- **Триал:** 3 дня бесплатно (один раз на аккаунт)
- Платёжная система: ЮКасса (в разработке)
- Самозанятый: Хасанов Марат Ильдарович, ИНН 165051909394

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

## 🚢 Деплой

| Сервис | URL |
|---|---|
| Frontend (Vercel) | https://1-c-level-up.vercel.app |
| Backend (Railway) | https://1c-levelup-production.up.railway.app |

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

