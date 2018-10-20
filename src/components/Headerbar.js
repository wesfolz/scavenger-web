import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/fontawesome-free-regular';

const Headerbar = ({ goals, selectClueIcon, expandSidebar, currentGoalName, lastUpdated }) => {

    const displayGoalDropdownIcons = () => {
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].type === "location") {
                break;
            }
        }
        return (goals.map((goal, index) => (
            <React.Fragment key={goal.name}>
                {index === i ? <div className="dropdown-divider"></div> : null}
                <button className="dropdown-item"
                    onClick={() => selectClueIcon(goal.index)}>
                    {goal.name}
                </button>
            </React.Fragment>
        )));
    };

    return (
        <React.Fragment>
            <nav className="navbar sticky-top bg-dark">
                <div className="btn-group nav-item">
                    <button className="btn btn-dark btn-lg dropdown-toggle text-primary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Goals
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {displayGoalDropdownIcons()}
                    </div>
                </div>
                <div className="nav-link">
                    <h5 className="text-primary">{'Current Goal: ' + currentGoalName}</h5>
                    <h5 className="text-primary">{'Updated: ' + lastUpdated}</h5>
                </div>
                <button className="btn btn-dark nav-item" onClick={() => expandSidebar()}>
                    <FontAwesomeIcon icon={faComments} size='2x' color={'#4285F4'} />
                </button>
            </nav>

            <div className="pos-f-t">
                <div className="collapse" id="navbarToggleExternalContent">
                    <div className="bg-dark p-1">
                        <h5 className="text-primary nav-link">{'Current Goal: ' + currentGoalName}</h5>
                        <h5 className="text-primary nav-link">{'Last Location Update: ' + lastUpdated}</h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Headerbar;