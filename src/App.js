import React from 'react';
import './App.css';
import { postStorage } from './PostStorage';
import Writer from './Components/Writer';
import Post from './Components/Post';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    postStorage.subscribe(this);
  }

  componentWillUnmount() {
    postStorage.unsubscribe(this);
  }

  render() {
    window.localStorage.clear();
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Noncense</h1>
        </header>
        <div className="container">
          <div className="content">
            <Writer />
            <div className='postList'>
              {
                Object
                .keys(this.state.posts)
                .reverse()
                .map(key => <Post key={key} meta={this.state.posts[key]} />)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
