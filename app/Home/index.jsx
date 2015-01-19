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

    var data = [];
    responseStream.subscribe(function(response) {
      this.setState({data: response});
      data = this.state.data;
    }.bind(this));

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
      .map(
        function(x) {
          newData.push(x);
          this.setState({data: newData});
          return newData;
        }.bind(this)
      )
      .subscribe(
        function(x) {
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

    var sort = this.refs.sort.getDOMNode();
    var changes = Rx.Observable.fromEvent(sort, 'change')
      .map(
        function (e) {
          this.setState({orderProp: e.target.value});
          return e.target.value;
        }.bind(this)
      )
      .map(function(x) {
          this.setState({data: []});
          return x;
        }.bind(this)
      )
      .subscribe(
        function(x) {
          console.log(x);
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

 render: function() {
   return <div className={this.state.loading ? "application loading" : "application"}>
     {this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
       <div className="container-fluid">
         <div className="row">
           <div className="col-md-2">
             Search: <input type="text" ref="search" />
             Sort by:
             <select ref="sort" value={this.state.orderProp}>
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
  },
});

module.exports = Application;
