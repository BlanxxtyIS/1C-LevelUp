using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Endpoints;

//Стрики, достижения
public static class StreakEndpoints
{
    public static void MapStreakEndpoints(this WebApplication app)
    {
        // Получить стрик и достижения пользователя
        app.MapGet("/streaks/{userId}", async (int userId, AppDbContext db) =>
        {
            var streak = await db.Streaks.FirstOrDefaultAsync(s => s.UserId == userId);
            var achievements = await db.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Include(ua => ua.Achievement)
                .Select(ua => new {
                    ua.Achievement.Key,
                    ua.Achievement.Title,
                    ua.Achievement.Description,
                    ua.Achievement.Emoji,
                    ua.EarnedAt
                })
                .ToListAsync();

            return Results.Ok(new {
                CurrentStreak = streak?.CurrentStreak ?? 0,
                MaxStreak = streak?.MaxStreak ?? 0,
                LastActivityDate = streak?.LastActivityDate,
                Achievements = achievements
            });
        });

        // Обновить стрик после прохождения урока
        app.MapPost("/streaks/{userId}/activity", async (int userId, AppDbContext db) =>
        {
            var today = DateTime.UtcNow.Date;
            var streak = await db.Streaks.FirstOrDefaultAsync(s => s.UserId == userId);

            if (streak == null)
            {
                streak = new Streak { UserId = userId, CurrentStreak = 1, MaxStreak = 1, LastActivityDate = DateTime.UtcNow };
                db.Streaks.Add(streak);
            }
            else
            {
                var lastDate = streak.LastActivityDate.Date;
                if (lastDate == today)
                {
                    // Уже был сегодня — не меняем
                }
                else if (lastDate == today.AddDays(-1))
                {
                    // Был вчера — продолжаем стрик
                    streak.CurrentStreak++;
                    streak.LastActivityDate = DateTime.UtcNow;
                }
                else
                {
                    // Пропустил день — сбрасываем
                    streak.CurrentStreak = 1;
                    streak.LastActivityDate = DateTime.UtcNow;
                }

                if (streak.CurrentStreak > streak.MaxStreak)
                    streak.MaxStreak = streak.CurrentStreak;
            }

            await db.SaveChangesAsync();

            // Проверяем достижения
            var newAchievements = await CheckAchievements(userId, db);
            await db.SaveChangesAsync();

            return Results.Ok(new {
                streak.CurrentStreak,
                streak.MaxStreak,
                NewAchievements = newAchievements
            });
        });

        // Все достижения (для показа незаработанных тоже)
        app.MapGet("/achievements/{userId}", async (int userId, AppDbContext db) =>
        {
            var all = await db.Achievements.ToListAsync();
            var earned = await db.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AchievementId)
                .ToListAsync();

            return Results.Ok(all.Select(a => new {
                a.Id, a.Key, a.Title, a.Description, a.Emoji,
                IsEarned = earned.Contains(a.Id)
            }));
        });
    }

    static async Task<List<object>> CheckAchievements(int userId, AppDbContext db)
    {
        var newAchievements = new List<object>();
        var user = await db.Users.FindAsync(userId);
        if (user == null) return newAchievements;

        var earnedIds = await db.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        var completedCount = await db.UserProgress
            .CountAsync(p => p.UserId == userId && p.IsCOmpleted);

        var streak = await db.Streaks.FirstOrDefaultAsync(s => s.UserId == userId);

        var checks = new List<(int id, string key, bool condition)>
        {
            (1, "first_lesson", completedCount >= 1),
            (2, "xp_50", user.TotalXp >= 50),
            (3, "xp_200", user.TotalXp >= 200),
            (4, "xp_500", user.TotalXp >= 500),
            (5, "lessons_5", completedCount >= 5),
            (6, "lessons_10", completedCount >= 10),
            (7, "streak_3", (streak?.CurrentStreak ?? 0) >= 3),
            (8, "streak_7", (streak?.CurrentStreak ?? 0) >= 7),
        };

        foreach (var (id, key, condition) in checks)
        {
            if (condition && !earnedIds.Contains(id))
            {
                var achievement = await db.Achievements.FindAsync(id);
                if (achievement == null) continue;
                db.UserAchievements.Add(new UserAchievement
                {
                    UserId = userId,
                    AchievementId = id,
                    EarnedAt = DateTime.UtcNow
                });
                newAchievements.Add(new { achievement.Key, achievement.Title, achievement.Emoji });
            }
        }

        return newAchievements;
    }
}