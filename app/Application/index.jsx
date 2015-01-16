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
    return {
      data: [
        {'name': 'Nexus S', 'snippet': 'Fast just got faster with Nexus S.', 'age': 1},
        {'name': 'Motorola XOOM™ with Wi-Fi', 'snippet': 'The Next, Next Generation tablet.', 'age': 2},
        {'name': 'MOTOROLA XOOM™', 'snippet': 'The Next, Next Generation tablet.', 'age': 3}
      ],
      orderProp: 'age'
    };
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

    var sort = this.refs.sort.getDOMNode();
    var changes = Rx.Observable.fromEvent(sort, 'change')
      .map(
        function (e) {
          this.setState({orderProp: e.target.value});
          return e.target.value;
        }.bind(this)
      )
      .subscribe(
        function(x) {
          console.log(x);
          console.log(this.state.orderProp);
          console.log(this.state.data);
          console.log(this.state.data[0][this.state.orderProp]);
          var orderProp = this.state.orderProp;
          this.setState({data: this.state.data.sort(function(a, b) {
            if (a[orderProp] > b[orderProp]) {
              return 1;
            }
            if (a[orderProp] < b[orderProp]) {
              return -1;
            }
            return 0;
          })});
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
      <div>
      <label>Search: </label><input type="text" ref="search" />
      </div>
      Sort by:
      <select ref="sort" value={this.state.orderProp}>
      <option value="name">Alphabetical</option>
      <option value="age">Newest</option>
      </select>
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
