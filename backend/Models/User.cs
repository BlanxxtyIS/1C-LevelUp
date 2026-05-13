namespace Backend.Models;

public class User
{
    public int Id {get; set; }
    public string Name {get; set; } = string.Empty;
    public string Email {get; set; } = string.Empty;
    public string PasswordHash {get; set; } = string.Empty;
    public string Role { get; set; } = "Student";
    public int TotalXp {get; set; } = 0;
    public int Level {get; set; } = 1;
    public DateTime CreatedAt {get; set; } = DateTime.UtcNow;
    public string? AvatarUrl { get; set; }
    public bool IsPremium { get; set; } = false;
    public DateTime? PremiumUntil { get; set; }
}