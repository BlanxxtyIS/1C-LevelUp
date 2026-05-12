namespace Backend.Models;

public class Streak
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CurrentStreak { get; set; } = 0;
    public int MaxStreak { get; set; } = 0;
    public DateTime LastActivityDate { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}