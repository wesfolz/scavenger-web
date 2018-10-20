import React, { Component } from 'react';
import './App.css';
import ScavengerMap from './components/ScavengerMap';
import ClueIcon from './components/ClueIcon';
import Headerbar from './components/Headerbar';
import FirebaseMain from './database/FirebaseMain';
import Chat from './components/Chat';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './components/ConfirmationModal';

library.add(faCarSide);

class App extends Component {
    constructor() {
        super();
        FirebaseMain.init();

        this.interlocutor = 'Alexa';
        this.user = 'Peach';
        this.goals = [];
        this.state = {
            locations: [],
            codes: [],
            userLocation: <div />,
            sidebarStyle: 'visible',
            currentGoalName: '',
            lastUpdated: '',
            modalVisible: false,
        };

        FirebaseMain.getGoalsRef().on('value', (goals) => this.generateClueIcons(goals.val()));
        FirebaseMain.getLocationRef(this.interlocutor).on('value', (location) => this.updateUserLocation(location.val()));
        FirebaseMain.getCurrentGoalRef().on('value', (goal) => this.setState({ currentGoalName: goal.val().name }));
    }

    updateUserLocation(location) {
        if (location != null) {
            this.setState({
                userLocation: <FontAwesomeIcon icon="car-side"
                    size='2x' color={'#2F80ED'} lat={location.coords.latitude} lng={location.coords.longitude} />,
                lastUpdated: this.convertUTCSecondsToTimeString(location.timestamp),
            });
        }
    }

    compareGoals(a, b) {
        if (a.index < b.index) {
            return -1;
        }
        else if (a.index > b.index) {
            return 1;
        }
        return 0;
    }

    clueIcon(goal) {
        return (
            <ClueIcon key={goal.name} name={goal.name} showInfo={goal.visible}
                onClick={() => this.selectClueIcon(goal.index)}
                lat={goal.coords.latitude} lng={goal.coords.longitude} status={goal.status} />
        );
    }

    generateClueIcons(goals) {
        this.goals = Object.keys(goals).map((key) => {
            goals[key].visible = false;
            return goals[key];
        });
        this.goals.sort(this.compareGoals);
        const locations = [];
        const codes = [];

        for (let i = 0; i < this.goals.length; i++) {
            let goal = this.goals[i];
            if (goal.type === "location") {
                locations.push(this.clueIcon(goal));
            }
            else {
                codes.push(this.clueIcon(goal));
            }
        }

        this.setState({ locations, codes })
    }

    selectClueIcon(index) {
        const goal = this.goals[index];
        if (this.state.currentGoalName === "finale" && goal.name === "home") {
            this.setState({
                modalVisible: true,
            })
        } else {
            goal.visible = !goal.visible;
            this.goals[index] = goal;
            if (goal.type === "location") {
                const locations = this.state.locations.slice();
                locations[index] = this.clueIcon(goal);
                this.setState({ locations });
            } else {
                const codes = this.state.codes.slice();
                codes[index] = this.clueIcon(goal);
                this.setState({ codes });
            }
        }
    }

    convertUTCSecondsToTimeString(seconds) {
        const d = new Date(seconds);
        return d.toLocaleTimeString();
    }

    expandSidebar() {
        this.setState({ sidebarStyle: (this.state.sidebarStyle === 'visible' ? 'hidden' : 'visible') });
    }

    confirmModal(confirm) {
        if (confirm) {
            FirebaseMain.setFinalGoalStatus();
        }
        this.setState({
            modalVisible: false,
        });
    }

    render() {
        return (
            <div className="App">
                <Headerbar goals={this.goals} selectClueIcon={(index) => this.selectClueIcon(index)} expandSidebar={() => this.expandSidebar()} {...this.state} />
                <ScavengerMap>
                    {this.state.locations}
                    {this.state.userLocation}
                </ScavengerMap>
                <div className="d-flex flex-direction-row h-100 justify-content-between">
                    <div className="btn-group" style={{ zIndex: 100, height: 0 }}>
                        {this.state.codes}
                    </div>
                    <div className="content">
                        <div className={this.state.sidebarStyle}>
                            <Chat user={this.user} interlocutor={this.interlocutor} />
                        </div>
                    </div>
                </div>
                {this.state.modalVisible ? <ConfirmationModal confirmModal={(confirm) => this.confirmModal(confirm)} /> : null}
            </div>
        );
    }
}

export default App;