import React, { Component } from 'react';


class Post extends Component {
  render() {
    return (
      <div className="individualPost">
        <p className="author">{this.props.meta.author}</p>
        <p>{this.props.meta.body}</p>
        <p className="date">{this.props.meta.date}</p>
        <hr />
      </div>
    );
  }
}

export default Post;
