<?php
/**
 * Created by PhpStorm.
 * User: pferdone
 * Date: 24.08.15
 * Time: 15:43
 */

$FEED_F30 = 'http://omo.akamai.opta.net/team_competition.php?feed_type=f30&competition=[CO]&season_id=[SE]&team_id=[TE]&user=[US]&psw=[PA]&jsoncallback=';

$requestUrl = str_replace(['[CO]', '[SE]', '[TE]','[US]', '[PA]'],
    ['22', '2015', '156', 'owv2', 'wacRUs5U'], $FEED_F30);

$json = json_decode(file_get_contents($requestUrl));
$team = $json->SeasonStatistics->Team;
$team_id = $team->{'@attributes'}->id;
$team_stat = $team->Stat;

$team_stats=$array_map(function ($data) {
    echo $data;
    return json_encode(['name' => $data->{'@attributes'}->name, 'value' => $data->{'@value'}]);
}, $team_stat);

echo "<pre>";
var_dump($team_stat);
echo "</pre>";



/*var team=result.SeasonStatistics.Team;
var teamId=team['@attributes'].id;
                var player=team.Player;
                var teamStat=team.Stat;*/

//&jsoncallback=?