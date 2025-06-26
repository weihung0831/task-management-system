FROM php:8.4-fpm

# 設定工作目錄
WORKDIR /var/www

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# 清理快取
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 安裝 PHP 擴展
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 安裝 Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 複製應用程式檔案
COPY . /var/www

# 設定權限
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www/storage
RUN chmod -R 755 /var/www/bootstrap/cache

# 安裝 PHP 依賴
RUN composer install --optimize-autoloader --no-dev

# 暴露端口
EXPOSE 9000

CMD ["php-fpm"]