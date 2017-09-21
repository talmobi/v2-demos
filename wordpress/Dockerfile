FROM php:7-fpm-alpine
RUN apk add --no-cache curl nginx mysql
RUN curl -s --fail https://wordpress.org/latest.zip -o /var/www/latest.zip && \
  curl -s --fail https://downloads.wordpress.org/plugin/sendgrid-email-delivery-simplified.zip -o /var/www/sendgrid.zip && \
  cd /var/www && \
  unzip latest.zip && \
  unzip sendgrid.zip && \
  rm -rf *.zip && \
  mkdir wordpress/wp-content/mu-plugins && \
  mv sendgrid-email-delivery-simplified wordpress/wp-content/plugins && \
  rm -rf blog/wp-content && \
  docker-php-ext-install mysqli && \
  rm -rf /usr/bin/my*

# copy things that normally should not be mutated
COPY src/nginx.conf /etc/nginx
COPY src/run.sh .
COPY src/email-settings.php src/wp-config.php /var/www/wordpress/

# copy user config
COPY wp-content /var/www/wordpress

EXPOSE 3000
CMD ["./run.sh"]
