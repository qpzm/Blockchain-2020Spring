import React, { Component } from 'react';

export default class NewReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = { inputText: '', inputNumber: 3, };
  }

  handleTextChange = (event) => {
    this.setState({ inputText: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ inputNumber: event.target.value })
  }

  handleSave = () => {
    const { inputText, inputNumber } = this.state;
    const { onSave } = this.props;

    onSave(inputText, inputNumber);
    this.setState({ inputText: '', inputNumber: 3 })
  }

  render() {
    const { inputText, inputNumber } = this.state;
    return (
      <div>
        <input
          type="text"
          value={inputText}
          onChange={this.handleTextChange}
          data-test="newReviewBody"
        />
        <input
          type="number"
          min="0"
          max="5"
          value={inputNumber}
          onChange={this.handleNumberChange}
          data-test="newReviewNumber"
        />
        <button
          onClick={this.handleSave}
          data-test="saveNewReviewButton"
        >
          Save
        </button>
      </div>
    )
  }
}
