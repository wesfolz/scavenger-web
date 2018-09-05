import React, { Component } from 'react';
import './App.css';
import ScavengerMap from './components/ScavengerMap.js';
import ClueIcon from './components/ClueIcon.js';
import FirebaseMain from './database/FirebaseMain.js';
import Chat from './components/Chat.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faBars } from '@fortawesome/free-solid-svg-icons';

library.add(faCarSide);
library.add(faBars);

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
      userLocation: <div/>,
      sidebarStyle: 'visible',
    };

    FirebaseMain.getGoalsRef().on('value', (goals) => this.generateClueIcons(goals.val()));
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
        <nav class="navbar bg-dark navbar-dark justify-content-end">
          <FontAwesomeIcon icon={'bars'} size='2x' color={'#E0E0E0'} onClick={() => 
            this.setState({sidebarStyle: (this.state.sidebarStyle === 'visible' ? 'hidden' : 'visible')})}/>
        </nav>
        <div className="content">
          <ScavengerMap locations={this.state.locations} userLocation={this.state.userLocation}/>
          <nav className={this.state.sidebarStyle}>
            <Chat user={this.user} interlocutor={this.interlocutor}/>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;
