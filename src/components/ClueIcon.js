import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faQuestionCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faLock);
library.add(faQuestionCircle);
library.add(faCheckCircle);

export default class ClueIcon extends Component {
    static defaultProps = {
        status: 'lock',
        showInfo: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
        }
    }

    getIconName() {
        switch (this.props.status) {
            case 'locked':
                return 'lock';

            case 'unlocked':
                return 'question-circle';

            case 'done':
                return 'check-circle';

            default:
                return 'lock';
        }
    }

    getColor() {
        switch (this.props.status) {
            case 'locked':
                return '#333333';

            case 'unlocked':
                return '#2D9CDB';

            case 'done':
                return '#27AE60';

            default:
                return '#333333';
        }
    }

    displayInfoCard() {
        if (this.props.showInfo) {
            return (<div className="card" style={{ width: '8rem' }}>
                <div className="card-body">
                    <h5 className="card-title">{this.props.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{this.props.status}</h6>
                </div>
            </div>);
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <button className="btn btn-outline-light btn-sm" data-toggle="tooltip" title={this.props.name}
                    onClick={() => this.props.onClick()}>
                    <FontAwesomeIcon
                        icon={this.getIconName()} size='2x' color={this.getColor()} />
                </button>
                {this.displayInfoCard()}
            </div>
        );
    }
}