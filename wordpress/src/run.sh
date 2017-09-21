#!/usr/bin/env sh
_term()
{
  kill -TERM "$child" 2> /dev/null
}
php-fpm &
trap _term SIGTERM
nginx
