var Openlog = React.createClass({
  render: function() {
    return (
      <div className="openlog">
        {this.props.time}
      </div>
    );
  }
});

var OpenLogList = React.createClass({
  render: function() {
    var openlogNodes = this.props.data.map(
    function (data) {
      return (
        <Openlog time={data} />
      );
    });
    return (
      <div className="openLogList">
        {openlogNodes}
      </div>
    );
  }
});

var OpenLogBox = React.createClass({
  loadOpenLogsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadOpenLogsFromServer();
    setInterval(this.loadOpenLogsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="openLogBox">
        <h1>Open logs</h1>
        <OpenLogList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <OpenLogBox url="/api/openlogs" pollInterval={2000} />,
  document.getElementById('content')
);
