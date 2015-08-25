<?php

require 'vendor/autoload.php';
date_default_timezone_set('Europe/Berlin');

header('Content-Type: text/html; charset=utf-8');

$app = new \Slim\Slim();

$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader);

$db = new PDO('mysql:host=localhost;dbname=football', 'root', 'root',
    [PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8']);

// API route
require 'api/league.php';
require 'api/team.php';

// ROUTES
require 'routes.php';

$app->run();