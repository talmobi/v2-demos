#!/bin/bash
php-fpm &
wait-for /tmp/php5-fpm.sock
echo "php-fpm started"
nginx &
wait -n
pkill -P $$
