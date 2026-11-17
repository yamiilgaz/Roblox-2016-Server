# 1. Aşama: .NET SDK kullanarak projeyi derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet publish Website/ -c Release -o /app/publish

# 2. Aşama: Çalıştırma (Runtime) Ortamı
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Exit Code 139'u çözmek için gereken temel Linux grafik ve C kütüphanelerini yüklüyoruz
RUN apt-get update && apt-get install -y libgdiplus libc6-dev libsqlite3-0 fontconfig

WORKDIR /app
EXPOSE 80

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:$PORT

# Uygulamayı başlatıyoruz
ENTRYPOINT ["dotnet", "RobloxWebserver.dll"]
