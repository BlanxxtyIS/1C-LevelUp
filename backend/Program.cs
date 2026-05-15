using Backend.Data;
using Backend.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "https://1-c-level-up.vercel.app",
            Environment.GetEnvironmentVariable("FRONTEND_URL") ?? ""
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "5184";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
//Test
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Проставляем роль Student всем у кого пусто
    var usersWithoutRole = await db.Users
        .Where(u => u.Role == null || u.Role == string.Empty)
        .ToListAsync();
    foreach (var u in usersWithoutRole)
        u.Role = "Student";
    if (usersWithoutRole.Any())
        await db.SaveChangesAsync();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "1C LevelUp API работает!");

app.MapLessonEndpoints();
app.MapAdminEndpoints();
app.MapAuthEndpoints();
app.MapCourseEndpoints();
app.MapStreakEndpoints();
app.MapExecuteEndpoints();

app.Run();

