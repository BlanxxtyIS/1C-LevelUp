using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<UserProgress> UserProgress => Set<UserProgress>();

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Chapter> Chapters => Set<Chapter>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<Streak> Streaks => Set<Streak>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Один урок — много вопросов
        modelBuilder.Entity<Question>()
            .HasOne(q => q.Lesson)
            .WithMany(l => l.Questions)
            .HasForeignKey(q => q.LessonId);

        // Один прогресс — один юзер + один урок
        modelBuilder.Entity<UserProgress>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId);

        modelBuilder.Entity<UserProgress>()
            .HasOne(p => p.Lesson)
            .WithMany()
            .HasForeignKey(p => p.LessonId);

        modelBuilder.Entity<Chapter>()
            .HasOne(c => c.Course)
            .WithMany(c => c.Chapters)
            .HasForeignKey(c => c.CourseId);

        modelBuilder.Entity<Topic>()
            .HasOne(t => t.Chapter)
            .WithMany(c => c.Topics)
            .HasForeignKey(t => t.ChapterId);

        modelBuilder.Entity<Lesson>()
            .HasOne(l => l.TopicRef)
            .WithMany(t => t.Lessons)
            .HasForeignKey(l => l.TopicId)
            .IsRequired(false);

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasDefaultValue("Student");

        // Seed — первый курс
        modelBuilder.Entity<Course>().HasData(
            new Course { Id = 1, Title = "1С Основы", Description = "Фундамент платформы 1С:Предприятие", Emoji = "🏗️", Color = "#7c3aed", Order = 1 }
        );

        modelBuilder.Entity<Chapter>().HasData(
            new Chapter { Id = 1, CourseId = 1, Title = "Введение в платформу", Description = "Что такое 1С и как она устроена", Order = 1 },
            new Chapter { Id = 2, CourseId = 1, Title = "Объекты конфигурации", Description = "Справочники, документы, регистры", Order = 2 },
            new Chapter { Id = 3, CourseId = 1, Title = "Язык запросов", Description = "Получение данных из БД", Order = 3 }
        );

        modelBuilder.Entity<Topic>().HasData(
            new Topic { Id = 1, ChapterId = 1, Title = "Что такое 1С?", Description = "Обзор платформы", Order = 1 },
            new Topic { Id = 2, ChapterId = 1, Title = "Конфигуратор", Description = "Среда разработки", Order = 2 },
            new Topic { Id = 3, ChapterId = 2, Title = "Справочники", Description = "Условно-постоянные данные", Order = 1 },
            new Topic { Id = 4, ChapterId = 2, Title = "Документы", Description = "Хозяйственные операции", Order = 2 },
            new Topic { Id = 5, ChapterId = 3, Title = "Основы запросов", Description = "SELECT в языке 1С", Order = 1 }
        );

        // Seed — начальные данные
        modelBuilder.Entity<Lesson>().HasData(
            new Lesson { Id = 1, Title = "Что такое 1С?", Description = "Введение в платформу", XpReward = 10, Order = 1, Topic = "1c-basics" },
            new Lesson { Id = 2, Title = "Интерфейс платформы", Description = "Конфигуратор и режим предприятия", XpReward = 15, Order = 2, Topic = "1c-basics" },
            new Lesson { Id = 3, Title = "Справочники", Description = "Хранение условно-постоянных данных", XpReward = 20, Order = 3, Topic = "1c-basics" },
            new Lesson { Id = 4, Title = "Документы", Description = "Хозяйственные операции", XpReward = 20, Order = 4, Topic = "1c-basics" },
            new Lesson { Id = 5, Title = "Регистры", Description = "Накопление и хранение данных", XpReward = 25, Order = 5, Topic = "1c-basics" },
            new Lesson { Id = 6, Title = "Запросы", Description = "Язык запросов 1С", XpReward = 30, Order = 6, Topic = "1c-basics" }
        );

        modelBuilder.Entity<Question>().HasData(
            // Урок 1 — Что такое 1С?
            new Question { Id = 1, LessonId = 1, Text = "Что такое 1С:Предприятие?", OptionsJson = "[\"Язык программирования\",\"Платформа для создания бизнес-приложений\",\"База данных\",\"Операционная система\"]", CorrectIndex = 1, Explanation = "1С:Предприятие — это платформа для разработки и запуска бизнес-приложений (конфигураций)." },
            new Question { Id = 2, LessonId = 1, Text = "Как называется программа для разработки в 1С?", OptionsJson = "[\"Visual Studio\",\"Конфигуратор\",\"Среда разработки\",\"IDE 1С\"]", CorrectIndex = 1, Explanation = "Конфигуратор — это встроенная среда разработки платформы 1С:Предприятие." },
            new Question { Id = 3, LessonId = 1, Text = "Что такое конфигурация в 1С?", OptionsJson = "[\"Настройки операционной системы\",\"Прикладное решение созданное на платформе 1С\",\"База данных пользователей\",\"Файл настроек\"]", CorrectIndex = 1, Explanation = "Конфигурация — это прикладное решение (программа) созданное на платформе 1С. Например: 1С:Бухгалтерия, 1С:ЗУП." },

            // Урок 2 — Интерфейс платформы
            new Question { Id = 4, LessonId = 2, Text = "В каком режиме работают обычные пользователи 1С?", OptionsJson = "[\"Конфигуратор\",\"Режим предприятия\",\"Режим отладки\",\"Административный режим\"]", CorrectIndex = 1, Explanation = "Режим предприятия — это пользовательский режим работы, где ведётся реальная работа с данными." },
            new Question { Id = 5, LessonId = 2, Text = "Где разработчик создаёт объекты конфигурации?", OptionsJson = "[\"В режиме предприятия\",\"В конфигураторе\",\"В консоли запросов\",\"В браузере\"]", CorrectIndex = 1, Explanation = "Конфигуратор — среда разработки где создаются справочники, документы, отчёты и другие объекты." },
            new Question { Id = 6, LessonId = 2, Text = "Как называется дерево объектов конфигурации в конфигураторе?", OptionsJson = "[\"Структура базы данных\",\"Дерево конфигурации\",\"Список объектов\",\"Иерархия классов\"]", CorrectIndex = 1, Explanation = "Дерево конфигурации — панель в конфигураторе где отображаются все объекты: справочники, документы, регистры и т.д." },

            // Урок 3 — Справочники
            new Question { Id = 7, LessonId = 3, Text = "Что такое Справочник в 1С?", OptionsJson = "[\"Документ для записи операций\",\"Объект для хранения условно-постоянной информации\",\"Отчёт для вывода данных\",\"Регистр для накопления данных\"]", CorrectIndex = 1, Explanation = "Справочник хранит условно-постоянные данные — товары, контрагентов, сотрудников." },
            new Question { Id = 8, LessonId = 3, Text = "Какой реквизит есть у каждого Справочника по умолчанию?", OptionsJson = "[\"Дата\",\"Код и Наименование\",\"Сумма\",\"Количество\"]", CorrectIndex = 1, Explanation = "Каждый справочник автоматически имеет реквизиты Код и Наименование." },
            new Question { Id = 9, LessonId = 3, Text = "Как называется элемент справочника верхнего уровня при иерархии?", OptionsJson = "[\"Документ\",\"Папка (группа)\",\"Регистр\",\"Константа\"]", CorrectIndex = 1, Explanation = "В иерархических справочниках элементы группируются в Папки (группы)." }
        );

        modelBuilder.Entity<Streak>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId);

        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.User)
            .WithMany()
            .HasForeignKey(ua => ua.UserId);

        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.Achievement)
            .WithMany()
            .HasForeignKey(ua => ua.AchievementId);

        // Seed достижений
        modelBuilder.Entity<Achievement>().HasData(
            new Achievement { Id = 1, Key = "first_lesson", Title = "Первый шаг", Description = "Пройти первый урок", Emoji = "🎯" },
            new Achievement { Id = 2, Key = "xp_50", Title = "Новичок", Description = "Набрать 50 XP", Emoji = "⚡" },
            new Achievement { Id = 3, Key = "xp_200", Title = "Ученик", Description = "Набрать 200 XP", Emoji = "📖" },
            new Achievement { Id = 4, Key = "xp_500", Title = "Знаток", Description = "Набрать 500 XP", Emoji = "🧠" },
            new Achievement { Id = 5, Key = "lessons_5", Title = "Книжный червь", Description = "Пройти 5 уроков", Emoji = "📚" },
            new Achievement { Id = 6, Key = "lessons_10", Title = "Усердный", Description = "Пройти 10 уроков", Emoji = "💪" },
            new Achievement { Id = 7, Key = "streak_3", Title = "Огонёк", Description = "3 дня подряд", Emoji = "🔥" },
            new Achievement { Id = 8, Key = "streak_7", Title = "Неделя силы", Description = "7 дней подряд", Emoji = "🏆" }
        );
    }
}