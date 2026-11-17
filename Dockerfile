# 1. Aşama: .NET SDK kullanarak projeyi derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Bütün proje dosyalarını çalışma dizinine kopyalıyoruz
COPY . .

# DİKKAT: Sadece "Website" klasörünü derliyoruz. Control Panel'i tamamen es geçiyoruz!
RUN dotnet publish Website/ -c Release -o /app/publish

# 2. Aşama: Çalıştırma (Runtime) Ortamı
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Derlenen web çıktılarını çalışma ortamına taşıyoruz
COPY --from=build /app/publish .

# Render'ın atadığı dinamik portu ASP.NET Core'a tanıtıyoruz
ENV ASPNETCORE_URLS=http://+:$PORT

# Loglarda gördüğümüz doğru DLL adıyla sunucuyu başlatıyoruz
ENTRYPOINT ["dotnet", "RobloxWebserver.dll"]
