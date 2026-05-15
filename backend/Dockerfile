FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

WORKDIR /app
EXPOSE 8080

RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget https://oscript.io/downloads/linux/deb/public.key -O - | apt-key add - && \
    echo "deb https://download.opensuse.org/repositories/home:/EvilBeaver:/oscript/Debian_12/ /" > /etc/apt/sources.list.d/oscript.list && \
    apt-get update && \
    apt-get install -y onescript && \
    apt-get clean

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