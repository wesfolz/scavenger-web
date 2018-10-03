import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './ScavengerMap.css';
  
const ScavengerMap = (props) => {
  const center = {
    lat: 39.637376,
    lng: -104.995604
  };

  const zoom = 12;

  return (
    // Important! Always set the container height explicitly
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAG8s_-MD-objxCQmPowqPMjt_-gHrDDU8' }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {props.children}
      </GoogleMapReact>
    </div>
  );
}

export default ScavengerMap;