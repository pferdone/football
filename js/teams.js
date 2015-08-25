/**
 * Created by pferdone on 14.08.15.
 */


/**
 * Renders the league table.
 */
var Teams = React.createClass({
    getInitialState: function () {
        return {leagues:[], teams:[]};
    },
    getLeagues: function () {
        var that=this;
        $.ajax({
            type: "GET",
            url: this.props.source + '/leagues',
            success: function (data) {
                that.setState({leagues:JSON.parse(data)});
            }
        });
    },
    getTeams: function () {
        var that=this;
        $.ajax({
            type: "GET",
            url: this.props.source + '/teams',
            success: function (data) {
                that.setState({teams:JSON.parse(data)});
            }
        });
    },
    componentDidMount: function () {
        this.getLeagues();
        this.getTeams();
    },
    render: function () {
        var that=this;
        var createTeam = function (data) {
            return (<TeamEntry source={that.props.source} refreshCallback={that.getTeams}
                                 id={data.id} name={data.name} league={data.league_name}/>);
        };
        var rows = this.state.teams.map(createTeam);
        rows.push(React.createElement(TeamAdd, {source:this.props.source,
            refreshCallback:this.getTeams, leagues:this.state.leagues}));

        return (
            <div>
                <table className="table table-striped">
                    <thead><tr><th>id</th><th>name</th><th>league</th><th>function</th></tr></thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
});

var TeamEntry = React.createClass({
    handleClick: function() {
        var that=this;
        $.ajax({
            type: "DELETE",
            url: this.props.source + "/team/" + this.props.id,
            success: function() { that.props.refreshCallback(); }
        });
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
                <td>{this.props.league}</td>
                <td>
                    <button onClick={this.handleClick} type="button" className="btn btn-danger btn-xs">
                        <span className="glyphicon glyphicon-trash"></span> remove
                    </button>
                </td>
            </tr>
        );
    }
});

/**
 * Component to add a league.
 */
var TeamAdd = React.createClass({
    getInitialState: function () {
        return {leagues:this.props.leagues};
    },
    handleClick: function (e) {
        e.preventDefault();

        var leagueId=$('select[name=leagueSelect]').val();
        var id=$('input[name=teamId]').val();
        var name=$('input[name=teamName]').val();

        var that=this;
        $.ajax({
            type: "POST",
            url: this.props.source + '/team',
            data: JSON.stringify({id:id, name:name, leagueId:leagueId}),
            success: function() { that.props.refreshCallback(); },
            dataType: "json",
            error: function (jqXHR, exception) {
                console.debug(jqXHR, exception);
            }
        });
    },
    render: function () {
        var createOptions=function (data) {
            return (<option value={data.id}>{data.name}</option>);
        };
        var options=this.state.leagues.map(createOptions);
        return (
            <tr>
                <td>
                    <input name="teamId" type="number" min="1" value={this.state.id}/>
                </td>
                <td>
                    <input name="teamName" value={this.state.name}/>
                </td>
                <td>
                    <select name="leagueSelect">
                        {options}
                    </select>
                </td>
                <td>
                    <button onClick={this.handleClick} type="button" className="btn btn-success btn-xs">
                        <span className="glyphicon glyphicon-plus"></span> add
                    </button>
                </td>
            </tr>
        );
    }
});

React.render(
    <Teams source="/api"/>,
    document.getElementById('content')
);