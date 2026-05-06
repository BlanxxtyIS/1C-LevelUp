namespace Backend.Models;
using Backend.Models;

public class UserProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int LessonId {get; set;}
    public bool IsCOmpleted {get; set;}
    public int XpEarned {get; set; }
    public DateTime CompletedAt {get; set;} = DateTime.UtcNow;
    public User User {get; set;} = null!;
    public Lesson Lesson {get; set;} = null!;
}