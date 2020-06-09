import React from 'react';
import { postStorage } from '../PostStorage.js';

class Writer extends React.Component {

  addPost(e) {
    e.preventDefault();
    let post = {
      body: this.body.value,
    };
    postStorage.newPost(this, post);
  }

  render() {
    return (
      <form onSubmit={(e) => this.addPost(e)}>
        <p>
          <textarea ref={(input) => this.body = input} />
          <br />
          <button type="submit">Post</button>
        </p>
      </form>
    );
  }
}

export default Writer;

