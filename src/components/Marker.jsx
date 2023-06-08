import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Define a custom icon
let CustomIcon = L.DivIcon.extend({
  options: {
    className: "custom-icon",
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
  const [open, setOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div>
          <h3>{data.title}</h3>
          <img
            src={data.image}
            alt={data.title}
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onClick={handleClickOpen}
          />
        </div>
      </Popup>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{data.title}</DialogTitle>
        <DialogContent>
          <img
            src={data.image}
            alt={data.title}
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onClick={() => setFullScreen(true)}
          />
          {fullScreen && (
            <img
              src={data.image}
              alt={data.title}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                objectFit: "contain",
                zIndex: 1000,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              onClick={() => setFullScreen(false)}
            />
          )}

          <p>{data.description}</p>
          <p>{data.timestamp}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Marker>
  );
};

export default MapMarker;
