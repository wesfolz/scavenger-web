import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import ClueIcon from './ClueIcon.js';
  
export default class ScavengerMap extends Component {
  static defaultProps = {
    locations: [
      <div />
    ],
    center: {
      lat: 39.637376,
      lng: -104.995604
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '80vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAG8s_-MD-objxCQmPowqPMjt_-gHrDDU8' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
        {this.props.locations}
        {/*<ClueIcon
            lat={this.props.locations[0].coords.latitude}
            lng={this.props.locations[0].coords.longitude}
          />*/}
        </GoogleMapReact>
      </div>
    );
  }
}