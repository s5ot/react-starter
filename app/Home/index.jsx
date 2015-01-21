var React = require("react/addons");
var Link = require("react-router").Link;
var Rx = require("rx");
var jQuery = require("jquery");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var PhoneItem = React.createClass({
  render: function() {
    return (
      <li className="thumbnail" key={this.props.id}>
        <a href='#' className='thumb'><img className='thumb' src={'http://localhost:8000/' + this.props.imageUrl}/></a>
        <Link to='phoneitem' params={this.props}>{this.props.name}</Link>
        <p>{this.props.snippet}</p>
      </li>
    );
  }
});

var PhoneList = React.createClass({
  render: function() {
    var phoneNodes = this.props.data.map(function (phone) {
      return (
        <PhoneItem name={phone.name} snippet={phone.snippet} imageUrl={phone.imageUrl} id={phone.id} key={phone.name}/>
      );
    });

    return (
      <ul className="phones">
        <CSSTransitionGroup transitionName="sample">
          {phoneNodes}
        </CSSTransitionGroup>
      </ul>
    );
  }
});

var Application = React.createClass({
  mixins: [],

  getInitialState: function() {
    return {
      data: [],
      orderProp: 'age'
    };
  },

  componentDidMount: function() {
    var requestStream = Rx.Observable.returnValue('http://localhost:8000/phones/phones.json');

    var responseStream = requestStream
        .flatMap(function(requestUrl) {
          return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
        });

    //var originalData = [];
    //var phoneStream = responseStream.toArray();
    //console.log(phoneStream);

    /*
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
      return Rx.Observable.fromArray(originalData).filter(function(phone) { return phone.name.match(matcher) || phone.snippet.match(matcher) });
    })
    .map(
      function(x) {
        newData.push(x);
        return newData;
      }.bind(this)
    )
    .subscribe(
      function(x) {
        var orderProp = this.state.orderProp;
        this.setState({data: x.sort(function(a, b) {
          if (String(a[orderProp]).toLowerCase() > String(b[orderProp]).toLowerCase()) {
            return 1;
          }
          if (String(a[orderProp]).toLowerCase() < String(b[orderProp]).toLowerCase()) {
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

    var filteredData = [];
    var sort = this.refs.sort.getDOMNode();
    var changes = Rx.Observable.fromEvent(sort, 'change')
    .map(
      function (e) {
        this.setState({orderProp: e.target.value});
        return e.target.value;
      }.bind(this)
    )
    .map(function(x) {
      filteredData = this.state.data;
      this.setState({data: []});
      return filteredData;
    }.bind(this)
    )
    .subscribe(
      function(x) {
        var orderProp = this.state.orderProp;
        this.setState({data: x.sort(function(a, b) {
          if (String(a[orderProp]).toLowerCase() > String(b[orderProp]).toLowerCase()) {
            return 1;
          }
          if (String(a[orderProp]).toLowerCase() < String(b[orderProp]).toLowerCase()) {
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
    */

    var search = this.refs.search.getDOMNode();
    var keyupStream = Rx.Observable.fromEvent(search,  'keyup')
      .map(function (e) {
        return e.target.value;
      })
      .throttle(500)
      .distinctUntilChanged()
      .startWith('');

    var order = this.refs.order.getDOMNode();
    var orderStream = Rx.Observable.fromEvent(order, 'change')
        .map(function (e) {
            return e.target.value;
          }
        )
        .startWith('age');

    orderStream.subscribe(
      function(x) {
        this.setState({orderProp: x});
      }.bind(this),
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );

    var filteredStream = responseStream
        .combineLatest(keyupStream, orderStream,
          function(data, k, o) {
            var matcher = new RegExp(".*" + k + ".*", 'i');
            return data.filter(function(phone) { return phone.name.match(matcher) || phone.snippet.match(matcher) })
                    .sort(function(a, b) {
                      if (String(a[o]).toLowerCase() > String(b[o]).toLowerCase()) {
                        return 1;
                      }
                      if (String(a[o]).toLowerCase() < String(b[o]).toLowerCase()) {
                        return -1;
                      }
                      return 0;
                    });
          }
        );

    filteredStream.subscribe(
      function(x) {
        this.setState({data: x});
      }.bind(this),
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );

    /*
    var order = this.refs.order.getDOMNode();
    var orderStream = Rx.Observable.fromEvent(order, 'change')
        .map(function (e) {
            return e.target.value;
          }
        )
        .startWith('age');

    var filteredAndOrderedStream = orderStream
        .combineLatest(filteredStream,
          function(o, filtered) {
            console.log(filtered);
            return filtered.sort(function(a, b) {
              if (String(a[orderProp]).toLowerCase() > String(b[orderProp]).toLowerCase()) {
                return 1;
              }
              if (String(a[orderProp]).toLowerCase() < String(b[orderProp]).toLowerCase()) {
                return -1;
              }
              return 0;
              });
          }
        );

    filteredAndOrderedStream.subscribe(
      function(x) {
        console.log(x);
      },
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );
    */
  },

  render: function() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              Search: <input type="text" ref="search" />
              Sort by:
              <select ref="order" value={this.state.orderProp}>
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
              </select>
            </div>
            <div className="col-md-10">
              <PhoneList data={this.state.data} />
            </div>
          </div>
        </div>
      </div>
    )
  },
});

module.exports = Application;
