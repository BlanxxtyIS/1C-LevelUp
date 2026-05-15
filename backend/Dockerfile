FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

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

# Устанавливаем OneScript через dotnet SDK
COPY --from=build /usr/share/dotnet /usr/share/dotnet
RUN apt-get update && apt-get install -y wget unzip && \
    wget https://oscript.io/downloads/archive/2_0_0/onescript-linux-x64.zip -O /tmp/oscript.zip && \
    mkdir -p /opt/oscript && \
    unzip /tmp/oscript.zip -d /opt/oscript && \
    find /opt/oscript -name "oscript" -type f -exec chmod +x {} \; && \
    find /opt/oscript -name "oscript" -type f | head -1 | xargs -I{} ln -s {} /usr/local/bin/oscript && \
    rm /tmp/oscript.zip && \
    apt-get clean

ENTRYPOINT ["dotnet", "backend.dll"]