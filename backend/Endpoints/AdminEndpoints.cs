using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

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
                .Select(l => new {
                    l.Id, l.Title, l.Description, l.XpReward, l.Order, l.Topic,
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
            lesson.Description = req.Description;
            lesson.XpReward = req.XpReward;
            lesson.Order = req.Order;
            lesson.Topic = req.Topic;

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

            var result = questions.Select(q => new {
                q.Id, q.LessonId, q.Text, q.CorrectIndex, q.Explanation,
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

            return Results.Ok(new {
                question.Id, question.LessonId, question.Text,
                question.CorrectIndex, question.Explanation,
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

            return Results.Ok(new {
                question.Id, question.LessonId, question.Text,
                question.CorrectIndex, question.Explanation,
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
    }
}

public record LessonRequest(string Title, string Description, int XpReward, int Order, string Topic);
public record QuestionRequest(string Text, string[] Options, int CorrectIndex, string Explanation);
