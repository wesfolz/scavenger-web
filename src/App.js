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
    this.goals = [];
    this.state = {
      locations: [
        <div/>
      ],
      userLocation: <div/>,
      sidebarStyle: 'visible',
      currentGoalName: '',
      lastUpdated: '',
    };

    FirebaseMain.getGoalsRef().on('value', (goals) => this.generateClueIcons(goals.val()));
    FirebaseMain.getLocationRef(this.interlocutor).on('value', (location) => this.updateUserLocation(location.val()));
    FirebaseMain.getCurrentGoalRef().on('value', (goal) => this.setState({currentGoalName: goal.val().name}));
  }

  updateUserLocation(location) {
    if(location != null){
      this.setState({
        userLocation: <FontAwesomeIcon icon={faCarSide} 
          size='2x' color={'#2F80ED'} lat={location.coords.latitude} lng={location.coords.longitude}/>,
        lastUpdated: this.convertUTCSecondsToTimeString(location.timestamp),
      });
    }
  }

  compareGoals(a, b) {
    if(a.index < b.index) {
      return -1;
    }
    else if(a.index > b.index) {
      return 1;
    }
    return 0;
  }

  clueIcon(goal) {
    return(
      <ClueIcon key={goal.name} name={goal.name} showInfo={goal.visible} 
        onClick={() => this.selectClueIcon(goal.index)} 
        lat={goal.coords.latitude} lng={goal.coords.longitude} status={goal.status}/>
    );
  }

  generateClueIcons(goals) {
    this.goals = Object.keys(goals).map((key) => {
      goals[key].visible = false;
      return goals[key];
    });
    this.goals.sort(this.compareGoals);
    const clues = this.goals.map(goal => ( 
      this.clueIcon(goal)));
    this.setState({locations: clues})
  }

  displayGoalDropdownIcons() {
    return (this.goals.map(goal => (
        <button key={goal.name} className="dropdown-item" 
          onClick={() => this.selectClueIcon(goal.index)}>
          {goal.name}
        </button> 
      )));
  }

  selectClueIcon(index) {
    var goal = this.goals[index];
    goal.visible = !goal.visible;
    this.goals[index] = goal;
    const clues = this.state.locations.slice();
    clues[index] = this.clueIcon(goal);    
    this.setState({locations: clues});
  }

  convertUTCSecondsToTimeString(seconds) {
    var d = new Date(seconds);
    return d.toLocaleTimeString();
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar bg-dark navbar-dark justify-content-between">
          <div class="btn-group">
            <button className="btn btn-dark btn-lg dropdown-toggle text-primary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Goals
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {this.displayGoalDropdownIcons()}          
            </div>
          </div>
          <h5 className="text-primary">{'Current Goal: ' + this.state.currentGoalName}</h5>
          <h5 className="text-primary">{'Last Location Update: ' + this.state.lastUpdated}</h5>
          <button className="btn btn-dark" onClick={() => 
            this.setState({sidebarStyle: (this.state.sidebarStyle === 'visible' ? 'hidden' : 'visible')})}>
            <FontAwesomeIcon icon={faComments} size='2x' color={'#4285F4'}/>
          </button>
        </nav>
        <div className="content">
          <ScavengerMap>
            {this.state.locations}
            {this.state.userLocation}
          </ScavengerMap>

          <nav className={this.state.sidebarStyle}>
            <Chat user={this.user} interlocutor={this.interlocutor}/>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;