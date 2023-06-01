import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "../styles/Map.css";

const Map = () => {
  const position = [51.505, -0.09]; // Sie können dies durch den aktuellen Standort ersetzen

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker Komponenten hier hinzufügen */}
    </MapContainer>
  );
};

export default Map;
