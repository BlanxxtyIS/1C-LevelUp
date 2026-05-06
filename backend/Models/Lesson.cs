namespace Backend.Models;

public class Lesson
{
    public int Id {get; set;}
    public string Title {get; set; } = string.Empty;
    public string Description {get; set;} = string.Empty;
    public int XpReward {get; set; }
    public int Order {get; set; }
    public string Topic {get; set; } = string.Empty;
    public ICollection<Question> Questions {get; set;} = new List<Question>();
}

public class Question
{
    public int Id {get; set;}
    public int LessonId {get; set;}
    public string Text {get; set;} = string.Empty;
    public string OptionsJson {get; set;} = string.Empty;
    public int CorrectIndex {get; set;}
    public string Explanation {get; set;} = string.Empty;
    public Lesson Lesson {get; set;} = null!;
}