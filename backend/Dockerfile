FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Устанавливаем OneScript
RUN apt-get update && apt-get install -y \
    wget \
    dpkg \
    && wget https://github.com/EvilBeaver/OneScript/releases/download/v2.0.2/onescript-engine_2.0.2_amd64.deb \
    && dpkg -i onescript-engine_2.0.2_amd64.deb \
    && rm onescript-engine_2.0.2_amd64.deb \
    && apt-get clean

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]