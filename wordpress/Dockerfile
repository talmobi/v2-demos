FROM zeit/wait-for:0.2 as wait

FROM php:7-fpm-alpine
COPY --from=wait /bin/wait-for /bin/wait-for
RUN apk add --no-cache curl nginx mysql bash
RUN curl -s --fail https://wordpress.org/latest.zip -o /var/www/latest.zip && \
  curl -s --fail https://downloads.wordpress.org/plugin/sendgrid-email-delivery-simplified.zip -o /var/www/sendgrid.zip && \
  cd /var/www && \
  unzip -q latest.zip && \
  unzip -q sendgrid.zip && \
  rm -rf *.zip && \
  mv sendgrid-email-delivery-simplified wordpress/wp-content/plugins && \
  docker-php-ext-install mysqli && \
  rm -rf /usr/bin/my* /usr/bin/maria* /usr/bin/aria* /usr/src/*

# copy things that normally should not be mutated
COPY src/php-fpm.conf /usr/local/etc
COPY src/nginx.conf /etc/nginx
COPY src/run.sh .
COPY src/email-settings.php src/wp-config.php /var/www/wordpress/

# copy user config
COPY wp-content /var/www/wordpress/wp-content
CMD ["./run.sh"]
