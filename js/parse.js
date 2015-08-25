/**
 * Created by pferdone on 22.08.15.
 */

var Parse = React.createClass({
    componentDidMount: function () {
        var that=this;
        $.getJSON('http://omo.akamai.opta.net/team_competition.php?feed_type=f30&competition=22&season_id=2015&team_id=164&user=owv2&psw=wacRUs5U&jsoncallback=?',
            function (result) {

                var team=result.SeasonStatistics.Team;
                var teamId=team['@attributes'].id;
                var player=team.Player;
                var teamStat=team.Stat;

                var teamStats=[];
                teamStat.map(function(d) {
                    teamStats.push({name:d['@attributes'].name, value:d['@value']});
                });
                //console.debug(teamStats);
                that.setState({teamId:teamId, teamStats:teamStats});
            }
        );

    },
    getInitialState: function () {
        return {teamStats:[]};
    },
    render: function () {
        console.debug(this.state.teamStats);
        var that=this;
        var rows=this.state.teamStats.map(function(obj) {
            return (<div>insert into team_stats (team_id, name, value) values ({that.state.teamId}, '{obj.name}', {obj.value});</div>);
        });
        return (<div>{rows}</div>);
    }
});

React.render(
    <Parse />,
    document.getElementById('content')
);