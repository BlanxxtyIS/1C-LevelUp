using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Endpoints;

public static class CourseEndpoints
{
    public static void MapCourseEndpoints(this WebApplication app)
    {
        // Все курсы
        app.MapGet("/courses", async (AppDbContext db) =>
        {
            var courses = await db.Courses
                .OrderBy(c => c.Order)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Emoji,
                    c.Color,
                    c.Order,
                    ChapterCount = db.Chapters.Count(ch => ch.CourseId == c.Id)
                })
                .ToListAsync();
            return Results.Ok(courses);
        });

        // Главы курса
        app.MapGet("/courses/{courseId}/chapters", async (int courseId, AppDbContext db) =>
        {
            var chapters = await db.Chapters
                .Where(ch => ch.CourseId == courseId)
                .OrderBy(ch => ch.Order)
                .Select(ch => new
                {
                    ch.Id,
                    ch.CourseId,
                    ch.Title,
                    ch.Description,
                    ch.Order,
                    TopicCount = db.Topics.Count(t => t.ChapterId == ch.Id)
                })
                .ToListAsync();
            return Results.Ok(chapters);
        });

        // Темы главы
        app.MapGet("/chapters/{chapterId}/topics", async (int chapterId, AppDbContext db) =>
        {
            var topics = await db.Topics
                .Where(t => t.ChapterId == chapterId)
                .OrderBy(t => t.Order)
                .Select(t => new
                {
                    t.Id,
                    t.ChapterId,
                    t.Title,
                    t.Description,
                    t.Order,
                    LessonCount = db.Lessons.Count(l => l.TopicId == t.Id)
                })
                .ToListAsync();
            return Results.Ok(topics);
        });

        // Уроки темы
        app.MapGet("/topics/{topicId}/lessons", async (int topicId, AppDbContext db) =>
        {
            var lessons = await db.Lessons
                .Where(l => l.TopicId == topicId)
                .OrderBy(l => l.Order)
                .Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.Description,
                    l.XpReward,
                    l.Order,
                    l.Content,
                    l.DurationMinutes
                })
                .ToListAsync();
            return Results.Ok(lessons);
        });

        // Прогресс пользователя по темам главы
        app.MapGet("/chapters/{chapterId}/progress/{userId}", async (int chapterId, int userId, AppDbContext db) =>
        {
            var topics = await db.Topics
                .Where(t => t.ChapterId == chapterId)
                .ToListAsync();

            var result = new List<object>();

            foreach (var topic in topics)
            {
                var totalLessons = await db.Lessons.CountAsync(l => l.TopicId == topic.Id);
                var completedLessons = await db.UserProgress
                    .CountAsync(p => p.UserId == userId && p.IsCOmpleted &&
                        db.Lessons.Any(l => l.Id == p.LessonId && l.TopicId == topic.Id));

                result.Add(new
                {
                    TopicId = topic.Id,
                    TotalLessons = totalLessons,
                    CompletedLessons = completedLessons,
                    IsCompleted = totalLessons > 0 && completedLessons >= totalLessons
                });
            }

            return Results.Ok(result);
        });

        // Прогресс пользователя по главам курса
        app.MapGet("/courses/{courseId}/progress/{userId}", async (int courseId, int userId, AppDbContext db) =>
        {
            var chapters = await db.Chapters
                .Where(ch => ch.CourseId == courseId)
                .ToListAsync();

            var result = new List<object>();

            foreach (var chapter in chapters)
            {
                var totalTopics = await db.Topics.CountAsync(t => t.ChapterId == chapter.Id);
                var completedTopics = 0;

                var topics = await db.Topics.Where(t => t.ChapterId == chapter.Id).ToListAsync();
                foreach (var topic in topics)
                {
                    var totalLessons = await db.Lessons.CountAsync(l => l.TopicId == topic.Id);
                    if (totalLessons == 0) continue;
                    var completedLessons = await db.UserProgress
                        .CountAsync(p => p.UserId == userId && p.IsCOmpleted &&
                            db.Lessons.Any(l => l.Id == p.LessonId && l.TopicId == topic.Id));
                    if (completedLessons >= totalLessons) completedTopics++;
                }

                result.Add(new
                {
                    ChapterId = chapter.Id,
                    TotalTopics = totalTopics,
                    CompletedTopics = completedTopics,
                    IsCompleted = totalTopics > 0 && completedTopics >= totalTopics
                });
            }

            return Results.Ok(result);
        });
    }
}