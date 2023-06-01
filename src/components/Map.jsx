import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MapMarker from "./Marker";

import { Paper, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";

import MarkerForm from "./MarkerForm";

const StyledMapContainer = styled(Paper)({
  height: "100vh",
  width: "100%",
  borderRadius: "4px",
  zIndex: 0,
  boxShadow:
    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  background: "linear-gradient(to right, violet, blue)",
  overflow: "hidden",
});

const StyledFab = styled(Fab)({
  position: "absolute",
  bottom: "16px",
  right: "16px",
});

function MapInitializer() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

const Map = () => {
  const position = [46.7, 8.2];
  const [open, setOpen] = useState(false);
  const [markers, setMarkers] = useState([]); // Zustand für Marker hinzufügen

  // Callback function for when a new marker is added
  const onMarkerAdded = () => {
    fetchMarkers();
  };

  const fetchMarkers = async () => {
    const markerCollection = collection(db, "markers");
    const markerSnapshot = await getDocs(markerCollection);
    const markerList = markerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      coordinates: [
        doc.data().coordinates.latitude,
        doc.data().coordinates.longitude,
      ],
    }));
    setMarkers(markerList);
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <StyledMapContainer>
      <MapContainer
        center={position}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <MapInitializer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            position={marker.coordinates}
            data={marker}
          />
        ))}
      </MapContainer>
      <StyledFab color="primary" aria-label="add" onClick={handleOpen}>
        <AddIcon />
      </StyledFab>
      <MarkerForm
        open={open}
        handleClose={handleClose}
        db={db}
        onMarkerAdded={onMarkerAdded}
      />
    </StyledMapContainer>
  );
};

export default Map;
