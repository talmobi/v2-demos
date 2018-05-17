<?php
define('DB_HOST', getenv('DB_HOST'));
define('DB_NAME', getenv('DB_NAME'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

$table_prefix  = 'wp_';

define('AUTH_KEY', getenv('SECRET_AUTH_KEY'));
define('SECURE_AUTH_KEY', getenv('SECRET_SECURE_AUTH_KEY'));
define('LOGGED_IN_KEY', getenv('SECRET_LOGGED_IN_KEY'));
define('NONCE_KEY', getenv('SECRET_NONCE_KEY'));
define('AUTH_SALT', getenv('SECRET_AUTH_SALT'));
define('SECURE_AUTH_SALT', getenv('SECRET_SECURE_AUTH_SALT'));
define('LOGGED_IN_SALT', getenv('SECRET_LOGGED_IN_SALT'));
define('NONCE_SALT', getenv('SECRET_NONCE_SALT'));

$protocol = 'http';
if( isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' ) {
  $_SERVER['HTTPS']='on';
  $protocol = 'https';
}

define('WP_SITEURL', $protocol . '://' . $_SERVER['HTTP_HOST']);
define('WP_HOME', $protocol . '://' . $_SERVER['HTTP_HOST']);

if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

require_once(ABSPATH . 'email-settings.php');
require_once(ABSPATH . 'wp-settings.php');
