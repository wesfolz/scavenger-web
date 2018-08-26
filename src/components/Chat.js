import React, { Component } from 'react';
import './Chat.css';
import FirebaseMain from '../database/FirebaseMain.js';
  
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messageText: '', messages: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    FirebaseMain.getMessageRef(this.props.user).on('child_added', (data) => this.updateMessages(data.val())); 
    FirebaseMain.getMessageRef(this.props.interlocutor).once('value').then((data) => this.populateMessages(data.val()));
  }

  populateMessages(data) {
    var messages = [];
    for(var key in data) {
      messages.push(data[key]);
    }
    this.updateMessages(messages);
  }

  updateMessages(messages) {
    console.log(messages);
    this.setState({
      messages: this.state.messages.concat(messages),
    });
  }

  displayMessages() {
    var messageComponents = [];
    for (var i=0; i < this.state.messages.length; i++) {
      var message = this.state.messages[i].text;
      var className = 'right';
      if (this.state.messages[i].user._id === 1) {
        className = 'left';
      }
      messageComponents.push(<li className={className}><div>{message}</div></li>);
    }
    return messageComponents;
  }

  handleChange(event) {
    this.setState({messageText: event.target.value});
  }

  handleSubmit(event) {
    this.updateMessages(this.state.messageText);
    FirebaseMain.addMessage(this.props.interlocutor, this.state.messageText);
    event.preventDefault();
  }

  render() {
    return (
      <div className="chat-container">
        <ul>
          {this.displayMessages()}
        </ul>
        <form className="form" onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.messageText} onChange={this.handleChange} />
          <button className="form-button" type="submit" value="Submit">Send</button>
        </form>
      </div>
    );
  }
}