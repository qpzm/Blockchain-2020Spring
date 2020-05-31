import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'viewers' };
  }

  render() {
    const { name } = this.state;
    return (
      <div className="hello">
        Hello,
        {' '}
        {name}
        !
      </div>
    );
  }
}
