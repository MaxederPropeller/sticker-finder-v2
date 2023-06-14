import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MapMarker from "./Marker";
import { Paper, Fab, Switch } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import MarkerForm from "./MarkerForm";
import { Snackbar, Alert } from "@mui/material";
import { getDistance } from "geolib";

const StyledMapContainer = styled(Paper)({
  height: "95vh",
  width: "100vw",
  borderRadius: "4px",
  flexGrow: 1 /* Ermöglicht es der Karte, den restlichen Raum zu füllen */,
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

const ControlsContainer = styled("div")({
  position: "absolute",
  bottom: 8,
  left: 8,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  fontSize: "1.1rem",
  fontStyle: "bold",
});

const Map = () => {
  const [open, setOpen] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [geoCacheEnabled, setGeoCacheEnabled] = useState(true);
  const [allMarkers, setAllMarkers] = useState([]); // Neu: für alle Marker
  const [selectedTileLayer, setSelectedTileLayer] = useState("osm");

  const toggleTileLayer = () => {
    setSelectedTileLayer((prevLayer) => (prevLayer === "osm" ? "esri" : "osm"));
  };

  const onMarkerAdded = () => {
    fetchMarkers();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const position = useMemo(() => [46.7, 8.0], []);

  const fetchMarkers = useCallback(async () => {
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

    setAllMarkers(markerList); // Setzen aller Marker
  }, [db]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  useEffect(() => {
    if (!geoCacheEnabled) {
      setMarkers(allMarkers);
    } else {
      const filteredMarkerList = allMarkers.filter((marker) => {
        const distance = getDistance(
          { latitude: position[0], longitude: position[1] },
          { latitude: marker.coordinates[0], longitude: marker.coordinates[1] }
        );

        return distance <= 200000;
      });

      setMarkers(filteredMarkerList);
    }
  }, [geoCacheEnabled, allMarkers, position]);

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
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <MapInitializer />
        {selectedTileLayer === "osm" ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />
        )}
        {markers.map((marker) => {
          const markerDate = new Date(marker.timestamp.seconds * 1000); // Wandelt Firebase Timestamp in JavaScript Date um
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const isNew = markerDate >= oneDayAgo;

          return (
            <MapMarker
              key={marker.id}
              position={marker.coordinates}
              data={marker}
              isNew={isNew}
            />
          );
        })}
      </MapContainer>
      <ControlsContainer>
        <div>
          <Switch
            checked={selectedTileLayer === "esri"}
            onChange={toggleTileLayer}
            name="Toggle Map"
            inputProps={{ "aria-label": "Toggle between tile layers" }}
          />
          <label
            style={{
              color: selectedTileLayer === "esri" ? "white" : "#343aeb",
            }}
          >
            {selectedTileLayer === "esri" ? "Maps" : "Satellit"}
          </label>
        </div>
        <div>
          <Switch
            checked={geoCacheEnabled}
            onChange={() => setGeoCacheEnabled(!geoCacheEnabled)}
            name="Geocaching"
            inputProps={{ "aria-label": "Geocaching aktivieren/deaktivieren" }}
          />
          <label
            style={{
              color: selectedTileLayer === "esri" ? "white" : "#343aeb",
            }}
          >
            {geoCacheEnabled ? "200km" : "Alle"}
          </label>
        </div>
      </ControlsContainer>
      <StyledFab
        sx={{ backgroundColor: "hsl(250, 84%, 54%)" }}
        color="primary"
        aria-label="add"
        onClick={handleOpen}
      >
        <AddIcon />
      </StyledFab>
      <MarkerForm
        open={open}
        handleClose={handleClose}
        db={db}
        onMarkerAdded={onMarkerAdded}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "Top", horizontal: "Center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "50%" }}
        >
          Sticker erfolgreich hinzugefügt!
        </Alert>
      </Snackbar>
    </StyledMapContainer>
  );
};

export default Map;
