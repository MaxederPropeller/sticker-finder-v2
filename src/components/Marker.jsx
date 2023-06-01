import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library

// Define a custom icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdn.shopify.com/s/files/1/0578/0770/0167/files/k1.png?v=1682167684", // URL to your custom icon
  iconSize: [20, 20], // Size of the icon

  popupAnchor: [-3, -76], // Point from which the popup should open relative to the iconAnchor
});

const MapMarker = ({ position, data }) => {
  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div>
          <img
            src={data.image}
            alt={data.title}
            style={{
              width: "100%", // Limit the width to the size of the Popup
              maxHeight: "200px", // Limit the maximum height
              objectFit: "cover", // Cover the entire space without distorting the image
              borderRadius: "8px", // Optional: Add some round corners
            }}
          />
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <p>{data.timestamp}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
