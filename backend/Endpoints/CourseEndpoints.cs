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
                .Select(c => new {
                    c.Id, c.Title, c.Description, c.Emoji, c.Color, c.Order,
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
                .Select(ch => new {
                    ch.Id, ch.CourseId, ch.Title, ch.Description, ch.Order,
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
                .Select(t => new {
                    t.Id, t.ChapterId, t.Title, t.Description, t.Order,
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
                .Select(l => new {
                    l.Id, l.Title, l.Description, l.XpReward, l.Order
                })
                .ToListAsync();
            return Results.Ok(lessons);
        });
    }
}