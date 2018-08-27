import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ScavengerMap from './components/ScavengerMap.js';
import ClueIcon from './components/ClueIcon.js';
import FirebaseMain from './database/FirebaseMain.js';
import Chat from './components/Chat.js';

class App extends Component {
  constructor() {
    super();
    FirebaseMain.init();
    
    this.state = {
      locations: [
        <div />
      ]
    };

    FirebaseMain.getGoalsRef().once('value').then((goals) => this.generateClueIcons(goals.val()));
  }

  generateClueIcons(goals) {
    var clues = [];
    for (var key in goals) {
      var goal = goals[key];
      clues.push(<ClueIcon lat={goal.coords.latitude} lng={goal.coords.longitude} status={goal.status}/>)
    }
    this.setState({locations: clues})
  }

  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>*/}
        <div className="content">
          <ScavengerMap locations={this.state.locations}/>
          <Chat user={'Puppy Jean'} interlocutor={'Alexa'}/>
        </div>
      </div>
    );
  }
}

export default App;
