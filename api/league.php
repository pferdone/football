<?php
/**
 * Created by PhpStorm.
 * User: pferdone
 * Date: 17.08.15
 * Time: 15:02
 */

// API route
$app->group('/api', function () use ($app, $db) {
    // get all leagues
    $app->get('/leagues', function () use ($db) {
        $stmt = $db->prepare('SELECT * from league group by id');
        if ($stmt->execute()) {
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    });

    // add league
    $app->post('/league', function () use ($app, $db) {
        $req = $app->request();
        $data = json_decode($req->getBody());
        $stmt = $db->prepare('insert into league (id, name) values (:id, :name)');

        try {
            $result = $stmt->execute([
                'id' => $data->id,
                'name' => $data->name
            ]);

            if (!$result) { throw new Exception(); }

            echo json_encode([]);
        } catch (Exception $e) {
            error_log(var_export($stmt->errorInfo(), true));
            $app->halt(400, json_encode($stmt->errorInfo()));
        }
    });

    // remove league
    $app->delete('/league/:id', function ($id) use ($app, $db) {
        $stmt = $db->prepare('delete from league where id=:id');

        try {
            $result = $stmt->execute([
                'id' => $id
            ]);

            if (!$result) { throw new Exception(); }

            echo json_encode([]);
        } catch(Exception $e) {
            error_log(var_export($stmt->errorInfo(), true));
            $app->halt(400, json_encode($stmt->errorInfo()));
        }
    });

    // get teams from league
    $app->get('/league/:id/teams', function ($id) use ($db) {
        $stmt = $db->prepare('select * from teams where league_id=:id');
        if ($stmt->execute()) {
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    });
});
