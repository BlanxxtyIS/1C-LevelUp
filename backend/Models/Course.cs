namespace Backend.Models;

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Emoji { get; set; } = "📚";
    public string Color { get; set; } = "#7c3aed";
    public int Order { get; set; }
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
}

public class Chapter
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public Course Course { get; set; } = null!;
    public ICollection<Topic> Topics { get; set; } = new List<Topic>();
}

public class Topic
{
    public int Id { get; set; }
    public int ChapterId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public Chapter Chapter { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}