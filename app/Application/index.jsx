var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

require("./style.css");

var PhoneItem = React.createClass({
  render: function() {
    return (
      <li className="thumbnail">
        <a href='#' className='thumb'><img className='thumb' src={'http://localhost:8000/' + this.props.imageUrl}/></a>
        <a href='#'>{this.props.name}</a>
        <p>{this.props.snippet}</p>
      </li>
    );
  }
});

var PhoneList = React.createClass({
  render: function() {
    var phoneNodes = this.props.data.map(function (phone) {
      return (
        <PhoneItem name={phone.name} snippet={phone.snippet} imageUrl={phone.imageUrl} />
      );
    });
  return (
    <ul className="phones">
      {phoneNodes}
    </ul>
    );
  }
});

var Application = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div>
          <h1>React+RxJS</h1>
        <RouteHandler />
      </div>)
  },
});

module.exports = Application;
