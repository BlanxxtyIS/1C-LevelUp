using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var admin = app.MapGroup("/admin");

        admin.MapGet("/lessons", async (AppDbContext db) =>
       {
           var lessons = await db.Lessons
               .OrderBy(l => l.Order)
               .Select(l => new
               {
                   l.Id,
                   l.Title,
                   l.Description,
                   l.XpReward,
                   l.Order,
                   l.Topic,
                   QuestionCount = db.Questions.Count(q => q.LessonId == l.Id)
               })
               .ToListAsync();
           return Results.Ok(lessons);
       });

        admin.MapPost("/lessons", async (LessonRequest req, AppDbContext db) =>
        {
            var lesson = new Lesson
            {
                Title = req.Title,
                Description = req.Description,
                XpReward = req.XpReward,
                Order = req.Order,
                Topic = req.Topic
            };
            db.Lessons.Add(lesson);
            await db.SaveChangesAsync();
            return Results.Ok(lesson);
        });

        admin.MapPut("/lessons/{id}", async (int id, LessonRequest req, AppDbContext db) =>
        {
            var lesson = await db.Lessons.FindAsync(id);
            if (lesson == null) return Results.NotFound();
            lesson.Title = req.Title;
            lesson.Description = req.Description ?? string.Empty;
            lesson.XpReward = req.XpReward;
            lesson.Order = req.Order;
            lesson.Topic = req.Topic ?? string.Empty;
            lesson.Content = req.Content ?? string.Empty;
            await db.SaveChangesAsync();
            return Results.Ok(lesson);
        });

        admin.MapDelete("/lessons/{id}", async (int id, AppDbContext db) =>
        {
            var lesson = await db.Lessons.FindAsync(id);
            if (lesson == null) return Results.NotFound();

            // Удаляем связанные вопросы и прогресс
            var questions = db.Questions.Where(q => q.LessonId == id);
            var progress = db.UserProgress.Where(p => p.LessonId == id);
            db.Questions.RemoveRange(questions);
            db.UserProgress.RemoveRange(progress);
            db.Lessons.Remove(lesson);

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ── Вопросы ────────────────────────────────────────

        admin.MapGet("/lessons/{lessonId}/questions", async (int lessonId, AppDbContext db) =>
        {
            var questions = await db.Questions
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();

            var result = questions.Select(q => new
            {
                q.Id,
                q.LessonId,
                q.Text,
                q.CorrectIndex,
                q.Explanation,
                Options = System.Text.Json.JsonSerializer.Deserialize<string[]>(q.OptionsJson)
            });

            return Results.Ok(result);
        });

        admin.MapPost("/lessons/{lessonId}/questions", async (int lessonId, QuestionRequest req, AppDbContext db) =>
        {
            var question = new Question
            {
                LessonId = lessonId,
                Text = req.Text,
                OptionsJson = System.Text.Json.JsonSerializer.Serialize(req.Options),
                CorrectIndex = req.CorrectIndex,
                Explanation = req.Explanation
            };
            db.Questions.Add(question);
            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                question.Id,
                question.LessonId,
                question.Text,
                question.CorrectIndex,
                question.Explanation,
                Options = req.Options
            });
        });

        admin.MapPut("/questions/{id}", async (int id, QuestionRequest req, AppDbContext db) =>
        {
            var question = await db.Questions.FindAsync(id);
            if (question == null) return Results.NotFound();

            question.Text = req.Text;
            question.OptionsJson = System.Text.Json.JsonSerializer.Serialize(req.Options);
            question.CorrectIndex = req.CorrectIndex;
            question.Explanation = req.Explanation;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                question.Id,
                question.LessonId,
                question.Text,
                question.CorrectIndex,
                question.Explanation,
                Options = req.Options
            });
        });

        admin.MapDelete("/questions/{id}", async (int id, AppDbContext db) =>
        {
            var question = await db.Questions.FindAsync(id);
            if (question == null) return Results.NotFound();

            db.Questions.Remove(question);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ── Курсы ──────────────────────────────────────────

        admin.MapGet("/courses", async (AppDbContext db) =>
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

        admin.MapPost("/courses", async (CourseRequest req, AppDbContext db) =>
        {
            var course = new Course
            {
                Title = req.Title,
                Description = req.Description,
                Emoji = req.Emoji,
                Color = req.Color,
                Order = req.Order
            };
            db.Courses.Add(course);
            await db.SaveChangesAsync();
            return Results.Ok(course);
        });

        admin.MapPut("/courses/{id}", async (int id, CourseRequest req, AppDbContext db) =>
        {
            var course = await db.Courses.FindAsync(id);
            if (course == null) return Results.NotFound();
            course.Title = req.Title; course.Description = req.Description;
            course.Emoji = req.Emoji; course.Color = req.Color; course.Order = req.Order;
            await db.SaveChangesAsync();
            return Results.Ok(course);
        });

        admin.MapDelete("/courses/{id}", async (int id, AppDbContext db) =>
        {
            var course = await db.Courses.FindAsync(id);
            if (course == null) return Results.NotFound();
            db.Courses.Remove(course);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ── Главы ──────────────────────────────────────────

        admin.MapGet("/courses/{courseId}/chapters", async (int courseId, AppDbContext db) =>
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

        admin.MapPost("/courses/{courseId}/chapters", async (int courseId, ChapterRequest req, AppDbContext db) =>
        {
            var chapter = new Chapter
            {
                CourseId = courseId,
                Title = req.Title,
                Description = req.Description,
                Order = req.Order
            };
            db.Chapters.Add(chapter);
            await db.SaveChangesAsync();
            return Results.Ok(chapter);
        });

        admin.MapPut("/chapters/{id}", async (int id, ChapterRequest req, AppDbContext db) =>
        {
            var chapter = await db.Chapters.FindAsync(id);
            if (chapter == null) return Results.NotFound();
            chapter.Title = req.Title; chapter.Description = req.Description; chapter.Order = req.Order;
            await db.SaveChangesAsync();
            return Results.Ok(chapter);
        });

        admin.MapDelete("/chapters/{id}", async (int id, AppDbContext db) =>
        {
            var chapter = await db.Chapters.FindAsync(id);
            if (chapter == null) return Results.NotFound();
            db.Chapters.Remove(chapter);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ── Темы ──────────────────────────────────────────

        admin.MapGet("/chapters/{chapterId}/topics", async (int chapterId, AppDbContext db) =>
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

        admin.MapPost("/chapters/{chapterId}/topics", async (int chapterId, TopicRequest req, AppDbContext db) =>
        {
            var topic = new Topic
            {
                ChapterId = chapterId,
                Title = req.Title,
                Description = req.Description,
                Order = req.Order
            };
            db.Topics.Add(topic);
            await db.SaveChangesAsync();
            return Results.Ok(topic);
        });

        admin.MapPut("/topics/{id}", async (int id, TopicRequest req, AppDbContext db) =>
        {
            var topic = await db.Topics.FindAsync(id);
            if (topic == null) return Results.NotFound();
            topic.Title = req.Title; topic.Description = req.Description; topic.Order = req.Order;
            await db.SaveChangesAsync();
            return Results.Ok(topic);
        });

        admin.MapDelete("/topics/{id}", async (int id, AppDbContext db) =>
        {
            var topic = await db.Topics.FindAsync(id);
            if (topic == null) return Results.NotFound();
            db.Topics.Remove(topic);
            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // ── Уроки темы ──────────────────────────────────────────

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
                    l.Content
                })
                .ToListAsync();
            return Results.Ok(lessons);
        });

        admin.MapPost("/topics/{topicId}/lessons", async (int topicId, TopicLessonRequest req, AppDbContext db) =>
        {
            var lesson = new Lesson
            {
                Title = req.Title,
                Description = req.Description,
                XpReward = req.XpReward,
                Order = req.Order,
                Content = req.Content,
                Topic = string.Empty,
                TopicId = topicId
            };
            db.Lessons.Add(lesson);
            await db.SaveChangesAsync();
            return Results.Ok(lesson);
        });

        // admin.MapDelete("/lessons/{id}", async (int id, AppDbContext db) =>
        // {
        //     var lesson = await db.Lessons.FindAsync(id);
        //     if (lesson == null) return Results.NotFound();
        //     var questions = db.Questions.Where(q => q.LessonId == id);
        //     db.Questions.RemoveRange(questions);
        //     db.Lessons.Remove(lesson);
        //     await db.SaveChangesAsync();
        //     return Results.Ok();
        // });
    }
}


public record LessonRequest(string Title, string Description, int XpReward, int Order, string Topic, string? Content = null);
public record QuestionRequest(string Text, string[] Options, int CorrectIndex, string Explanation);
public record CourseRequest(string Title, string Description, string Emoji, string Color, int Order);
public record ChapterRequest(string Title, string Description, int Order);
public record TopicRequest(string Title, string Description, int Order);
public record TopicLessonRequest(string Title, string Description, int XpReward, int Order, string Content);
