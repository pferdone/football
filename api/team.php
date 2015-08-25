<?php
/**
 * Created by PhpStorm.
 * User: pferdone
 * Date: 17.08.15
 * Time: 15:02
 */

// API route
$app->group('/api', function () use ($app, $db) {
    // get all teams
    $app->get('/teams', function () use ($db) {
        $stmt = $db->prepare('select team.id as id, team.name as name, team.league_id as league_id,
                              league.name as league_name from team left join league on team.league_id=league.id
                              group by id');
        if ($stmt->execute()) {
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    });

    // remove team
    $app->delete('/team/:id', function ($id) use ($app, $db) {
        $stmt = $db->prepare('delete from team where id=:id');

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

    // add team
    $app->post('/team', function () use ($app, $db) {
        $req = $app->request();
        $data = json_decode($req->getBody());
        $stmt = $db->prepare('insert into team (id, name, league_id) values (:id, :name, :leagueId)');

        try {
            $result = $stmt->execute([
                'id' => $data->id,
                'name' => $data->name,
                'leagueId' => $data->leagueId
            ]);

            if (!$result) { throw new Exception(); }

            echo json_encode([]);
        } catch (Exception $e) {
            error_log(var_export($stmt->errorInfo(), true));
            $app->halt(400, json_encode($stmt->errorInfo()));
        }
    });

    // get all players of a team
    $app->get('/team/:teamId/players', function ($teamId) use ($app, $db) {
        $stmt = $db->prepare('select * from player where team_id=:teamId');

        $result = $stmt->execute([
            'teamId' => $teamId
        ]);
        if ($result) {
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

    });

    // add/update team stats
    $app->post('/team/:teamId/stats', function ($teamId) use ($app, $db) {
        $stmt = $db->prepare('insert into team_stats (team_id, name, value) values (:teamId, :name, :value)
          on duplicate key update value=values(value)');

        $req = $app->request();
        $data = json_decode($req->getBody());

        try {
            $result = $stmt->execute([
                'teamId' => $data->teamId,
                'name' => $data->name,
                'value' => $data->value
            ]);

            if (!$result) { throw new Exception(); }

            echo json_encode([]);
        } catch(Exception $e) {
            error_log(var_export($stmt->errorInfo(), true));
            $app->halt(400, json_encode($stmt->errorInfo()));
        }
    });
});
