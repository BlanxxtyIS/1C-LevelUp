using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionsForAllLessons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "1С:Предприятие — это платформа для разработки и запуска бизнес-приложений (конфигураций).", 1, "[\"Язык программирования\",\"Платформа для создания бизнес-приложений\",\"База данных\",\"Операционная система\"]", "Что такое 1С:Предприятие?" });

            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "Конфигуратор — это встроенная среда разработки платформы 1С:Предприятие.", 1, "[\"Visual Studio\",\"Конфигуратор\",\"Среда разработки\",\"IDE 1С\"]", "Как называется программа для разработки в 1С?" });

            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "Конфигурация — это прикладное решение (программа) созданное на платформе 1С. Например: 1С:Бухгалтерия, 1С:ЗУП.", 1, "[\"Настройки операционной системы\",\"Прикладное решение созданное на платформе 1С\",\"База данных пользователей\",\"Файл настроек\"]", "Что такое конфигурация в 1С?" });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "CorrectIndex", "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[,]
                {
                    { 4, 1, "Режим предприятия — это пользовательский режим работы, где ведётся реальная работа с данными.", 2, "[\"Конфигуратор\",\"Режим предприятия\",\"Режим отладки\",\"Административный режим\"]", "В каком режиме работают обычные пользователи 1С?" },
                    { 5, 1, "Конфигуратор — среда разработки где создаются справочники, документы, отчёты и другие объекты.", 2, "[\"В режиме предприятия\",\"В конфигураторе\",\"В консоли запросов\",\"В браузере\"]", "Где разработчик создаёт объекты конфигурации?" },
                    { 6, 1, "Дерево конфигурации — панель в конфигураторе где отображаются все объекты: справочники, документы, регистры и т.д.", 2, "[\"Структура базы данных\",\"Дерево конфигурации\",\"Список объектов\",\"Иерархия классов\"]", "Как называется дерево объектов конфигурации в конфигураторе?" },
                    { 7, 1, "Справочник хранит условно-постоянные данные — товары, контрагентов, сотрудников.", 3, "[\"Документ для записи операций\",\"Объект для хранения условно-постоянной информации\",\"Отчёт для вывода данных\",\"Регистр для накопления данных\"]", "Что такое Справочник в 1С?" },
                    { 8, 1, "Каждый справочник автоматически имеет реквизиты Код и Наименование.", 3, "[\"Дата\",\"Код и Наименование\",\"Сумма\",\"Количество\"]", "Какой реквизит есть у каждого Справочника по умолчанию?" },
                    { 9, 1, "В иерархических справочниках элементы группируются в Папки (группы).", 3, "[\"Документ\",\"Папка (группа)\",\"Регистр\",\"Константа\"]", "Как называется элемент справочника верхнего уровня при иерархии?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "Справочник хранит условно-постоянные данные — товары, контрагентов, сотрудников.", 3, "[\"Документ для записи операций\",\"Объект для хранения условно-постоянной информации\",\"Отчёт для вывода данных\",\"Регистр для накопления данных\"]", "Что такое Справочник в 1С?" });

            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "Каждый справочник автоматически имеет реквизиты Код и Наименование.", 3, "[\"Дата\",\"Код и Наименование\",\"Сумма\",\"Количество\"]", "Какой реквизит есть у каждого Справочника по умолчанию?" });

            migrationBuilder.UpdateData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Explanation", "LessonId", "OptionsJson", "Text" },
                values: new object[] { "В иерархических справочниках элементы группируются в Папки (группы).", 3, "[\"Документ\",\"Папка (группа)\",\"Регистр\",\"Константа\"]", "Как называется элемент справочника верхнего уровня при иерархии?" });
        }
    }
}
