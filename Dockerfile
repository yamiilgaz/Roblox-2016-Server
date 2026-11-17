# 1. Aşama: .NET SDK kullanarak projeyi derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Çözüm ve proje dosyalarını kopyalayıp bağımlılıkları yüklüyoruz
COPY *.sln ./
COPY *.csproj ./ 2>/dev/null || :
RUN dotnet restore

# Tüm kaynak kodunu kopyalayıp Release modunda derliyoruz
COPY . .
RUN dotnet publish -c Release -o /app/publish

# 2. Aşama: Çalıştırma (Runtime) Ortamı
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Derlenen dosyaları çalışma ortamına taşıyoruz
COPY --from=build /app/publish .

# Render'ın atadığı dinamik portu ASP.NET Core'a tanıtıyoruz
ENV ASPNETCORE_URLS=http://+:$PORT

# Projenin ana derleme çıktı dosyasını çalıştırıyoruz
ENTRYPOINT ["dotnet", "Website.dll"]
 
