using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Endpoints;

public static class AuthEndpoint
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/auth/register", async (RegisterRequest req, AppDbContext db, IConfiguration config) =>
        {
            // Проверяем что email не занят
            if (await db.Users.AnyAsync(u => u.Email == req.Email))
                return Results.BadRequest(new { error = "Email уже используется" });

            if (await db.Users.AnyAsync(u => u.Name == req.Username))
                return Results.BadRequest(new { error = "Имя пользователя занято" });

            var user = new User
            {
                Name = req.Username,
                Email = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            var token = GenerateToken(user, config);
            return Results.Ok(new { token, user = ToDto(user) });
        });

        app.MapPost("/auth/login", async (LoginRequest req, AppDbContext db, IConfiguration config) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Results.BadRequest(new { error = "Неверный email или пароль" });

            var token = GenerateToken(user, config);
            return Results.Ok(new { token, user = ToDto(user) });
        });

        // Получить текущего пользователя по токену
        app.MapGet("/auth/me", async (HttpContext http, AppDbContext db) =>
        {
            var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Results.Unauthorized();

            var user = await db.Users.FindAsync(int.Parse(userIdClaim));
            if (user == null) return Results.Unauthorized();

            var completedCount = await db.UserProgress
                .CountAsync(p => p.UserId == user.Id && p.IsCOmpleted);

            return Results.Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.TotalXp,
                user.Level,
                user.Role,
                user.AvatarUrl,
                user.IsPremium,
                user.PremiumUntil,
                CompletedLessons = completedCount
            });
        }).RequireAuthorization();
    }

    static string GenerateToken(User user, IConfiguration config)
    {
        var secret = config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role ?? "Student"),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    static object ToDto(User user) => new
    {
        user.Id,
        user.Name,
        user.Email,
        user.TotalXp,
        user.Level,
        user.Role,
        user.AvatarUrl,
        user.IsPremium,
        user.PremiumUntil
    };
}

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
