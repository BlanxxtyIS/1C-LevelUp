using System.Diagnostics;
using System.Text;

namespace Backend.Endpoints;

//Компилятор
public static class ExecuteEndpoints
{
    public static void MapExecuteEndpoints(this WebApplication app)
    {
        app.MapPost("/execute", async (ExecuteRequest req) =>
        {
            if (string.IsNullOrWhiteSpace(req.Code))
                return Results.BadRequest(new { error = "Код не может быть пустым" });

            // Базовая защита
            if (req.Code.Length > 5000)
                return Results.BadRequest(new { error = "Код слишком длинный (макс. 5000 символов)" });

            var forbidden = new[] { "УдалитьФайлы", "НачатьПроцесс", "Команда", "ЗапуститьПриложение" };
            foreach (var word in forbidden)
            {
                if (req.Code.Contains(word, StringComparison.OrdinalIgnoreCase))
                    return Results.BadRequest(new { error = $"Использование '{word}' запрещено" });
            }
            var isWindows = Environment.OSVersion.Platform == PlatformID.Win32NT;
            var oscriptPath = isWindows
                    ? @"C:\Users\Zver\AppData\Local\ovm\current\bin\oscript.exe"
                    : "oscript";

            // Создаём временный файл
            var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.os");

            try
            {
                await File.WriteAllTextAsync(tempFile, req.Code, Encoding.UTF8);

                var psi = new ProcessStartInfo
                {
                    FileName = oscriptPath,
                    Arguments = tempFile,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    StandardOutputEncoding = isWindows ? Encoding.GetEncoding(866) : Encoding.UTF8,
                    StandardErrorEncoding = isWindows ? Encoding.GetEncoding(866) : Encoding.UTF8
                };

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                using var process = Process.Start(psi);

                if (process == null)
                    return Results.Ok(new { success = false, output = "Не удалось запустить OneScript" });

                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();

                await process.WaitForExitAsync(cts.Token);

                if (!string.IsNullOrEmpty(error))
                    return Results.Ok(new { success = false, output = error });

                return Results.Ok(new { success = true, output });
            }
            catch (OperationCanceledException)
            {
                return Results.Ok(new { success = false, output = "Превышено время выполнения (10 сек)" });
            }
            catch (Exception ex)
            {
                return Results.Ok(new { success = false, output = "Ошибка запуска: " + ex.Message });
            }
            finally
            {
                if (File.Exists(tempFile))
                    File.Delete(tempFile);
            }
        });
    }
}

public record ExecuteRequest(string Code);