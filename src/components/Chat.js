import React, { Component } from 'react';
import './Chat.css';
import FirebaseMain from '../database/FirebaseMain.js';
  
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {messageText: '', messages: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.firstUpdate = true;
    this.messages = [];
  }

  componentWillMount() {
    FirebaseMain.getMessageRef(this.props.user).on('child_added', (data) => this.updateMessages(data.val())); 
    //var query = FirebaseMain.getMessageRef(this.props.interlocutor).orderByChild('createdAt');
    //query.once('value').then((data) => this.populateMessages(data.val()));
    //var query = FirebaseMain.getMessageRef(this.props.user).orderByChild('createdAt');
    //query.once('value').then((data) => this.populateMessages(data.val()));
    FirebaseMain.getMessageRef(this.props.interlocutor).once('value').then((data) => this.populateMessages(data.val()));
    //this.state.messages.sort((a, b) => this.compareMessages(a, b));
  }
    
  sortMessages() {
    console.log(this.messages);
    this.messages.sort(this.compareMessages);
    this.setState({messages: this.messages});
  }

  compareMessages(a, b) {
    console.log(a);
    if(a.createdAt < b.createdAt) {
      return -1;
    }
    else if(a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  }

  populateMessages(data) {
    var messages = [];
    for(var key in data) {
      messages.push(data[key]);
    }
    this.messages = this.messages.concat(messages);
    this.setState({
      messages: this.messages,
    }, this.sortMessages);
  }

  updateMessages(messages) {
    this.messages = this.messages.concat(messages);
    this.setState({
      messages: this.messages,
    });
  }

  displayMessages() {
    var messageComponents = [];
    for (var i=0; i < this.state.messages.length; i++) {
      var message = this.state.messages[i];
      var className = 'right';
      var color = 'orange';
      if (message.user._id === 1) {
        className = 'left';
        color = 'purple';
      }
      console.log(message.user.name);
      var time = new Date(message.createdAt).toLocaleTimeString();
      messageComponents.push(
        <li className={className}>
          <div>{message.user.name}<br/>{time}</div>
          <div className={color}>{message.text}</div>
        </li>);
    }
    return messageComponents;
  }

  handleChange(event) {
    this.setState({messageText: event.target.value});
  }

  handleSubmit(event) {
    var messageObject = {
      _id: 'irrelevant',
      createdAt: new Date().toISOString(),
      text: this.state.messageText,
      user: {
        _id: 2,
        name: this.props.user,
      }
    };
    this.updateMessages(messageObject);
    FirebaseMain.addMessage(this.props.interlocutor, messageObject);
    this.setState({messageText: ''});
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