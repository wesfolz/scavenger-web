import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ScavengerMap from './components/ScavengerMap.js';
import ClueIcon from './components/ClueIcon.js';
import FirebaseMain from './database/FirebaseMain.js';
import Chat from './components/Chat.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

library.add(faCarSide);


class App extends Component {
  constructor() {
    super();
    FirebaseMain.init();

    this.interlocutor = 'Alexa';
    this.user = 'Puppy Jean';
    
    this.state = {
      locations: [
        <div/>
      ],
      userLocation: <div/>
    };

    FirebaseMain.getGoalsRef().once('value').then((goals) => this.generateClueIcons(goals.val()));
    FirebaseMain.getLocationRef(this.interlocutor).on('value', (location) => this.updateUserLocation(location.val()));
  }

  updateUserLocation(location) {
    if(location != null){
      this.setState({
        userLocation: <FontAwesomeIcon icon={'car-side'} 
          size='2x' color={'#2F80ED'} lat={location.coords.latitude} lng={location.coords.longitude}/>
      });
    }
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
          <ScavengerMap locations={this.state.locations} userLocation={this.state.userLocation}/>
          <Chat user={this.user} interlocutor={this.interlocutor}/>
        </div>
      </div>
    );
  }
}

export default App;
