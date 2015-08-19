<?php

require 'vendor/autoload.php';
date_default_timezone_set('Europe/Berlin');

$app = new \Slim\Slim();

$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader);

$db = new PDO('mysql:host=localhost;dbname=football', 'root', 'root');

// API route
require 'api/league.php';

// TWIG
$app->get('/', function () use ($twig) {
    echo $twig->render('index.html');
});

$app->run();