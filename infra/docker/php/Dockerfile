FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git curl unzip libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# (Optional) copy composer files for build layer, then install (commented out because we mount volume in dev)
# COPY apps/backend/composer.json apps/backend/composer.lock ./
# RUN composer install --no-interaction --prefer-dist --no-scripts --no-progress

# Expose FPM port
EXPOSE 9000

CMD ["php-fpm"]
