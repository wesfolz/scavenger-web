import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faQuestionCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faLock);
library.add(faQuestionCircle);
library.add(faCheckCircle);

export default class ClueIcon extends Component {
  static defaultProps = {
    status: 'lock'
  };

  getIconName() {
    switch(this.props.status) {
      case 'locked':
        return 'lock';

      case 'unlocked':
        return 'question-circle';

      case 'done':
        return 'check-circle';
    }
  }

  getColor() {
    switch(this.props.status) {
      case 'locked':
        return '#333333';

      case 'unlocked':
        return '#2D9CDB';

      case 'done':
        return '#27AE60';
    }
  }
 
  render() {
    return (
      <FontAwesomeIcon icon={this.getIconName()} size='2x' color={this.getColor()}/>
    );
  }
}