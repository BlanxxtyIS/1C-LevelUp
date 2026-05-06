using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Endpoints;

public static class LessonEndpoints
{
    public static void MapLessonEndpoints(this WebApplication app)
    {
     // Получить все уроки с прогрессом пользователя
        app.MapGet("/lessons/{userId}", async (int userId, AppDbContext db) =>
        {
            var lessons = await db.Lessons
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

        // Сохранить прогресс
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

        // Получить профиль пользователя
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
                user.TotalXp,
                user.Level,
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
    }
}

public record ProgressRequest(int UserId, int LessonId, int XpEarned);