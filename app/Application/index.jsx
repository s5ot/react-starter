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
  //mixins: [StateFromStoreMixin],

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  statics: {
    getState: function(stores, params) {
      var transition = stores.Router.getItem("transition");
      return {
        loading: !!transition
      };
    },
  },

  render: function() {
    return (
      <div className={this.state.loading ? "application loading" : "application"}>
        {this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
          <h1>react-starter</h1>
        <RouteHandler />
      </div>)
  },
});

module.exports = Application;
