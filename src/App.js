import React, { Component } from 'react';
import './App.css';
import ScavengerMap from './components/ScavengerMap.js';
import ClueIcon from './components/ClueIcon.js';
import FirebaseMain from './database/FirebaseMain.js';
import Chat from './components/Chat.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faBars } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/fontawesome-free-regular';

class App extends Component {
  constructor() {
    super();
    FirebaseMain.init();

    this.interlocutor = 'Alexa';
    this.user = 'Peach';
    
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
        userLocation: <FontAwesomeIcon icon={faCarSide} 
          size='2x' color={'#2F80ED'} lat={location.coords.latitude} lng={location.coords.longitude}/>
      });
    }
  }

  generateClueIcons(goals) {
    var clues = [];
    for (var key in goals) {
      var goal = goals[key];
      clues.push(<ClueIcon name={goal.name} lat={goal.coords.latitude} lng={goal.coords.longitude} status={goal.status}/>)
    }
    this.setState({locations: clues})
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar bg-dark navbar-dark justify-content-between">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Goals
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
          <FontAwesomeIcon icon={faComments} size='2x' color={'#E0E0E0'} onClick={() => 
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
