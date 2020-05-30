import React from 'react';

export default class App extends React.Component {
  state = { name: 'viewers' }

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
