import React, { Component } from 'react';
import './Chat.css';
import FirebaseMain from '../database/FirebaseMain.js';
import uuidv4 from 'uuid/v4';
  
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {messageText: '', messages: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.firstUpdate = true;
    this.messages = [];
    this.messageUpdate = false;
  }

  componentWillMount() {
    FirebaseMain.getMessageRef(this.props.user).on('child_added', (data) => this.updateMessages(data.val())); 
    FirebaseMain.getMessageRef(this.props.interlocutor).once('value').then((data) => this.populateMessages(data.val()));
  }
    
  sortMessages() {
    this.messages.sort(this.compareMessages);
    this.setState({messages: this.messages});
  }

  compareMessages(a, b) {
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
    this.messageUpdate = true;
    this.messages = this.messages.concat(messages);
    this.setState({
      messages: this.messages,
    });
    //this.scrollToBottom();
  }

  displayMessages() {
    return (this.state.messages.map(message => (
      <li key={message.createdAt} className={message.user._id === 1 ? 'left' : 'right'}>
          <div>{message.user.name}<br/>{new Date(message.createdAt).toLocaleTimeString()}</div>
          <div className={message.user._id === 1 ? 'purple' : 'orange'}>{message.text}</div>
        </li> 
    )));
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleChange(event) {
    this.setState({messageText: event.target.value});
  }

  handleSubmit(event) {
    var messageObject = {
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      text: this.state.messageText,
      user: {
        _id: 2,
        name: this.props.user,
        avatar: 'https://firebasestorage.googleapis.com/v0/b/scavenger-5be15.appspot.com/o/Peach.jpg?alt=media&token=34af3658-28fd-45c5-a2d9-7267d924fedc'
      }
    };
    FirebaseMain.addMessage(this.props.interlocutor, messageObject);
    this.setState({messageText: ''});
    this.updateMessages(messageObject);
    event.preventDefault();
  }

  scrollToBottom() {
    if(this.messagesEnd != null && this.messageUpdate) {
      console.log(this.messageUpdate);
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      this.messageUpdate = false;
    }
  }

  render() {
    return (
      <div className="chat-container">
        <ul>
          {this.displayMessages()}
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </ul>
        <form className="form" onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.messageText} onChange={this.handleChange} />
          <button className="btn" type="submit" value="Submit">Send</button>
        </form>
      </div>
    );
  }
}