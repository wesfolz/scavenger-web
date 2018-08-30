import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './ScavengerMap.css';
//import ClueIcon from './ClueIcon.js';
  
export default class ScavengerMap extends Component {
  static defaultProps = {
    locations: [
      <div/>
    ],
    userLocation: <div/>,
    center: {
      lat: 39.637376,
      lng: -104.995604
    },
    zoom: 12
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div className="mapContainer">
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAG8s_-MD-objxCQmPowqPMjt_-gHrDDU8' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {this.props.locations}
          {this.props.userLocation}
        </GoogleMapReact>
      </div>
    );
  }
}