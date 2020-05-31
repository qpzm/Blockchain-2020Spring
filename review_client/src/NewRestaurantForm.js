import React, { Component } from 'react';

export default class NewRestaurantForm extends Component {
  constructor(props) {
    super(props);
    this.state = { inputText: '' };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleTextChange(event) {
    this.setState({ inputText: event.target.value })
  }

  handleSave() {
    const { inputText } = this.state;
    const { onSave } = this.props;

    onSave(inputText);
    this.setState({ inputText: '' })
  }

  render() {
    const { inputText } = this.state;
    return (
      <div>
        <input
          type="text"
          value={inputText}
          onChange={this.handleTextChange}
          data-test="newRestaurantName"
        />
        <button
          onClick={this.handleSave}
          data-test="saveNewRestaurantButton"
        >
          Save
        </button>
      </div>
    )
  }
}
