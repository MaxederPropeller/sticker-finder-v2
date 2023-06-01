import React from "react";
import { Marker, Popup } from "react-leaflet";

const MapMarker = ({ position, data }) => {
  return (
    <Marker position={position}>
      <Popup>
        <div>
          <img src={data.image} alt={data.title} />
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <p>{data.timestamp}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
