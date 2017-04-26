import React from 'react';


class Hi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    console.log('Hi mounted');
  }
  componentWillUnmount() {
    console.log('Hi unmounted')
  }

  render = () => 
    <section>
      <h1>hi {this.state.count}</h1>
      <button className="button -black" onClick={() => this.setState({ count: this.state.count + 1 })}>+</button>
    </section>
}


class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    console.log('Hello mounted');
  }
  componentWillUnmount() {
    console.log('Hello unmounted')
  }

  render = () =>
    <section>
      <h1>hello {this.state.count}</h1>
      <button className="button -black" onClick={() => this.setState({ count: this.state.count + 1 })}>+</button>
    </section>
}

class Page_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hi: true
    };
  }

  componentDidMount() {
    console.log('Page_test mounted');
  }

  render = () =>
    <div className="container">
      {
        this.state.hi ?
          <Hi/> :
          <Hello/>
      }

      <button onClick={() => this.setState({ hi: !this.state.hi })} className="button">Toggle</button>
    </div>
}

export { Page_test };
