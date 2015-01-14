var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;
var Rx = require("rx");

require("./style.css");

var PhoneItem = React.createClass({
  render: function() {
    return (
      <li>
        <span>{this.props.name}</span>
        <p>{this.props.snippet}</p>
      </li>
    );
  }
});

var PhoneList = React.createClass({
  render: function() {
    var phoneNodes = this.props.data.map(function (phone) {
      return (
        <PhoneItem name={phone.name} snippet={phone.snippet} />
      );
    });
  return (
    <ul>
      {phoneNodes}
    </ul>
    );
  }
});

var Application = React.createClass({
  mixins: [StateFromStoreMixin],

  getInitialState: function() {
    return {data: [
      {'name': 'Nexus S', 'snippet': 'Fast just got faster with Nexus S.'},
      {'name': 'Motorola XOOM™ with Wi-Fi', 'snippet': 'The Next, Next Generation tablet.'},
      {'name': 'MOTOROLA XOOM™', 'snippet': 'The Next, Next Generation tablet.'}
    ]};
  },

  componentDidMount: function() {
    var data = this.state.data;
    var newData = [];
    var search = this.refs.search.getDOMNode();
    var keyups = Rx.Observable.fromEvent(search,  'keyup')
    .map(function (e) {
      return e.target.value;
    })
    .throttle(500)
    .distinctUntilChanged()
    .map(
      function(x) {
        newData = [];
        this.setState({data: newData});
        return x;
      }.bind(this)
    )
    .flatMap(function(s) {
      var matcher = new RegExp(".*" + s + ".*", 'i');
      return Rx.Observable.fromArray(data).filter(function(phone) { return phone.name.match(matcher) || phone.snippet.match(matcher) });
    })
    .subscribe(
      function(x) {
        newData.push(x);
        this.setState({data: newData});
      }.bind(this),
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );
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
    return <div className={this.state.loading ? "application loading" : "application"}>
      {this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
      <h1>react-starter</h1>
      <input type="text" ref="search" />
      <PhoneList data={this.state.data} />
    </div>;
  },

  update: function() {
    var { stores } = this.context;
    Object.keys(stores).forEach(function(key) {
      stores[key].update();
    });
  }
});

module.exports = Application;
