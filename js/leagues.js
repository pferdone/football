/**
 * Created by pferdone on 14.08.15.
 */


/**
 * Renders the league table.
 */
var Leagues = React.createClass({
    getInitialState: function () {
        return {leagues:[]};
    },
    refresh: function () {
        var that=this;
        $.ajax({
            type: "GET",
            url: this.props.source,
            success: function (data) {
                that.setState({leagues:JSON.parse(data)});
            }
        });
    },
    componentDidMount: function () {
        this.refresh();
    },
    render: function () {
        var that=this;
        var createLeague = function (data) {
            return (<LeagueEntry source={that.props.source} refreshCallback={that.refresh} id={data.id} name={data.name}/>);
        };
        // list all leagues and attach a row to add a league
        var rows = this.state.leagues.map(createLeague);
        rows.push(React.createElement(LeagueAdd, {source:this.props.source, refreshCallback:this.refresh}));

        return (
            <div>
                <table className="table table-striped">
                    <thead><tr><th>id</th><th>name</th><th>function</th></tr></thead>
                    <tbody>{rows}</tbody>
                 </table>
            </div>
        );
    }
});

/**
 * League table entry.
 */
var LeagueEntry = React.createClass({
    handleClick: function() {
        var that=this;
        $.ajax({
            type: "DELETE",
            url: this.props.source + "/" + this.props.id,
            success: function() { that.props.refreshCallback(); }
        });
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
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
var LeagueAdd = React.createClass({
    getInitialState: function () {
        return {id:'', name:''};
    },
    handleIdChange: function (e) {
        this.setState({id:e.target.value});
    },
    handleNameChange: function (e) {
        this.setState({name:e.target.value});
    },
    handleClick: function (e) {
        e.preventDefault();
        var that=this;
        $.ajax({
            type: "POST",
            url: this.props.source,
            data: JSON.stringify({id:this.state.id, name:this.state.name}),
            success: function() { that.props.refreshCallback(); },
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.debug(jqXHR, textStatus, errorThrown);
            }
        });
    },
    render: function () {
        return (
            <tr>
                <td>
                    <input type="number" min="1" max="300" onChange={this.handleIdChange} value={this.state.id}/>
                </td>
                <td>
                    <input onChange={this.handleNameChange} value={this.state.name}/>
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
    <Leagues source="/api/league"/>,
    document.getElementById('content')
);