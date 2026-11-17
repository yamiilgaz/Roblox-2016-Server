# 1. Aşama: .NET SDK kullanarak projeyi derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Bütün proje dosyalarını tek hamlede çalışma dizinine kopyalıyoruz
COPY . .

# Projeyi Release modunda derleyip yayınlıyoruz (Publish)
RUN dotnet publish -c Release -o /app/publish

# 2. Aşama: Çalıştırma (Runtime) Ortamı
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Derlenen çıktıları çalışma ortamına taşıyoruz
COPY --from=build /app/publish .

# Render'ın atadığı dinamik portu ASP.NET Core'a tanıtıyoruz
ENV ASPNETCORE_URLS=http://+:$PORT

# Projenin ana web çıkış DLL dosyasını çalıştırıyoruz
ENTRYPOINT ["dotnet", "Website.dll"]
