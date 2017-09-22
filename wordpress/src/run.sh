#!/usr/bin/env sh
_term()
{
  kill -TERM "$child" 2> /dev/null
}

cat <<EOF >> /var/www/wordpress/wp-content/themes/twentyseventeen/functions.php
add_filter('option_blogdescription', 'custom_option_description', 10, 1);
function custom_option_description($value) {
  return 'Just another WordPress site. Host id: `cat /proc/sys/kernel/random/uuid`';
}
EOF

php-fpm &
trap _term SIGTERM
nginx
