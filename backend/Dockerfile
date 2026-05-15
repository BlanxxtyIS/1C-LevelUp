FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

WORKDIR /app
EXPOSE 8080

RUN apt-get update && \
    apt-get install -y wget tar && \
    wget https://github.com/EvilBeaver/OneScript/releases/download/v2.0.0/onescript-linux-x64.tar.gz -O /tmp/onescript.tar.gz && \
    mkdir -p /opt/onescript && \
    tar -xzf /tmp/onescript.tar.gz -C /opt/onescript && \
    chmod +x /opt/onescript/oscript && \
    ln -s /opt/onescript/oscript /usr/local/bin/oscript && \
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