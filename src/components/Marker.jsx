import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library

// Define a custom icon
let CustomIcon = L.DivIcon.extend({
  options: {
    className: "custom-icon", // assign a unique class to the icon
    html: `<div style="
        background: url(https://cdn.shopify.com/s/files/1/0578/0770/0167/files/k1.png?v=1682167684);
        background-size: cover;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;">
          <div style="
            position: absolute;
            bottom: -10px;
            left: 50%;
            width: 0;
            height: 0;
            margin-left: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 10px solid #000;">
          </div>
      </div>`,
    iconSize: [25, 25],
    popupAnchor: [-3, -76],
  },
});

const customIcon = new CustomIcon();

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
