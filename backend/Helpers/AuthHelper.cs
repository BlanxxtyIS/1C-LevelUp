using System.Security.Claims;

namespace Backend.Helpers;

public static class AuthHelper
{
    public static bool IsAdmin(HttpContext ctx) =>
        ctx.User.FindFirst(ClaimTypes.Role)?.Value == "Admin";

    public static bool IsTeacherOrAdmin(HttpContext ctx) =>
        ctx.User.FindFirst(ClaimTypes.Role)?.Value is "Admin" or "Teacher";

    public static IResult? RequireAdmin(HttpContext ctx) =>
        IsAdmin(ctx) ? null : Results.Json(new { error = "Доступ запрещён" }, statusCode: 403);

    public static IResult? RequireTeacherOrAdmin(HttpContext ctx) =>
        IsTeacherOrAdmin(ctx) ? null : Results.Json(new { error = "Доступ запрещён" }, statusCode: 403);
}