<?php
/**
 * Created by PhpStorm.
 * User: pferdone
 * Date: 19.08.15
 * Time: 19:33
 */

// index
$app->get('/', function () use ($twig) {
    echo '';
});

// leagues
$app->get('/leagues', function () use ($twig) {
    echo $twig->render('leagues.html');
});

$app->get('/teams', function () use ($twig) {
    echo $twig->render('teams.html');
});

$app->get('/parse', function () use ($twig) {
    echo $twig->render('parse.html');
});