using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Endpoints;

public static class LessonEndpoints
{
    public static void MapLessonEndpoints(this WebApplication app)
    {
        // ── 🎮 ИГРОВОЙ РЕЖИМ ──────────────────────────────────────
        // /lessons/{userId} — список уроков карты
        // /lessons/{lessonId}/questions — вопросы урока
        // /progress — сохранить прогресс игрового урока
        app.MapGet("/lessons/{userId}", async (int userId, AppDbContext db) =>
        {
            var lessons = await db.Lessons
                .Where(l => l.TopicId == null)
                .OrderBy(l => l.Order)
                .ToListAsync();

            var progress = await db.UserProgress
                .Where(p => p.UserId == userId)
                .ToListAsync();

            var result = lessons.Select((lesson, index) =>
            {
                var isCompleted = progress.Any(p => p.LessonId == lesson.Id && p.IsCOmpleted);
                var prevCompleted = index == 0 || progress.Any(p => p.LessonId == lessons[index - 1].Id && p.IsCOmpleted);

                string status = isCompleted ? "completed" : prevCompleted ? "active" : "locked";

                return new
                {
                    lesson.Id,
                    lesson.Title,
                    lesson.XpReward,
                    lesson.Order,
                    Status = status
                };
            });

            return Results.Ok(result);
        });

        // Получить вопросы урока
        app.MapGet("/lessons/{lessonId}/questions", async (int lessonId, AppDbContext db) =>
        {
            var questions = await db.Questions
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();

            var result = questions.Select(q => new
            {
                q.Id,
                q.Text,
                Options = System.Text.Json.JsonSerializer.Deserialize<string[]>(q.OptionsJson),
                q.CorrectIndex,
                q.Explanation
            });

            return Results.Ok(result);
        });

        // ── 👤 ПРОФИЛЬ ────────────────────────────────────────────
        // /users/{userId} — профиль
        // /users/{id}/avatar — аватарка
        // /users/{userId}/trial — пробный период
        app.MapGet("/users/{userId}", async (int userId, AppDbContext db) =>
        {
            var user = await db.Users.FindAsync(userId);
            if (user == null) return Results.NotFound();

            var completedCount = await db.UserProgress
                .CountAsync(p => p.UserId == userId && p.IsCOmpleted);

            return Results.Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.TotalXp,
                user.Level,
                user.AvatarUrl,
                CompletedLessons = completedCount
            });
        });

        // Временный эндпоинт — создать тестового пользователя
        app.MapPost("/users/test", async (AppDbContext db) =>
        {
            var existing = await db.Users.FirstOrDefaultAsync(u => u.Name == "test");
            if (existing != null) return Results.Ok(existing);

            var user = new User
            {
                Name = "test",
                Email = "test@test.com",
                PasswordHash = "test"
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
            return Results.Ok(user);
        });

        // ── 📚 КУРСЫ ──────────────────────────────────────────────
        // /progress/topic-lesson — сохранить прогресс урока курса
        // /progress/{userId}/completed — пройденные уроки
        app.MapPost("/progress", async (ProgressRequest req, AppDbContext db) =>
        {
            var existing = await db.UserProgress
                .FirstOrDefaultAsync(p => p.UserId == req.UserId && p.LessonId == req.LessonId);

            if (existing != null)
                return Results.Ok(existing);

            var progress = new UserProgress
            {
                UserId = req.UserId,
                LessonId = req.LessonId,
                IsCOmpleted = true,
                XpEarned = req.XpEarned,
                CompletedAt = DateTime.UtcNow
            };

            db.UserProgress.Add(progress);

            // Обновляем XP пользователя
            var user = await db.Users.FindAsync(req.UserId);
            if (user != null)
            {
                user.TotalXp += req.XpEarned;
                user.Level = (user.TotalXp / 50) + 1;
            }

            await db.SaveChangesAsync();
            return Results.Ok(progress);
        });

        // Сохранить прогресс курсового урока
        app.MapPost("/progress/topic-lesson", async (ProgressRequest req, AppDbContext db) =>
        {
            var existing = await db.UserProgress
                .FirstOrDefaultAsync(p => p.UserId == req.UserId && p.LessonId == req.LessonId);

            if (existing != null)
                return Results.Ok(existing);

            var progress = new UserProgress
            {
                UserId = req.UserId,
                LessonId = req.LessonId,
                IsCOmpleted = true,
                XpEarned = req.XpEarned,
                CompletedAt = DateTime.UtcNow
            };

            db.UserProgress.Add(progress);

            var user = await db.Users.FindAsync(req.UserId);
            if (user != null)
            {
                user.TotalXp += req.XpEarned;
                user.Level = (user.TotalXp / 50) + 1;
            }

            await db.SaveChangesAsync();
            return Results.Ok(progress);
        });

        // Получить пройденные уроки пользователя
        app.MapGet("/progress/{userId}/completed", async (int userId, AppDbContext db) =>
        {
            var completed = await db.UserProgress
                .Where(p => p.UserId == userId && p.IsCOmpleted)
                .Select(p => p.LessonId)
                .ToListAsync();
            return Results.Ok(completed);
        });

        // ── 🏆 ЛИДЕРБОРД ──────────────────────────────────────────
        // /leaderboard — таблица лидеров
        app.MapGet("/leaderboard", async (AppDbContext db) =>
        {
            var leaders = await db.Users
                .OrderByDescending(u => u.TotalXp)
                .Take(20)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.TotalXp,
                    u.Level,
                    u.AvatarUrl,
                    CompletedLessons = db.UserProgress.Count(p => p.UserId == u.Id && p.IsCOmpleted)
                })
                .ToListAsync();
            return Results.Ok(leaders);
        });

        // Обновить аватарку
        app.MapPut("/users/{id}/avatar", async (int id, AvatarRequest req, AppDbContext db) =>
        {
            var user = await db.Users.FindAsync(id);
            if (user == null) return Results.NotFound();

            // Проверка размера — base64 строка не должна быть больше ~2.7MB (2MB файл)
            if (req.AvatarUrl?.Length > 2_800_000)
                return Results.BadRequest(new { error = "Файл слишком большой. Максимум 2MB." });

            user.AvatarUrl = req.AvatarUrl;
            await db.SaveChangesAsync();
            return Results.Ok(new { user.Id, user.AvatarUrl });
        });

        //Тестовый период
        app.MapPost("/users/{userId}/trial", async (int userId, AppDbContext db) =>
        {
            var user = await db.Users.FindAsync(userId);
            if (user == null) return Results.NotFound();

            // Даём триал только если ещё не было премиума
            if (user.IsPremium && user.PremiumUntil > DateTime.UtcNow)
                return Results.BadRequest(new { error = "Подписка уже активна" });

            user.IsPremium = true;
            user.PremiumUntil = DateTime.UtcNow.AddDays(3);
            await db.SaveChangesAsync();

            return Results.Ok(new { user.IsPremium, user.PremiumUntil });
        });
    }
}

public record ProgressRequest(int UserId, int LessonId, int XpEarned);
public record AvatarRequest(string? AvatarUrl);