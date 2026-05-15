FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

WORKDIR /app
EXPOSE 8080

RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://github.com/EvilBeaver/OneScript/releases/download/v2.0.1/OneScript-2.0.1-linux-x64.zip -O /tmp/oscript.zip && \
    mkdir -p /opt/oscript && \
    unzip /tmp/oscript.zip -d /opt/oscript && \
    chmod +x /opt/oscript/oscript && \
    ln -s /opt/oscript/oscript /usr/local/bin/oscript && \
    oscript --version

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